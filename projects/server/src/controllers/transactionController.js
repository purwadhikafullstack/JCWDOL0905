const db = require("../models");
const axios = require("axios")
const carts = db.Cart
const trans_header = db.Transaction_Header;
const trans_detail = db.Transaction_Detail;
const inventory = db.Inventory;
const user_voucher = db.User_Voucher
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

function checkDiscount(item){
    const today = new Date()
    const start = new Date(item.start_date)
    const end = new Date(item.end_date)

    if(start <= today && end >= today && item.product_qty >= item.min_purchase_qty){
      if(item.discount_type == 'percentage' || item.discount_type == 'amount'){
        return true
      }
    }

    return false
}
function countDiscount(item){
    if(item.discount_type == 'amount'){
        return item.product_price - item.discount_value
    } else if(item.discount_type == 'percentage'){
        return item.product_price - (item.discount_value/100 * item.product_price)
    }
}

module.exports = {
    getOrderList: async (req, res) => {
        try {
            const query = `select * from transaction_headers limit 10 offset 0;`;
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                message: "Successfully get order list",
                results,
            });
        } catch(error){
            console.log(error)
            res.status(404).send({isError: true, message: "Get order list failed"})
        }
    },
    createOrder: async (req, res) => {
        const t = await db.sequelize.transaction();
        try { 
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            let {total_price, total_weight, shipping_fee, voucher_discount_amount, id_shipping_service, id_user_voucher, id_branch, id_address} = req.body
            if(id_user_voucher==0){
                id_user_voucher = null
            }
            let final_price = total_price + shipping_fee - voucher_discount_amount
            // let {product_price, product_qty, id_inventory, product_name, product_image, weight} = req.body
            //address: city_id, detail, city, province  
            //branch: city_id, detail, city, province 

            const response = await axios.get(`${process.env.API_URL}/cart`, {
                'headers': {
                    'Authorization': `Bearer ${bearerToken}`,
                    'secret_key': process.env.SECRET_KEY
                }
            });
            const cartData = response.data.results;
            
            const order = await trans_header.create(
                {total_price, total_weight, shipping_fee, voucher_discount_amount, final_price, id_shipping_service, id_user_voucher, id_branch, id_address, id_user: user.id_user, order_status: 'waiting for payment'},
                {transaction: t}
            );

            for(let item of cartData){
                let {product_price, product_qty, id_inventory, stock} = item

                if(checkDiscount(item)){
                    product_price = countDiscount(item)
                }

                await trans_detail.create(
                    {product_price, product_qty, id_inventory, id_trans_header: order.dataValues.id},
                    {transaction: t}
                );
                await inventory.update({stock: stock - product_qty}, {where: { id: id_inventory }, transaction: t});

            }

            await carts.destroy({where: { id_user: user.id_user }}, {transaction: t});
            if(id_user_voucher!=null){
                await user_voucher.update({is_used: 1}, {where: { id: id_user_voucher }, transaction: t});
            }

            await t.commit()
            res.status(200).send({isError: false, message: "Create new order success", data: order});
          
        } catch (error) {
            console.log(error);
            await t.rollback()
            res.status(404).send({isError: true, message: "Create new order failed"})
        }
    },
}
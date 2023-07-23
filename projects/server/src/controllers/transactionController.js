const db = require("../models");
const axios = require("axios")
const {checkDiscount, countDiscount} = require("../helper/function")
const carts = db.Cart
const trans_header = db.Transaction_Header;
const trans_detail = db.Transaction_Detail;
const inventory = db.Inventory;
const inventory_history = db.Inventory_History;
const shipping_service = db.Shipping_Service;
const voucher = db.Voucher;
const user_voucher = db.User_Voucher
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    getOrderList: async (req, res) => {
        try {
            let limit = 5
            let branch = ""
            let user = ""
            let start = ""
            let end = ""
            let status = ""
            let orderId = ""
            let date = "desc"
            let price = ""
            let where = ""

            if(req.query.id_branch){
                branch = `id_branch = ${req.query.id_branch}`}
            if(req.query.id_user){
                user = `id_user = ${req.query.id_user}`
                if(branch != "") user = ` and ${user}`}
            if(req.query.start){
                start = `createdAt >= '${req.query.start}'`
                if(branch != "" || user != "") start = ` and ${start}`}
            if(req.query.end){
                end = `createdAt <= '${req.query.end}'`
                if(branch != "" || user != "" || start != "") end = ` and ${end}`}
            if(req.query.status){
                status = `order_status = '${req.query.status}'`
                if(branch != "" || user != "" || start != "" || end != "") status = ` and ${status}`}
            if(req.query.order_id){
                orderId = `id = '${req.query.order_id}'`
                if(branch != "" || user != "" || start != "" || end != "" || status != "") orderId = ` and ${orderId}`}
            if(user != "" || branch != "" || start != "" || end != "" || status != "" || orderId != ""){
                where = "where "}

            if(req.query.date=='asc') date = 'asc'
            if(req.query.price=='asc' || req.query.price == 'desc') price = `final_price ${req.query.price}, `

            let [total] = await db.sequelize.query(
                `select count(*) as total_transaction from Transaction_Headers
                ${where}${branch}${user}${start}${end}${status}${orderId};`
                );
            let total_page = Math.ceil(total[0].total_transaction/limit)

            let offset = (parseInt(req.query.page) - 1) * limit

            const query = `select * from Transaction_Headers
            ${where}${branch}${user}${start}${end}${status}${orderId}
            order by ${price}createdAt ${date}
            limit ${limit} offset ${offset};`;
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                message: "Successfully get order list",
                results,
                total_page,
            });
        } catch(error){
            console.log(error)
            res.status(404).send({isError: true, message: "Get order list failed"})
        }
    },

    getOrderDetail: async (req, res) => {
        try {
            const orderData = await trans_header.findOne({where: {id: req.params.id}, include: [{model: shipping_service}, {model: user_voucher, required: false, include: {model: voucher}}]});
            if (!orderData) {
                return res.status(400).send({code: 400, message: `Can't get order detail`})}
            res.status(200).send({code: 200, message: "Get order detail success", data: orderData});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get order detail failed"})}
    },

    getItem: async (req, res) => {
        try {
            const [results] = await db.sequelize.query(
                `select Transaction_Details.id, product_price, product_qty, product_name, product_image, weight, bonus_qty, id_inventory,
                Inventories.stock, Inventories.id_branch, Inventories.id_product
                from Transaction_Details
                join Inventories on Inventories.id = Transaction_Details.id_inventory
                where id_trans_header = ${req.params.id} order by Transaction_Details.createdAt desc;`
            );
            res.status(200).send({code: 200, message: "Get item success", data: results});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get item failed"})}
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

            const responseCart = await axios.get(`${process.env.API_URL}/cart`, {
                'headers': {
                    'Authorization': `Bearer ${bearerToken}`,
                    'secretKey': process.env.SECRET_KEY
                }
            });
            const cartData = responseCart.data.results;

            const responseBranch = await axios.get(`${process.env.API_URL}/branch/${id_branch}`, {
                'headers': {
                    'secretKey': process.env.SECRET_KEY
                }
            });
            const branchData = responseBranch.data.data;

            const responseAddress = await axios.get(`${process.env.API_URL}/address/${id_address}`, {
                'headers': {
                    'secretKey': process.env.SECRET_KEY
                }
            });
            const addressData = responseAddress.data.data;
            
            const order = await trans_header.create(
                {total_price, total_weight, shipping_fee, voucher_discount_amount, final_price, id_shipping_service, id_user_voucher, id_branch, id_address, id_user: user.id_user, order_status: 'waiting for payment',
                branch_name: branchData.branch_name, branch_address: branchData.address, branch_province: branchData.province, branch_city: branchData.city, branch_city_id: branchData.city_id,
                address_label: addressData.label, address_detail: addressData.address_detail, address_province: addressData.province, address_city: addressData.city, address_city_id: addressData.city_id
            },
                {transaction: t}
            );

            for(let item of cartData){
                let {product_price, product_qty, bonus_qty, id_inventory, stock, product_name, product_image, weight} = item

                if(checkDiscount(item)=='price'){
                    product_price = countDiscount(item)
                }

                await trans_detail.create(
                    {product_price, product_qty, bonus_qty, id_inventory, id_trans_header: order.dataValues.id, product_name, product_image, weight},
                    {transaction: t}
                );
            }

            await carts.destroy({where: { id_user: user.id_user }}, {transaction: t});
            if(id_user_voucher!=null) await user_voucher.update({is_used: 1}, {where: { id: id_user_voucher }, transaction: t});
            await t.commit()
            res.status(200).send({isError: false, message: "Create new order success", data: order});
          
        } catch (error) {
            console.log(error);
            await t.rollback()
            res.status(404).send({isError: true, message: "Create new order failed"})
        }
    },
}
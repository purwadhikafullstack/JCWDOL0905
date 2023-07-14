const db = require("../models");
const carts = db.Cart;
const users = db.User;
const inventories = db.Inventory;
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    getCart: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            const query = `select carts.id, carts.product_qty, carts.bonus_qty, carts.id_inventory,
            inventories.stock, inventories.id_branch,
            store_branches.branch_name, store_branches.city,
            products.id as product_id, products.product_name, products.product_price, products.weight, products.product_image, products.product_description,
            discounts.discount_type, discounts.discount_value, discounts.start_date, discounts.end_date
            from carts
            join inventories on carts.id_inventory = inventories.id
            join store_branches on store_branches.id = inventories.id_branch
            join products on inventories.id_product = products.id
            left join discounts on discounts.id_inventory = inventories.id
            where id_user=${user.id_user}
            ORDER BY carts.updatedAt DESC;`;
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                message: "Successfully fetch cart items",
                results,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get cart data failed"})}
    },

    countCartItem: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            let count = await carts.count({where:{ id_user: user.id_user }});
            res.status(200).send({
                message: "Cart successfully counted",
                data: count,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Count cart item failed"})
        }
    },

    addToCart: async (req, res) => {
        const inventoryId = req.params.idInventory;
        let bonus_qty = req.body.bonusQty;
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            const {quantity, stock} = req.body;

            let findInventory = await inventories.findOne({ where: { id: inventoryId } });
            if (!findInventory){
                return res.status(404).send({ isError: true, message: "Inventory not exist" });
            }

            let findCartItem = await carts.findOne({ where: { id_inventory: inventoryId } });
            if (findCartItem){
                const updatedQty = parseInt(findCartItem.product_qty) + parseInt(quantity);
                if (updatedQty > findInventory.stock) {
                    const updatedCartMax = carts.update({product_qty: findInventory.stock},
                    { where: {id: findCartItem.id}},
                    )

                    return res.status(201).send({ isError: false, message: "Successfully add item to cart at maximum stock", data: updatedCartMax },);
                }
                const updatedCart = carts.update(
                  { product_qty: updatedQty },
                  { where: { id: findCartItem.id } }
                );
                return res.status(200).send({ isError: false, message: "Successfully add quantity to cart", data: updatedCart },);
            }

            const addItem = await carts.create({
                product_qty: quantity,
                bonus_qty,
                id_user:user.id_user,
                id_inventory:inventoryId,
            });
        
            res.status(201).send({
                message: "Successfully add item to cart",
                data: addItem,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Add item to cart failed"})
        }
    },

    deleteCart: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            const result = await carts.destroy({
                where: { id_user: user.id_user },
            });
        
            res.status(201).send({
                message: "Successfully delete cart",
                deleteCount: result,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Delete cart failed"})
        }
    },

    deleteCartItem: async (req, res) => {
        try {
            let cartId = req.params.id

            let findCartItem = await carts.findOne({ where: { id: cartId } });
            if (!findCartItem){
                return res.status(404).send({ isError: true, message: "Cart item not exist" });
            }

            await carts.destroy({
                where: { id: cartId },
            });
        
            res.status(200).send({
                message: "Successfully delete cart item",
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Delete cart item failed"})
        }
    },

    updateQty: async (req, res) => {
        try {
            let cartId = req.params.id
            let num = req.body.num

            let findCartItem = await carts.findOne({ where: { id: cartId } });
            if (!findCartItem){
                return res.status(404).send({ isError: true, message: "Cart item not exist" });
            }

            let findInventory = await inventories.findOne({ where: { id: findCartItem.id_inventory } });
            if (!findInventory){
                return res.status(404).send({ isError: true, message: "Inventory not exist" });
            }

            let qty = findCartItem.product_qty
            let bonus_qty = findCartItem.bonus_qty
            let stock = findInventory.stock
            let newQty = qty + num

            if(newQty > stock){
                return res.status(400).send({isError: true, message: "Item quantity can't exceed the available stock"})
            }

            if((newQty + bonus_qty) > stock){
                return res.status(400).send({isError: true, message: "Item quantity + bonus item can't exceed the available stock"})
            }

            if(newQty < 1){
                await carts.destroy({
                    where: { id: cartId },
                });

                return res.status(200).send({ message: "Successfully delete cart item" });
            }

            if(bonus_qty>0) await carts.update({product_qty: newQty, bonus_qty: newQty}, {where: {id: cartId}});
            else await carts.update({product_qty: newQty}, {where: {id: cartId}});
        
            res.status(200).send({ message: "Successfully update cart" });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Update cart failed"})
        }
    },

    updateBonus: async (req, res) => {
        try {
            let cartId = req.params.id
            let findCartItem = await carts.findOne({ where: { id: cartId } });
            if (!findCartItem){
                return res.status(404).send({ isError: true, message: "Cart item not exist" });
            }

            await carts.update({bonus_qty: req.body.bonus_qty}, {where: { id: cartId }});
            res.status(200).send({ message: "Successfully update bonus item" });

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Update bonus item failed"})
        }
    },

}
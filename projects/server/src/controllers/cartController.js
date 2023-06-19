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

            const query = `select carts.id, carts.product_qty, carts.id_inventory,
            inventories.stock, inventories.id_branch,
            store_branches.branch_name, store_branches.city,
            products.id as product_id, products.product_name, products.product_price, products.weight, products.product_image, products.product_description,
            discounts.discount_type, discounts.discount_value, discounts.min_purchase_qty, discounts.start_date, discounts.end_date
            from carts
            join inventories on carts.id_inventory = inventories.id
            join store_branches on store_branches.id = inventories.id_branch
            join products on inventories.id_product = products.id
            left join discounts on discounts.id_inventory = inventories.id
            where id_user=${user.id_user};`;
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                status: "Successfully fetch cart items",
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
            res.status(201).send({
                status: "Cart successfully counted",
                data: count,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Count cart item failed"})
        }
    },

    addToCart: async (req, res) => {
        const inventoryId = req.params.idInventory;
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            let findInventory = await inventories.findOne({ where: { id: inventoryId } });
            if (!findInventory){
                return res.status(404).send({ isError: true, message: "Inventory not exist" });
            }

            let findCartItem = await carts.findOne({ where: { id_inventory: inventoryId } });
            if (findCartItem){
                return res.status(404).send({ isError: true, message: "Item already on cart" });
            }

            const addItem = await carts.create({
                product_qty: 1,
                id_user:user.id_user,
                id_inventory:inventoryId,
            });
        
            res.status(201).send({
                status: "Successfully add item to cart",
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
                status: "Successfully delete cart",
                deleteCount: result,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Delete cart failed"})
        }
    },
}
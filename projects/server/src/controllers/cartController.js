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

            const query = `SELECT Carts.id, Carts.product_qty, Carts.bonus_qty, Carts.id_inventory, Inventories.stock, Inventories.id_branch, Store_Branches.branch_name, Store_Branches.city, Products.id AS product_id, Products.product_name,
                COALESCE( Products.product_price - (Products.product_price * ActiveDiscounts.discount_value / 100), Products.product_price ) AS product_price,
                Products.weight, Products.product_image, Products.product_description, ActiveDiscounts.discount_type, ActiveDiscounts.discount_value, ActiveDiscounts.start_date, ActiveDiscounts.end_date
            FROM Carts
            JOIN Inventories ON Carts.id_inventory = Inventories.id
            JOIN Store_Branches ON Store_Branches.id = Inventories.id_branch
            JOIN Products ON Inventories.id_product = Products.id
            LEFT JOIN ( SELECT Discounts.id_inventory, Discounts.discount_type, Discounts.discount_value, Discounts.start_date, Discounts.end_date FROM Discounts WHERE now() BETWEEN Discounts.start_date AND Discounts.end_date ) AS ActiveDiscounts ON ActiveDiscounts.id_inventory = Inventories.id
            WHERE id_user = ${user.id_user} AND (Carts.product_qty + Carts.bonus_qty) <= Inventories.stock AND Products.deletedAt IS NULL AND Store_Branches.deletedAt IS NULL
            ORDER BY Carts.createdAt DESC;`
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({message: "Successfully fetch cart items", results,});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get cart data failed"})}
    },
    countCartItem: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);
            
            const query = `SELECT count(*) as count
            FROM Carts
            JOIN Inventories ON Carts.id_inventory = Inventories.id
            JOIN Store_Branches ON Store_Branches.id = Inventories.id_branch
            JOIN Products ON Inventories.id_product = Products.id
            LEFT JOIN ( SELECT Discounts.id_inventory, Discounts.discount_type, Discounts.discount_value, Discounts.start_date, Discounts.end_date FROM Discounts WHERE now() BETWEEN Discounts.start_date AND Discounts.end_date ) AS ActiveDiscounts ON ActiveDiscounts.id_inventory = Inventories.id
            WHERE id_user = ${user.id_user} AND (Carts.product_qty + Carts.bonus_qty) <= Inventories.stock AND Products.deletedAt IS NULL AND Store_Branches.deletedAt IS NULL
            ORDER BY Carts.createdAt DESC;`
            const [results] = await db.sequelize.query(query);
            let count = results[0].count
            res.status(200).send({message: "Cart successfully counted", data: count,});
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

            const {quantity} = req.body;
            
            let findInventory = await inventories.findOne({ where: { id: inventoryId } });
            if (!findInventory){
                return res.status(404).send({ isError: true, message: "Inventory not exist" });
            }

            let total_qty = parseInt(quantity) + parseInt(bonus_qty);

            if(findInventory.stock < (total_qty)) return res.status(400).send({isError: true, message: `Item quantity + bonus item can't exceed the available stock`})

            let findCartItem = await carts.findOne({ where: { id_inventory: inventoryId } });
            if (findCartItem){
                const updatedQty = parseInt(findCartItem.product_qty) + parseInt(quantity);
                const updateBonusQty = parseInt(findCartItem.bonus_qty) + parseInt(bonus_qty);
                if ((updatedQty + updateBonusQty) > findInventory.stock) {
                    return res.status(400).send({isError: true, message: "Item quantity + bonus item can't exceed the available stock"})
                }

                const updatedCart = carts.update(
                  { product_qty: updatedQty, bonus_qty: updateBonusQty },
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
                isError: false,
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

            const result = await carts.destroy({where: { id_user: user.id_user },});
            res.status(200).send({message: "Successfully delete cart", deleteCount: result,});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Delete cart failed"})
        }
    },

    deleteCartItem: async (req, res) => {
        try {
            let cartId = req.params.id
            let findCartItem = await carts.findOne({ where: { id: cartId } });
            if (!findCartItem){return res.status(404).send({ isError: true, message: "Cart item not exist" });}
            await carts.destroy({where: { id: cartId },});
            res.status(200).send({message: "Successfully delete cart item",});

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
            if (!findCartItem){return res.status(404).send({ isError: true, message: "Cart item not exist" });}

            let findInventory = await inventories.findOne({ where: { id: findCartItem.id_inventory } });
            if (!findInventory){return res.status(404).send({ isError: true, message: "Inventory not exist" });}

            let qty = findCartItem.product_qty
            let bonus_qty = findCartItem.bonus_qty
            let stock = findInventory.stock
            let newQty = qty + num

            if(newQty > stock){return res.status(400).send({isError: true, message: "Item quantity can't exceed the available stock"})}
            if((newQty + bonus_qty) > stock){return res.status(400).send({isError: true, message: "Item quantity + bonus item can't exceed the available stock"})}

            if(newQty < 1){
                await carts.destroy({where: { id: cartId },});
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
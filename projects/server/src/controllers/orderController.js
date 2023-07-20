const db = require("../models");
const axios = require("axios")
const carts = db.Cart
const trans_header = db.Transaction_Header;
const trans_detail = db.Transaction_Detail;
const inventory = db.Inventory;
const inventory_history = db.Inventory_History;
const user_voucher = db.User_Voucher
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;
const { Op } = require('sequelize')

module.exports = {
    cancelOrder: async (req, res) => {
        try {
            await trans_header.update({order_status: 'canceled'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Cancel order success"});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Cancel order failed"})}
    },
    uploadPayment: async (req, res) => {
        try {
            if(req.file != undefined){
                let imageUrl = `${process.env.API_URL}/media/payment/${req.file.filename}`;
                await trans_header.update({payment_proof: imageUrl, order_status: 'waiting for payment confirmation'}, {where: {id: req.params.id}});
            }

            res.status(200).send({isError: false, message: "Upload payment success"});
          
        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Upload payment failed"})}
    },
    acceptPayment: async (req, res) => {
        try {
            await trans_header.update({order_status: 'processed'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Order processed successfully"});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Process order failed"})}
    },
    rejectPayment: async (req, res) => {
        try {
            await trans_header.update({order_status: 'waiting for payment'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Reject payment success"});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Reject payment failed"})}
    },
    shipOrder: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const response = await axios.get(`${process.env.API_URL}/transaction/item/${req.params.id}`, {
                'headers': {
                    'secretKey': process.env.SECRET_KEY
                }
            });
            const itemData = response.data.data;

            for(let item of itemData){
                let newStock = item.stock - item.product_qty - item.bonus_qty
                if(newStock < 0) return res.status(400).send({isError: true, message: `The total quantity of ${item.product_name} products on the transaction exceeds the available stock`})
                await inventory.update({stock: newStock}, {where: { id: item.id_inventory }}, {transaction: t});
                await inventory_history.create({status: 'out', reference: 'sales', quantity: (item.product_qty + item.bonus_qty), id_inventory: item.id_inventory, current_stock: newStock}, {transaction: t});
            }

            //where carts > stock
            
            await trans_header.update({order_status: 'shipped'}, {where: {id: req.params.id}}, {transaction: t});
            await t.commit()
            res.status(200).send({code: 200, message: "Shipping order success"});

        } catch (error) {
            console.log(error);
            await t.rollback()
            res.status(404).send({isError: true, message: "Shipping order failed"})
        }
    },
    receiveOrder: async (req, res) => {
        try {
            await trans_header.update({order_status: 'done'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Confirm receive order success"});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Confirm receive order failed"})}
    },
    updateStatus: async (req, res) => {
        const t = await db.sequelize.transaction();
        try{
            let yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)

            let pastWeek = new Date()
            pastWeek.setDate(pastWeek.getDate() - 7)

            await trans_header.update({order_status: 'canceled'}, {where: { order_status: 'waiting for payment', updatedAt: {[Op.lt]: yesterday} }}, {transaction: t});
            await trans_header.update({order_status: 'done'}, {where: { order_status: 'shipped', updatedAt: {[Op.lt]: pastWeek} }}, {transaction: t});

            await t.commit()
            res.status(200).send({isError: false, message: "Update status success"});

        } catch(error){
            console.log(error);
            await t.rollback()
            res.status(400).send({isError: true, message: "Update order status failed"})
        }
    }
}
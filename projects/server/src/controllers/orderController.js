const db = require("../models");
const axios = require("axios")
const carts = db.Cart
const trans_header = db.Transaction_Header;
const trans_detail = db.Transaction_Detail;
const inventory = db.Inventory;
const user_voucher = db.User_Voucher
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    cancelOrder: async (req, res) => {
        try {
            await trans_header.update({order_status: 'canceled'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Cancel order success"});

        } catch (error) {
            console.log(error);
            console.log("ini lah");
            res.status(404).send({isError: true, message: "Cancel order failed"})}
    },
    uploadPayment: async (req, res) => {
        try {
            if(req.file != undefined){
                let imageUrl = req.protocol + "://" + req.get("host") + "/api/media/payment/" + req.file.filename;
                await trans_header.update({payment_proof: imageUrl, order_status: 'waiting for payment confirmation'}, {where: {id: req.params.id}});
            }

            res.status(200).send({isError: false, message: "Upload payment success"});
          
        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Upload payment failed"})}
    },
}
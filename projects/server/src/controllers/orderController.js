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
        try {
            await trans_header.update({order_status: 'shipped'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Shipping order success"});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Shipping order failed"})}
    },
    receiveOrder: async (req, res) => {
        try {
            await trans_header.update({order_status: 'done'}, {where: {id: req.params.id}});
            res.status(200).send({code: 200, message: "Confirm receive order success"});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Confirm receive order failed"})}
    },
}
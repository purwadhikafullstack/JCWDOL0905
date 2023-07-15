const db = require("../models");
const shipping = db.Shipping_Service;
const axios = require("axios")

module.exports = {
    getShippingService: async (req, res) => {
        try {
            const shippingData = await shipping.findAll();
            if (!shippingData) {
                return res.status(400).send({code: 400, message: `Can't get shipping service data`})}
            res.status(200).send({code: 200, message: "Get shipping service success", data: shippingData});

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Get shipping data failed"})}
    },

    getShippingServiceDetail: async (req, res) => {
        try {
            const shippingDetail = await shipping.findOne({where: {id: req.params.id}});
            if (!shippingDetail) {
                return res.status(400).send({code: 400, message: `Can't get shipping service detail`})}
            res.status(200).send({code: 200, message: "Get shipping service detail success", data: shippingDetail});

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Get shipping detail failed"})}
    },

    calculateCost: async (req, res) => {
        try {
            let addressDetail = await axios.get(`http://localhost:8000/api/address/${req.body.addressId}`, {
                'headers': {
                    'secret_key': process.env.SECRET_KEY
                }
            })

            let branchDetail = await axios.get(`http://localhost:8000/api/branch/${req.body.branchId}`, {
                'headers': {
                    'secret_key': process.env.SECRET_KEY
                }
            })

            let courierResponse = await axios.get(`http://localhost:8000/api/shipping/${req.body.serviceId}`, {
                'headers': {
                    'secret_key': process.env.SECRET_KEY
                }
            })

            const courierDetail = courierResponse.data.data

            data = {
                origin: branchDetail.data.data.city_id,
                destination: addressDetail.data.data.city_id,
                weight: req.body.orderWeight,
                courier: courierDetail.courier.toLowerCase(),
            }

            if (!addressDetail || !branchDetail || !courierResponse) {
              
                return res.status(400).send({sError: true, message: `Calculate shipping cost failed`})}

            const costData = await axios.post('https://api.rajaongkir.com/starter/cost', data, {
                'headers': {
                    'key': process.env.KEY_RAJA_ONGKIR_API
                }
            })

            const result = costData.data.rajaongkir.results[0].costs
            let cost = result.find(x => x.service == courierDetail.service_name)

            if(cost == undefined){
                return res.status(400).send({isError: true, message: `${courierDetail.courier} (${courierDetail.service_name}) service not available`})
            }


            res.status(200).send({code: 200, message: "Calculate shipping cost success", data: cost});

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Calculate shipping cost failed"})}
    },
}
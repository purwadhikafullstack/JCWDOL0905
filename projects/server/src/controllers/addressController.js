const db = require("../models");
const axios = require("axios")
const provinceList = require("../helper/province")
const address = db.Address;
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    getUserAddress: async (req, res) => {
        try {
            const addressData = await address.findAll({where: {id_user: req.params.id_user}});
            if (!addressData) {
                return res.status(400).send({code: 400, message: `Can't get user address data`})}
            res.status(200).send({code: 200, message: "Get user address data success", data: addressData});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get user address data failed"})}
    },

    getAddressDetail: async (req, res) => {
        try {
            const addressData = await address.findOne({where: {id: req.params.id}});
            if (!addressData) {
                return res.status(400).send({code: 400, message: `Can't get address detail`})}
            res.status(200).send({code: 200, message: "Get address detail success", data: addressData});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get address detail failed"})}
    },

    addNewAddress: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);
            const id_user = user.id_user
            let {address_detail, cityId, provinceId, label, is_main} = req.body

            if(is_main==true){
                await address.update({is_main: 0}, {where: {is_main: 1, id_user}});
                is_main = 1
            }else{
                is_main = 0
            }

            let provinceData = provinceList.find(province => province.province_id == provinceId)
            let province = provinceData.province

            let response = await axios.get(`${process.env.API_URL}/city/${cityId}`, {
                'headers': {
                    'secretKey': `${process.env.SECRET_KEY}`
                }
            })
            city = response.data.data.city_name

            if(!address_detail || !cityId || !provinceId || !label){
                return res.status(400).send({isError: true, message: "Please fill all required fields"});
            }

            let responseOpenCage = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.KEY_OPENCAGE_API}&pretty=1&q=${address_detail} ${city} ${province}`)
            let longitude = responseOpenCage.data.results[0].geometry.lng
            let latitude = responseOpenCage.data.results[0].geometry.lat

            const newAddress = await address.create({address_detail, city, city_id : cityId, province, province_id : provinceId, label, longitude, latitude, is_main, id_user});
        
            res.status(201).send({
                message: "Successfully add new address",
                data: newAddress,
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Add address data failed"})
        }
    },

    updateAddress: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);
            const id_user = user.id_user
            let {address_detail, cityId, provinceId, label, is_main} = req.body

            if(is_main==true){
                await address.update({is_main: 0}, {where: {is_main: 1, id_user}});
                is_main = 1
            }else{
                is_main = 0
            }

            let provinceData = provinceList.find(province => province.province_id == provinceId)
            let province = provinceData.province

            let response = await axios.get(`${process.env.API_URL}/city/${cityId}`, {
                'headers': {
                    'secretKey': `${process.env.SECRET_KEY}`
                }
            })
            city = response.data.data.city_name

            if(!address_detail || !cityId || !provinceId || !label){
                return res.status(400).send({isError: true, message: "Please fill all required fields"});
            }

            let responseOpenCage = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.KEY_OPENCAGE_API}&pretty=1&q=${address_detail} ${city} ${province}`)
            let longitude = responseOpenCage.data.results[0].geometry.lng
            let latitude = responseOpenCage.data.results[0].geometry.lat

            const updateAddress = await address.update({address_detail, city, city_id : cityId, province, province_id : provinceId, label, longitude, latitude, is_main}, {where: {id: req.params.id}});
        
            res.status(200).send({
                message: "Successfully update address",
                data: updateAddress,
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Update address data failed"})
        }
    },

    deleteAddress: async (req, res) => {
        try {
            let findAddress = await address.findOne({ where: { id: req.params.id } });
            if (!findAddress){
                return res.status(404).send({ isError: true, message: "Address not exist" });
            }

            await address.destroy({
                where: { id: req.params.id },
            });
        
            res.status(200).send({
                message: "Successfully delete address",
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Delete address failed"})
        }
    }
}
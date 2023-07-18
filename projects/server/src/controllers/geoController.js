const db = require("../models");
const branch = db.Store_Branch;
const axios = require("axios")
const { Op } = require("sequelize");

module.exports = {
    getLocation: async (req, res) => {
        try {
            let latitude = req.query.latitude
            let longitude = req.query.longitude
            let url = `https://api.opencagedata.com/geocode/v1/json?key=${process.env.KEY_OPENCAGE_API}&pretty=1&q=${latitude}%2C+${longitude}`;
            const response = await axios.get(url)
            res.status(200).send({ isError: false, message: "Get location success", data: response.data.results[0] });
        } catch (error) {
          console.log(error);
          res.status(404).send({ isError: true, message: "Get location failed" });
        }
    },
}
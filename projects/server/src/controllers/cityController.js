const axios = require("axios")

module.exports = {
    getCity: async (req, res) => {
        try {
            const cityData = await axios.get(`https://api.rajaongkir.com/starter/city?province=${req.query.provinceId}`, {
                'headers': {
                    'key': process.env.KEY_RAJA_ONGKIR_API
                }
            })

            res.status(200).send({code: 200, message: "Get city data success", data: cityData.data.rajaongkir.results});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get city data failed"})}
    },

    getCityById: async (req, res) => {
        try {
            const cityData = await axios.get(`https://api.rajaongkir.com/starter/city?id=${req.params.id}`, {
                'headers': {
                    'key': process.env.KEY_RAJA_ONGKIR_API
                }
            })

            res.status(200).send({code: 200, message: "Get city detail success", data: cityData.data.rajaongkir.results});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get city detail failed"})}
    },
}
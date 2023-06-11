const db = require("../models");
const address = db.Address;

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
}
const db = require("../models");
const branch = db.Store_Branch;

module.exports = {
    getBranch: async (req, res) => {
        try {
            const branchData = await branch.findAll();
            if (!branchData) {
                return res.status(400).send({code: 400, message: `Cant't get branch data`})}
            res.status(200).send({code: 200, message: "Get branch data success", data: branchData});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get branch data failed"})}
    },
}
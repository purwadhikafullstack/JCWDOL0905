const db = require("../models");
const address = db.Address;

module.exports = {
    getSuggestedProduct: async (req, res) => {
        try {
            const query = `SELECT inventories.id, stock, pr.product_name, pr.product_price, pr.product_description, pr.product_image, pr.weight
            FROM inventories
            join products pr on pr.id = inventories.id_product
            where id_branch=${req.params.id_branch}
            limit 6;`;
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                status: "Successfully fetch products",
                results,
            });

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get product data failed"})}
    },
}
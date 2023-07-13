const db = require("../models");
const address = db.Address;

module.exports = {
    getSuggestedProduct: async (req, res) => {
        try {
            const query = `SELECT inventories.id, stock, pr.product_name, pr.product_price, pr.product_description, pr.product_image, pr.weight,
            br.branch_name, br.city,
            discounts.discount_type, discounts.discount_value, discounts.start_date, discounts.end_date
            FROM inventories
            join products pr on pr.id = inventories.id_product
            join store_branches br on br.id = inventories.id_branch
            left join discounts on discounts.id_inventory = inventories.id
            where id_branch=${req.params.id_branch}
            limit 10;`;
        
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
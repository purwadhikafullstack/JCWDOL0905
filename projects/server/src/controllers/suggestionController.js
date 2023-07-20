const db = require("../models");
const address = db.Address;

module.exports = {
    getSuggestedProduct: async (req, res) => {
        try {
            const query = `SELECT Inventories.id, stock, pr.product_name, pr.product_price, pr.product_description, pr.product_image, pr.weight,
            br.branch_name, br.city,
            Discounts.discount_type, Discounts.discount_value, Discounts.start_date, Discounts.end_date
            FROM Inventories
            join Products pr on pr.id = Inventories.id_product
            join Store_Branches br on br.id = Inventories.id_branch
            left join Discounts on Discounts.id_inventory = Inventories.id
            where id_branch=${req.params.id_branch} and stock>0
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
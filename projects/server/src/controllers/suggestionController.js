const db = require("../models");
const address = db.Address;

module.exports = {
    getSuggestedProduct: async (req, res) => {
        try {        
            const query = `SELECT Inventories.id, stock, pr.product_name, pr.product_price, pr.product_description, pr.product_image, pr.weight, br.branch_name, br.city,
                COALESCE(Discounts.discount_type, 'No Discount') AS discount_type,
                COALESCE(Discounts.discount_value, 0) AS discount_value,
                COALESCE(Discounts.start_date, CURDATE()) AS start_date,
                COALESCE(Discounts.end_date, CURDATE()) AS end_date
            FROM Inventories
            JOIN Products pr ON pr.id = Inventories.id_product
            JOIN Store_Branches br ON br.id = Inventories.id_branch
            LEFT JOIN Discounts ON Discounts.id_inventory = Inventories.id AND CURDATE() BETWEEN Discounts.start_date AND Discounts.end_date
            WHERE id_branch = ${req.params.id_branch}
                AND stock > 0
                AND pr.deletedAt IS NULL
            LIMIT 10;`
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
const db = require("../models");
const vouchers = db.Voucher;
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    getUserVoucher: async (req, res) => {
        try {
            let bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.split(' ')[1]
            const user = jwt.verify(bearerToken, jwtKey);

            const query = `select user_vouchers.id, user_vouchers.id,
            vouchers.voucher_type, vouchers.voucher_kind, vouchers.voucher_code, vouchers.voucher_value,
            vouchers.max_discount, vouchers.min_purchase_amount, vouchers.start_date, vouchers.end_date, vouchers.id_inventory
            from user_vouchers
            join vouchers on vouchers.id = user_vouchers.id_voucher
            where id_user = ${user.id_user}
            and is_used = 0
            and now() between vouchers.start_date and vouchers.end_date;`;
        
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                message: "Successfully fetch user voucher",
                results,
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({isError: true, message: "Get user voucher failed"})}
    },
}
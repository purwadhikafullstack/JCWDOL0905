const db = require("../models");
const voucher = db.Voucher;
const inventory = db.Inventory;
const product = db.Product;
const branch = db.Store_Branch;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;
const user_voucher = db.User_Voucher

module.exports = {
  createVoucher: async (req, res) => {
    try {
      let {
        voucher_type,
        id_inventory,
        voucher_kind,
        voucher_value,
        max_discount,
        min_purchase_amount,
        start_date,
        end_date,
      } = req.body;

      if (
        !voucher_type ||
        !voucher_kind ||
        !voucher_value ||
        !start_date ||
        !end_date
      ) {
        return res.status(400).send({
          isError: true,
          message: "Please complete the data",
        });
      }

      let data = { ...req.body };
      data.start_date = new Date(start_date);
      data.end_date = new Date(end_date);

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (new Date(start_date) < now) {
        return res.status(400).send({
          isError: true,
          message: "Start date is invalid",
        });
      }

      if (new Date(end_date) < new Date(start_date)) {
        return res.status(400).send({
          isError: true,
          message: "End date is invalid",
        });
      }

      if (voucher_type === "product") {
        if (!id_inventory) {
          return res.status(400).send({
            isError: true,
            message: "Please choose a product",
          });
        }

        const featuredProduct = await inventory.findOne({
          where: {
            id: id_inventory,
          },
          include: product,
        });

        if (featuredProduct.stock < 1) {
          return res.status(400).send({
            isError: true,
            message: "Insufficient stock",
          });
        }

        if (
          voucher_kind === "amount" &&
          voucher_value > featuredProduct.Product.product_price
        ) {
          return res.status(400).send({
            isError: true,
            message: "Voucher value cannot be greater than the product's price",
          });
        }

        if (voucher_kind === "percentage" && voucher_value > 100) {
          return res.status(400).send({
            isError: true,
            message: "Voucher value cannot be greater than 100",
          });
        }

        const result = await voucher.create(data);
        return res.status(200).send({
          isError: false,
          message: "Successfully create a new voucher",
          data: result,
        });
      }

      if (voucher_type === "total purchase") {
        if (!max_discount || !min_purchase_amount) {
          return res.status(400).send({
            isError: true,
            message: "Please complete the data",
          });
        }

        if (voucher_kind === "percentage" && voucher_value > 100) {
          return res.status(400).send({
            isError: true,
            message: "Voucher value cannot be greater than or equal to 100",
          });
        }

        const result = await voucher.create(data);
        return res.status(200).send({
          isError: false,
          message: "Successfully create a new voucher",
          data: result,
        });
      }

      const result = await voucher.create(data);
      return res.status(200).send({
        isError: false,
        message: "Successfully create a new voucher",
        data: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error creating a voucher",
      });
    }
  },
  getAllVouchers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 12;
      const sort = req.query.sort || "ASC";
      const voucherCode = req.query.code || null;
      const voucherType = req.query.type || null;

      const typeQuery = voucherType ? { voucher_type: voucherType } : {};
      // const codeQuery = voucherCode ? { voucher_code: { [Op.like]: `%${voucherCode}%` } } : {};

      const result = await voucher.findAndCountAll({
        where: {
          end_date: {
            [Op.gte]: new Date(),
          },
          ...typeQuery,
        },
        include: {
          required: false,
          model: inventory,
          include: [
            { model: product },
            { model: branch, attributes: ["branch_name"] },
          ],
        },
        order: [["createdAt", sort]],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      res.status(200).send({
        isError: true,
        message: "Successfully get all vouchers",
        data: result.rows,
        count: result.count,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error get all vouchers",
      });
    }
  },

  getUserVoucher: async (req, res) => {
    try {
      let bearerToken = req.headers["authorization"];
      bearerToken = bearerToken.split(" ")[1];
      const user = jwt.verify(bearerToken, jwtKey);

      const query = `select user_vouchers.id, user_vouchers.id,
        vouchers.voucher_type, vouchers.voucher_kind, vouchers.voucher_value,
        vouchers.max_discount, vouchers.min_purchase_amount, vouchers.start_date, vouchers.end_date, vouchers.id_inventory,
        products.product_name, products.product_price
        from user_vouchers
        join vouchers on vouchers.id = user_vouchers.id_voucher
        left join inventories on vouchers.id_inventory = inventories.id
        left join products on products.id = inventories.id_product
        where id_user = ${user.id_user}
        and is_used = 0
        and now() between vouchers.start_date and vouchers.end_date;`;

        const [results] = await db.sequelize.query(query);
        res.status(200).send({ message: "Successfully fetch user voucher", results });

    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ isError: true, message: "Get user voucher failed" });
    }
  },

  getVoucherClaimable: async (req, res) => {
    try {
      const { userId } = req.params;

      const voucherQuery = `SELECT
      Vouchers.id,
      Vouchers.voucher_type,
      Vouchers.voucher_kind,
      Vouchers.voucher_value,
      Vouchers.max_discount,
      Vouchers.min_purchase_amount,
      Vouchers.start_date,
      Vouchers.end_date,
      Products.product_name,
      CASE 
        WHEN Vouchers.voucher_type = 'total purchase'
          AND COALESCE((
            SELECT SUM(Transaction_Headers.final_price) AS Total_price
            FROM Transaction_Headers
            WHERE Transaction_Headers.id_user = ${userId} AND Transaction_Headers.order_status IN ('done','shipped')
          ), 0) > Vouchers.min_purchase_amount THEN 'CLAIMABLE'
          
        WHEN Vouchers.voucher_type = 'total purchase'
          AND COALESCE((
            SELECT SUM(Transaction_Headers.final_price) AS Total_price
            FROM Transaction_Headers
            WHERE Transaction_Headers.id_user = ${userId} AND Transaction_Headers.order_status IN ('done','shipped')
          ), 0) < Vouchers.min_purchase_amount THEN 'NOT_CLAIMABLE_TXN'
          
        WHEN Vouchers.voucher_type = 'shipping'
          AND COALESCE((
            SELECT COUNT(*) AS Count
            FROM Transaction_Headers
            WHERE Transaction_Headers.id_user = ${userId} AND Transaction_Headers.order_status IN ('done','shipped')
          ), 0) > 3 THEN 'CLAIMABLE'
          
        WHEN Vouchers.voucher_type = 'shipping'
          AND COALESCE((
            SELECT COUNT(*) AS Count
            FROM Transaction_Headers
            WHERE Transaction_Headers.id_user = ${userId} AND Transaction_Headers.order_status IN ('done','shipped')
          ), 0) < 3 THEN 'NOT_CLAIMABLE_COUNT'
          
        ELSE 'CLAIMABLE'
      END AS Statuses
    FROM
      Vouchers
    LEFT JOIN Inventories ON Vouchers.id_inventory = Inventories.id
    LEFT JOIN Products ON Inventories.id_product = Products.id
    WHERE now() between vouchers.start_date and vouchers.end_date;
    `;
      const [data] = await db.sequelize.query(voucherQuery);
      res.status(200).send({
        message: "Successfully fetch user voucher",
        data: data,
      });
    } catch (error) {
      res
        .status(400)
        .send({ isError: true, message: "Get available voucher failed" });
    }
  },

  getUsedVoucher: async (req, res) => {
    try {
      const { userId } = req.params;

      const usedVoucherQuery = `SELECT
      User_Vouchers.id_voucher,
      User_Vouchers.is_used
    FROM
      User_Vouchers
    WHERE
      User_Vouchers.id_user =  ${userId};`;

      const [data] = await db.sequelize.query(usedVoucherQuery);
      res.status(200).send({
        message: "Successfully fetch user voucher",
        data: data,
      });
    } catch (error) {
      res
        .status(400)
        .send({ isError: true, message: "Get available voucher failed" });
    }
  },
  postClaimVoucher: async (req, res) => {
    try {
      const {userId, voucherId} = req.body

      const result = await user_voucher.create({
        id_user: userId,
        id_voucher: voucherId,
        is_used: 0
    });

    res.status(201).send({
        message: "Successfully claim voucher",
        data: result,
    });
      
    } catch (error) {
      res
        .status(400)
        .send({ isError: true, message: "Claim voucher failed" });
    }
  }
};

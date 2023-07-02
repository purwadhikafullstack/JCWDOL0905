const db = require("../models");
const voucher = db.Voucher;
const inventory = db.Inventory;
const product = db.Product;
const branch = db.Store_Branch;
const { Op } = require("sequelize");


module.exports = {
  createVoucher: async (req, res) => {
    try {
      let { voucher_type, id_inventory, voucher_kind, voucher_code, voucher_value, max_discount, min_purchase_amount, start_date, end_date } = req.body;
      
      if ( !voucher_type || !voucher_kind || !voucher_code || !voucher_value || !start_date || !end_date) {
        return res.status(400).send({
          isError: true,
          message: "Please complete the data",
        });
      }
      
      let data = {...req.body};
      data.start_date = new Date(start_date)
      data.end_date = new Date(end_date)

      const now = new Date();
      now.setHours(0,0,0,0)
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

      const voucherCodeExist = await voucher.findOne({
        where : {
          voucher_code: voucher_code
        }
      })

      if (voucherCodeExist) {
        return res.status(400).send({
          isError: true,
          message: "Voucher code already exists",
        })
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
            message:
              "Voucher value cannot be greater than the product's price",
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
        const result = await voucher.findAndCountAll({
          where: {
            end_date: {
              [Op.gte]: new Date(),
            },
          },
          include: {
            required : false,
            model: inventory,
            include: [{model: product}, {model: branch, attributes: ["branch_name"]}]
          },
        });

        res.status(200).send({
          isError: true,
          message: "Successfully get all vouchers",
          data: result
        });

    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error get all vouchers",
      });
    }
  },
};

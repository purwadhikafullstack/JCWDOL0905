const db = require("../models");
const discount = db.Discount;
const inventory = db.Inventory;
const product = db.Product;
const { Op } = require("sequelize");

module.exports = {
  createDiscount: async (req, res) => {
    try {
      const {id_inventory, discount_type, discount_value, min_purchase_qty, start_date, end_date} = req.body;

      if (!id_inventory || !discount_type || !min_purchase_qty || !start_date || !end_date) {
        return res.status(400).send({
            isError: true,
            message: "Please complete the data"
        })
      }

      if (discount_type === "percentage" || discount_type === "amount") {
        if (!discount_value) {
          return res.status(400).send({
            isError: true,
            message: "Please provide a discount value",
          });
        }
      }

      let data = {...req.body}
      
      const now = new Date();
      now.setHours(0,0,0,0)
      if (new Date(start_date) < now) {
        return res.status(400).send({
            isError: true,
            message: "Start date is invalid"
        })
      }

      if (new Date(end_date) <= new Date(start_date)) {
        return res.status(400).send({
            isError: true,
            message: "End date is invalid"
        })
      }

      const discountsExist = await discount.findAll({
        where: {
            id_inventory: id_inventory,
            start_date: {
                [Op.lte]: data.end_date // Discount starts before or on end_date
            },
            end_date: {
                [Op.gte]: data.start_date // Discount ends after or on start_date
              }
        }
      })

      if (discountsExist.length > 0) {
        return res.status(400).send({
            isError: true,
            message: "An existing discount is still running"
        })
      }

      const discountedProduct = await inventory.findOne({
        where: {
            id: id_inventory,
        },
        include: product
      })

      if (discountedProduct.stock < 1) {
        return res.status(400).send({
            isError: true,
            message: "Insufficient stock"
        })
      }
    
      if (discount_type === "percentage" && discount_value > 100) {
        return res.status(400).send({
            isError: true,
            message: "Discount value cannot be greater than 100"
        })
      }

      if (discount_type === "amount" && discount_value >= discountedProduct.Product.product_price) {
        return res.status(400).send({
            isError: true,
            message: "Discount value cannot be greater than or equal to the product's price"
        })
      }

      if (discount_type === "buy one get one" && discountedProduct.stock < 2) {
        return res.status(400).send({
            isError: true,
            message: "Insufficient stock"
        })
      }

      const result = await discount.create(data)
      res.status(200).send({
        isError: false,
        message: "Successfully create a new discount",
        data: result
      })
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error creating a discount",
      });
    }
  },
  getAllDiscounts: async (req, res) => {
    try {
      const branchId = req.query.branchId || 1;
      console.log("branchId", branchId)
      
      const result = await discount.findAndCountAll({
        where: {
          end_date: {
              [Op.gte]: new Date(),
            },
        },
        include: {
            model: inventory,
            where: { id_branch: branchId },
            include: {
                model: product
            }
        },
      })
        
        res.status(200).send({
          isError: true,
          message: "Successfully get all discounts",
          data: result.rows,
          count: result.count,
        });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error get all discounts",
      });
    }
  },
  
};

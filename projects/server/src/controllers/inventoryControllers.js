const db = require("../models");
const inventory = db.Inventory;
const product = db.Product;
const { Op } = require("sequelize");

module.exports = {
  addInventory: async (req, res) => {
    try {
      const { id_product, id_branch, stock } = req.body;

      if (!id_product || !id_branch || !stock) {
        return res.status(400).send({
          isError: true,
          message: "Please complete your data",
        });
      }

      const newInventory = await inventory.create(req.body);

      res.status(200).send({
        isError: false,
        message: "Successfully add a product to store branch",
        data: newInventory,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error adding a product to store branch",
      });
    }
  },
  fetchAllInventories: async (req, res) => {
    try {
      const branchId = req.query.branchId;
      const page = parseInt(req.query.page) || 1;
      const pageSize = 12;

      const category_id = parseInt(req.query.category) || null;
      const productName = req.query.name || null;

      const categoryQuery = category_id ? { id_category: category_id } : {};
      const productQuery = productName ? { product_name: { [Op.like]: `%${productName}%` } } : {};

      const allInventories = await inventory.findAndCountAll({
        where: {
          id_branch: branchId,
        },
        include: {
          model: product,
          where: { ...categoryQuery, ...productQuery },
        },
        order: [[{ model: product }, req.query.order, req.query.sort]],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      
      res.status(200).send({
        isError: false,
        message: "Successfully fetch inventories",
        data: allInventories.rows,
        count: allInventories.count,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Fetch inventories failed",
      });
    }
  },
};

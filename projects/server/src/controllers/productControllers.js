const db = require("../models");
const product = db.Product;
const category = db.Category;
const stores = db.Store_Branch;
const inventory = db.Inventory;
const inventoryHistory = db.Inventory_History;
const {Op} = require("sequelize");

module.exports = {
  addProduct: async (req, res) => {
    try {
        const { product_name, product_price, weight, product_description, id_category } = req.body;

        if (!product_name || !product_price || !weight || !product_description || !id_category) {
          return res.status(400).send({
            isError: true,
            message: "Please complete your data",
          });
        }

        const isProductExist = await product.findOne({
          where: {
            product_name,
          },
        });
  
        if (isProductExist) {
          return res.status(400).send({
            isError: true,
            message: "Product name already exist",
          });
        }

        if (!req.file) {
          return res.status(400).send({
            isError: true,
            message: "No file chosen",
          });
        }

        let imageUrl = process.env.API_URL + "/products/" + req.file.filename;

        const newProduct = await product.create({
          product_name: product_name,
          product_price: product_price,
          weight: weight,
          product_description: product_description,
          product_image: imageUrl,
          id_category: id_category,
        });

        const branches = await stores.findAll();
        const newInventories = [];
        const initStocks = [];

        for (const branch of branches) {
          const newInventory = await inventory.create({
            id_product: newProduct.id,
            id_branch: branch.id,
            stock: 0
          });
          newInventories.push(newInventory);
      
          const initStock = await inventoryHistory.create({
            status: "in",
            reference: "initial",
            quantity: 0,
            id_inventory: newInventory.id,
            current_stock: 0
          });
          initStocks.push(initStock);
        }

        res.status(200).send({
          isError: false,
          message: "Successfully add a product",
          data: newProduct,
        });  
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error adding a product",
      });
    }
  },
  fetchAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 8;
      const sort = req.query.sort || "ASC";
      const order = req.query.order || "product_name";

      const category_id = parseInt(req.query.category) || null;
      const productName = req.query.name || null;
      const categoryQuery = category_id ? { id_category: category_id } : {};
      const productQuery = productName ? { product_name: { [Op.like]: `%${productName}%` } } : {};

      const allProducts = await product.findAndCountAll({
        where: {
          ...categoryQuery, ...productQuery
        },
        include: { model: category, attributes: ['category_name'] },
        order: [[order, sort]],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      res.status(200).send({
        isError: false,
        message: "Successfully retrieved all products",
        data: allProducts.rows,
        count: allProducts.count,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        isError: true,
        message: "Fetch all products failed",
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {product_name} = req.body;
      const productWithSameName = await product.findOne({
        where: {
          product_name: product_name,
          id: { [Op.ne]: req.params.id }, // Excludes the current product ID
        },
      });

      if (productWithSameName) {
        return res.status(400).send({
          isError: false,
          message: "Same product name already exists",
        });
      }

      if (!req.file) {
        await product.update(
          {
            ...req.body
          },
          {
            where: { id: req.params.id },
          }
        );

        return res.status(200).send({
          isError: false,
          message: "Successfully update a product",
        });
      }

      let imageUrl = process.env.API_URL + "/products/" + req.file.filename;

      await product.update(
        {
          ...req.body,
          product_image: imageUrl
        },
        {
          where: { id: req.params.id },
        }
      );

      res.status(200).send({
        isError: false,
        message: "Successfully update a product",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        isError: true,
        message: "Update product failed",
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await product.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({
        isError: false,
        message: "Successfully delete category",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Delete product failed",
      });
    }
  },
};

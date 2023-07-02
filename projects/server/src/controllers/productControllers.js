const db = require("../models");
const product = db.Product;
const category = db.Category;
const {Op} = require("sequelize");

module.exports = {
  addProduct: async (req, res) => {
    try {
        const { product_name, product_price, weight, product_description, id_category, image } = req.body;

        if (!product_name || !product_price || !weight || !product_description || !id_category) {
          return res.status(400).send({
            isError: true,
            message: "Please complete your data",
          });
        }

        console.log(image)

        if (!req.file) {
          return res.status(400).send({
            isError: true,
            message: "No file chosen",
          });
        }

        let imageUrl = req.protocol + "://" + req.get("host") + "/api/products/" + req.file.filename;

        const newProduct = await product.create({
          product_name: product_name,
          product_price: product_price,
          weight: weight,
          product_description: product_description,
          product_image: imageUrl,
          id_category: id_category,
        });

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

      const category_id = parseInt(req.query.category) || null;
      const productName = req.query.name || null;
      const categoryQuery = category_id ? { id_category: category_id } : {};
      const productQuery = productName ? { product_name: { [Op.like]: `%${productName}%` } } : {};

      const allProducts = await product.findAndCountAll({
        where: {
          ...categoryQuery, ...productQuery
        },
        include: { model: category, attributes: ['category_name'] },
        order: [['id', 'DESC']],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      // const allProducts = await product.findAll({});

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

      let imageUrl = req.protocol + "://" + req.get("host") + "/api/products/" + req.file.filename;

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

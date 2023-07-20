const db = require("../models");
const category = db.Category;
const { Op } = require("sequelize");

module.exports = {
  createNewCategory: async (req, res) => {
    try {
      const { category_name } = req.body;

      if (!category_name) {
        return res.status(400).send({
          isError: true,
          message: "Please provide a category name",
        });
      }

      const isCategoryExist = await category.findOne({
        where: {
          category_name,
        },
      });

      if (isCategoryExist) {
        return res.status(400).send({
          isError: true,
          message: "Category already exist",
        });
      }

      let imageUrl = process.env.API_URL + "/categories/" + req.file.filename;

      const newCategory = await category.create({
        category_name: category_name,
        category_image: imageUrl,
      });

      res.status(200).send({
        isError: false,
        message: "Successfully create a new category",
        data: newCategory,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        isError: true,
        message: "Error creating category",
      });
    }
  },
  fetchAllCategories: async (req, res) => {
    try {
      const admin = req.query.adm || null;
      const page = parseInt(req.query.page) || 1;
      const pageSize = 12;
      const categoryName = req.query.name || null;
      const sort = req.query.sort || "ASC";

      const order = admin ? {order : [['category_name', sort]]} : {};
      const limit = admin ? {limit: pageSize} : {};
      const offset = admin ? {offset: (page - 1) * pageSize,} : {};

      const categoryQuery = categoryName ? { category_name: { [Op.like]: `%${categoryName}%` } } : {};

      let result = await category.findAndCountAll({
        where: {...categoryQuery}, ...order, ...limit, ...offset
      });

      res.status(200).send({
        isError: false,
        message: "Successfully fetch all categories",
        data: result.rows,
        count: result.count
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Fetch all category failed",
      });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { category_name } = req.body;

      const categoryWithSameName = await category.findOne({
        where: {
          category_name: category_name,
          id: { [Op.ne]: req.params.id }, // Excludes the current category ID
        },
      });

      if (categoryWithSameName) {
        return res.status(400).send({
          isError: false,
          message: "Same category name already exists",
        });
      }

      if (!req.file) {
        await category.update(
          {
            category_name: category_name,
          },
          {
            where: { id: req.params.id },
          }
        );

        return res.status(200).send({
          isError: false,
          message: "Successfully update category",
        });
      }

      let imageUrl = process.env.API_URL + "/categories/" + req.file.filename;

      const updatedCategory = await category.update(
        {
          category_name: category_name,
          category_image: imageUrl,
        },
        {
          where: { id: req.params.id },
        }
      );

      res.status(200).send({
        isError: false,
        message: "Successfully update category with image",
        data: updatedCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        isError: true,
        message: "Update category failed",
      });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const result = await category.destroy({
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
        message: "Delete category failed",
      });
    }
  },
  findCategory: async(req, res) => {
    try{
      const result = await category.findOne({where: {id : req.params.id}})
      if (!result) {
        return res.status(400).send({
          isError: true,
          message: "Category not found",
          navigate: true
        });
      }
      res.status(200).send({
        isError: false,
        message: "Category found",
        navigate: false
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: "Failed finding category",
      });
    }
  }
};

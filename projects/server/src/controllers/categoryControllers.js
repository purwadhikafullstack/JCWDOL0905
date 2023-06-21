const db = require("../models");
const category = db.Category;

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

      let imageUrl = req.protocol + "://" + req.get("host") + "/api/categories/" + req.file.filename;

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
      let result = await category.findAll({});

      res.status(200).send({
        isError: false,
        message: "Successfully fetch all categories",
        data: result,
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

      let imageUrl = req.protocol + "://" + req.get("host") + "/api/categories/" + req.file.filename;

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
};

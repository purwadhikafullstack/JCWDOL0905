const db = require("../models");
const category = db.Category;
const upload = require("../middleware/multer");

module.exports = {
  createNewCategory: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send({
            isError: true,
            message: "Error uploading image",
          });
        }
        const { category_name } = req.body;

        if (!category_name) {
          return res.status(400).send({
            isError: true,
            message: "Please provide a category name",
          });
        }
        if (!req.file) {
          return res.status(400).send({
            isError: true,
            message: "No file chosen",
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
};

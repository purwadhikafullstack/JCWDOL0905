"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Product, {
        foreignKey: {
          name: "id_category",
        },
      });
    }
  }
  Category.init(
    {
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
      paranoid: true,
    }
  );
  return Category;
};

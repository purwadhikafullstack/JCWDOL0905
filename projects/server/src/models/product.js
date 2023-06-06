"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: {
          name: "id_category",
        },
      });
      Product.hasMany(models.Inventory, {
        foreignKey: {
          name: "id_product",
        },
      });
    }
  }
  Product.init(
    {
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
      paranoid: true,
    }
  );
  return Product;
};

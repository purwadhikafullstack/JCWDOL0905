"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory.hasMany(models.Discount, {
        foreignKey: {
          name: "id_inventory",
        },
      });
      Inventory.hasMany(models.Inventory_History, {
        foreignKey: {
          name: "id_inventory",
        },
      });
      Inventory.belongsTo(models.Store_Branch, {
        foreignKey: {
          name: "id_branch",
        },
      });
      Inventory.belongsTo(models.Product, {
        foreignKey: {
          name: "id_product",
        },
      });
      Inventory.hasMany(models.Cart, {
        foreignKey: {
          name: "id_inventory",
        },
      });
      Inventory.hasMany(models.Transaction_Detail, {
        foreignKey: {
          name: "id_inventory",
        },
      });
    }
  }
  Inventory.init(
    {
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Inventory",
    }
  );
  return Inventory;
};

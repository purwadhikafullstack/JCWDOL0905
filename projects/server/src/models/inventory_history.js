"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory_History.belongsTo(models.Inventory, {
        foreignKey: {
          name: "id_inventory",
        },
      });
    }
  }
  Inventory_History.init(
    {
      status: {
        type: DataTypes.ENUM("in", "out"),
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      current_stock: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Inventory_History",
    }
  );
  return Inventory_History;
};

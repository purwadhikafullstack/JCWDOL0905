"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discount.belongsTo(models.Inventory, {
        foreignKey: {
          name: "id_inventory",
        },
      });
    }
  }
  Discount.init(
    {
      discount_type: {
        type: DataTypes.ENUM("percentage", "amount", "buy one get one"),

        allowNull: false,
      },
      discount_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
      },
      end_date: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      sequelize,
      modelName: "Discount",
    }
  );
  return Discount;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction_Detail.belongsTo(models.Transaction_Header, {
        foreignKey: {
          name: "id_trans_header",
        },
      });
      Transaction_Detail.belongsTo(models.Inventory, {
        foreignKey: {
          name: "id_inventory",
        },
      });
    }
  }
  Transaction_Detail.init(
    {
      product_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction_Detail",
    }
  );
  return Transaction_Detail;
};

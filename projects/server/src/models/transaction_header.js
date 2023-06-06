"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction_Header extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction_Header.belongsTo(models.User, {
        foreignKey: {
          name: "id_user",
        },
      });
      Transaction_Header.hasMany(models.Transaction_Detail, {
        foreignKey: {
          name: "id_trans_header",
        },
      });
      Transaction_Header.belongsTo(models.User_Voucher, {
        foreignKey: {
          name: "id_user_voucher",
        },
      });
      Transaction_Header.belongsTo(models.Shipping_Service, {
        foreignKey: {
          name: "id_shipping_service",
        },
      });
    }
  }
  Transaction_Header.init(
    {
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shipping_fee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      voucher_discount_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      final_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_proof: {
        type: DataTypes.STRING,
      },
      order_status: {
        type: DataTypes.ENUM("waiting for payment", "waiting for payment confirmation", "processed", "shipped", "done", "canceled"),
      },
    },
    {
      sequelize,
      modelName: "Transaction_Header",
    }
  );
  return Transaction_Header;
};

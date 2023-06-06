"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.hasMany(models.User_Voucher, {
        foreignKey: {
          name: "id_voucher",
        },
      });
    }
  }
  Voucher.init(
    {
      voucher_type: {
        type: DataTypes.ENUM("product", "total purchase", "shipping", "referral code"),
      },
      voucher_kind: {
        type: DataTypes.ENUM("percentage", "amount"),
        values: ["percentage", "amount"],
      },
      voucher_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      voucher_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_discount: {
        type: DataTypes.INTEGER,
      },
      min_purchase_amount: {
        type: DataTypes.INTEGER,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Voucher",
    }
  );
  return Voucher;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Voucher.belongsTo(models.User, {
        foreignKey: {
          name: "id_user",
        },
      });
      User_Voucher.belongsTo(models.Voucher, {
        foreignKey: {
          name: "id_voucher",
        },
      });
      User_Voucher.hasMany(models.Transaction_Header, {
        foreignKey: {
          name: "id_user_voucher",
        },
      });
    }
  }
  User_Voucher.init(
    {
      is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User_Voucher",
    }
  );
  return User_Voucher;
};

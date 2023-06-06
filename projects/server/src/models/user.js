"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Cart, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.Address, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.Token, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.User_Voucher, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.Transaction_Header, {
        foreignKey: {
          name: "id_user",
        },
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "email",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
      },
      referral_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

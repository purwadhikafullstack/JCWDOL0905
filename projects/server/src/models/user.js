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
      User.hasOne(models.Token, {
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
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
      },
      birthdate: {
        type: DataTypes.DATEONLY
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
      referral_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    },
    {
      sequelize,
      modelName: "User"
    }
  );
  return User;
};

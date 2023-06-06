"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: {
          name: "id_user",
        },
      });
    }
  }
  Token.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token_type: {
        type: DataTypes.ENUM("verification", "reset_password"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Token",
    }
  );
  return Token;
};

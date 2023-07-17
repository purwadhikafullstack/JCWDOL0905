"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.belongsTo(models.Store_Branch, {
        foreignKey: {
          name: "id_branch",
        },
      });
    }
  }
  Admin.init(
    {
      admin_name: {
        type: DataTypes.STRING,
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
      role: {
        type: DataTypes.ENUM("SUPER_ADMIN", "BRANCH_ADMIN"),
        values: ["SUPER_ADMIN", "BRANCH_ADMIN"],
        allowNull: false,
      },
      token_admin: {
        type: DataTypes.STRING(500),
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
      paranoid: true,
      modelName: "Admin",
    }
  );
  return Admin;
};

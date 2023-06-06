"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shipping_Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shipping_Service.hasMany(models.Transaction_Header, {
        foreignKey: {
          name: "id_shipping_service",
        },
      });
    }
  }
  Shipping_Service.init(
    {
      courier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Shipping_Service",
    }
  );
  return Shipping_Service;
};

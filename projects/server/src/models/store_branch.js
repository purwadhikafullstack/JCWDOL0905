"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store_Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store_Branch.hasMany(models.Admin, {
        foreignKey: {
          name: "id_branch",
        },
      });
      Store_Branch.hasMany(models.Inventory, {
        foreignKey: {
          name: "id_branch",
        },
      });
    }
  }
  Store_Branch.init(
    {
      branch_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT(10, 6),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT(10, 6),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Store_Branch",
    }
  );
  return Store_Branch;
};

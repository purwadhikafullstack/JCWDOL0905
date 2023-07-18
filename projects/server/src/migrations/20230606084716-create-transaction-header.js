'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction_Headers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      total_weight: {
        type: DataTypes.INTEGER,
      },
      shipping_fee: {
        type: Sequelize.INTEGER
      },
      voucher_discount_amount: {
        type: Sequelize.INTEGER
      },
      final_price: {
        type: Sequelize.INTEGER
      },
      payment_proof: {
        type: Sequelize.STRING
      },
      order_status: {
        type: Sequelize.ENUM('waiting for payment', 'waiting for payment confirmation', 'processed', 'shipped', 'done', 'canceled')
      },
      branch_name: {
        type: DataTypes.STRING,
      },
      branch_address: {
        type: DataTypes.STRING,
      },
      branch_province: {
        type: DataTypes.STRING,
      },
      branch_city: {
        type: DataTypes.STRING,
      },
      branch_city_id: {
        type: DataTypes.INTEGER,
      },
      address_label: {
        type: DataTypes.STRING,
      },
      address_detail: {
        type: DataTypes.STRING,
      },
      address_province: {
        type: DataTypes.STRING,
      },
      address_city: {
        type: DataTypes.STRING,
      },
      address_city_id: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transaction_Headers');
  }
};
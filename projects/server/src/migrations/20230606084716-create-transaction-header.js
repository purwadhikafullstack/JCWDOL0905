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
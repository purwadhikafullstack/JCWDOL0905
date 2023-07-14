'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voucher_type: {
        type: Sequelize.ENUM('product', 'total purchase', 'shipping', 'referral code')
      },
      voucher_kind: {
        type: Sequelize.ENUM('percentage', 'amount')
      },
      voucher_value: {
        type: Sequelize.INTEGER
      },
      max_discount: {
        type: Sequelize.INTEGER
      },
      min_purchase_amount: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Vouchers');
  }
};
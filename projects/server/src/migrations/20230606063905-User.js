"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "profile_picture", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "is_verified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "unique_email",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "profile_picture");
    await queryInterface.changeColumn("Users", "is_verified", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.removeConstraint("Users", "unique_email");
  },
};

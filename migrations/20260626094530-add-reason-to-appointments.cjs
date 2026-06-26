"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointments", "appointmentReason", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "appointmentTime", //places column after appointmentTime
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("appointments", "appointmentReason");
  },
};

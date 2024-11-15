'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('novels', 'description', {
      type: Sequelize.STRING,
      allowNull: true,  // Kolom ini opsional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('novels', 'description');
  }
};

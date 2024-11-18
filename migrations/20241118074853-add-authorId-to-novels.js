'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('novels', 'authorId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Biarkan null dulu agar migrasi berhasil
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Tetap gunakan SET NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('novels', 'authorId');
  }
};

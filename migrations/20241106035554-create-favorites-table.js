'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Pastikan ada tabel users di database Anda
          key: 'id',
        },
        onDelete: 'CASCADE', // Jika user dihapus, data favorit terkait akan dihapus juga
      },
      novelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'novels', // Pastikan ada tabel novels di database Anda
          key: 'id',
        },
        onDelete: 'CASCADE', // Jika novel dihapus, data favorit terkait akan dihapus juga
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorites');
  }
};

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    novelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'favorites',   // Pastikan nama tabel sesuai dengan tabel di DB
    modelName: 'Favorite',    // Nama model dalam PascalCase
    underscored: true,        // (opsional) untuk menggunakan snake_case di kolom tabel
  });

  // Relasi dengan model User dan Novel
  Favorite.associate = function(models) {
    // Relasi: Favorite belongs to User dan Novel
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',  // Nama relasi ke model User
    });
    Favorite.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      as: 'novel',  // Nama relasi ke model Novel
    });
  };

  return Favorite;
};

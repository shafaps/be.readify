'use strict';

module.exports = (sequelize, DataTypes) => {
  const Novel = sequelize.define('Novel', {  // Model name is 'Novel' (PascalCase)
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'novels',  // Specify the exact table name (plural or singular depending on your DB naming convention)
    modelName: 'Novel',   // Define modelName in PascalCase
  });

  // Define associations
  Novel.associate = function(models) {
    // Relasi dengan model Chapter
    Novel.hasMany(models.Chapter, {
      as: 'chapters',
      foreignKey: 'novelId',  // Relasi ke tabel chapter
    });

    // Relasi dengan model Comment (jika ada)
    Novel.hasMany(models.Comment, {
      foreignKey: 'novelId',
      as: 'comments',  // Menambahkan relasi ke komentar
    });

    // Relasi dengan model Favorite (jika ada)
    Novel.hasMany(models.Favorite, {
      foreignKey: 'novelId',
      as: 'favorites',  // Relasi untuk favorit novel
    });
  };

  return Novel;
};

'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi dengan model Comment
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments',  // Menambahkan relasi 'comments' untuk akses komentar dari User
      });

      // Relasi dengan model Favorite
      User.hasMany(models.Favorite, {
        foreignKey: 'userId',
        as: 'favorites',  // Relasi untuk favorit oleh user
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Username harus unik
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Email harus unik
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',  // Default role adalah 'user'
    },
  }, {
    sequelize,
    modelName: 'User',  // Menetapkan nama model (PascalCase)
    tableName: 'users',  // Nama tabel yang sesuai di database (huruf kecil, plural)
    underscored: true,   // Menggunakan snake_case untuk kolom di database
  });

  return User;
};

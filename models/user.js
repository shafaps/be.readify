'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Define associations here.
     */
    static associate(models) {
      // Relasi dengan model Comment
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments', // Relasi untuk mengakses komentar user
        onDelete: 'CASCADE', // Hapus komentar jika user dihapus
      });

      // Relasi dengan model Favorite
      User.hasMany(models.Favorite, {
        foreignKey: 'userId',
        as: 'favorites', // Relasi untuk favorit oleh user
        onDelete: 'CASCADE', // Hapus favorit jika user dihapus
      });

      // Relasi dengan model Novel (sebagai author)
      User.hasMany(models.Novel, {
        foreignKey: 'authorId',
        as: 'authoredNovels', // Relasi untuk novel yang ditulis user
        onDelete: 'SET NULL', // Tetapkan null pada novel jika user dihapus
      });
    }
  }

  // Inisialisasi model User
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Username harus unik
        validate: {
          notEmpty: true, // Tidak boleh kosong
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Email harus unik
        validate: {
          isEmail: true, // Harus berupa format email yang valid
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 100], // Panjang password minimal 6 karakter
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true, // This is correct, image can be null
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user', // Default role adalah 'user'
      },
    },
    {
      sequelize,
      modelName: 'User', // Menetapkan nama model (PascalCase)
      tableName: 'users', // Nama tabel di database (huruf kecil, plural)
      timestamps: true, // Menambahkan createdAt dan updatedAt
      createdAt: 'createAt',  // Menyesuaikan nama kolom dengan 'createAt'
      updatedAt: 'updateAt',  // Menyesuaikan nama kolom dengan 'updateAt'
    }
  );

  return User;
};

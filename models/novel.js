'use strict';

module.exports = (sequelize, DataTypes) => {
  const Novel = sequelize.define('Novel', {
    title: {
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
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false, // pastikan authorId ada
      references: {
        model: 'users', // Mengacu pada tabel User
        key: 'id', // Foreign key yang mengacu pada kolom id di tabel users
      },
      onUpdate: 'CASCADE', // Jika user diupdate, lakukan update juga di Novel
      onDelete: 'SET NULL', // Jika user dihapus, set authorId menjadi NULL
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true, // Kolom ini untuk menyimpan username penulis
    },
  }, {
    tableName: 'novels', // Nama tabel di database
    modelName: 'Novel', // Nama model yang digunakan
  });

  // Define associations
  Novel.associate = function(models) {
    // Relasi dengan model Chapter
    Novel.hasMany(models.Chapter, {
      as: 'chapters',
      foreignKey: 'novelId',
    });

    // Relasi dengan model Comment
    Novel.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'novelId',
    });

    // Relasi dengan model Favorite
    Novel.hasMany(models.Favorite, {
      as: 'favorites',
      foreignKey: 'novelId',
    });

    // Relasi dengan model User untuk kolom `author` (ganti alias menjadi 'authorRelation')
    Novel.belongsTo(models.User, {
      as: 'authorRelation', // Alias yang diganti untuk menghindari bentrok
      foreignKey: 'authorId', // Foreign key di tabel Novel
      targetKey: 'id', // Kolom yang menjadi referensi di tabel User
    });
  };

  return Novel;
};

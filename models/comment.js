'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    novelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'comments',  // Pastikan nama tabel sesuai dengan tabel di DB
    modelName: 'Comment',   // Nama model dalam PascalCase
  });

  // Relasi dengan model User dan Novel
  Comment.associate = function(models) {
    // Relasi: Comment belongs to User dan Novel
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',  // Nama relasi ke model User
    });
    Comment.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      as: 'novel',  // Nama relasi ke model Novel
    });
  };

  return Comment;
};

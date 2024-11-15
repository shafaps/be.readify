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
    tableName: 'comments',
  });

  // Relasi dengan model User dan Novel
  Comment.associate = function(models) {
    // Set relasi: Comment belongs to User dan Novel
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Comment.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      as: 'novel',
    });
  };

  return Comment;
};

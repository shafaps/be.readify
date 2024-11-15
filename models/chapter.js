// models/chapter.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    novelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Chapter.associate = function(models) {
    // Set hubungan dengan Novel (many-to-one)
    Chapter.belongsTo(models.Novel, { foreignKey: 'novelId', as: 'novel' });
  };

  return Chapter;
};

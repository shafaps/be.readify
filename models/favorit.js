// models/favorite.js

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
    }, {});
  
    Favorite.associate = function(models) {
      // Favorite belongs to one User
      Favorite.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
  
      // Favorite belongs to one Novel
      Favorite.belongsTo(models.Novel, {
        as: 'novel',
        foreignKey: 'novelId',
      });
    };
  
    return Favorite;
  };
  
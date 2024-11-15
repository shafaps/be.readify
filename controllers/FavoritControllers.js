// controllers/favoriteController.js
const { Favorite, Novel, User } = require('../models');

exports.addFavorite = async (req, res) => {
  try {
    const { userId, novelId } = req.body;

    // Periksa apakah novel sudah ada di favorit user
    const existingFavorite = await Favorite.findOne({
      where: { userId, novelId },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Novel sudah ada di favorit Anda.' });
    }

    // Tambahkan novel ke favorit
    const favorite = await Favorite.create({
      userId,
      novelId,
    });

    return res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding favorite', error });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ambil semua novel yang ada di favorit user
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{
        model: Novel,
        as: 'novel',
        attributes: ['id', 'title', 'author', 'coverImage', 'description'], // Include necessary fields
      }],
    });

    return res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching user favorites', error });
  }
};

exports.removeFavorite = async (req, res) => {
    try {
      const { userId, novelId } = req.params;
  
      // Cari data favorit yang ingin dihapus
      const favorite = await Favorite.findOne({
        where: { userId, novelId },
      });
  
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
  
      // Hapus dari tabel favorit
      await favorite.destroy();
  
      return res.status(200).json({ message: 'Novel removed from favorites' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error removing favorite', error });
    }
  };
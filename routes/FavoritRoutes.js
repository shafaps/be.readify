// routes/favorites.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/FavoritControllers');

// Route untuk menambahkan novel ke favorit
router.post('/favorites', favoriteController.addFavorite);

// Route untuk mengambil semua favorit dari user
router.get('/favorites/:userId', favoriteController.getUserFavorites);

// Route untuk menghapus novel dari favorit
router.delete('/favorites/:userId/:novelId', favoriteController.removeFavorite);

module.exports = router;

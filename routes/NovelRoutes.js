// routes/novelRoutes.js
const express = require('express');
const router = express.Router();
const novelController = require('../controllers/NovelControllers');
const upload = require('../middleware/UploadMiddleware')
// Route untuk mendapatkan semua novel
router.get('/novels', novelController.getAllNovels);

// Route untuk mendapatkan novel berdasarkan ID
router.get('/novels/:id', novelController.getNovelById);

// Route untuk membuat novel baru
router.post('/novels',upload.single('coverImage'), novelController.createNovel);

// Route untuk memperbarui novel
router.put('/novels/:id', upload.single('coverImage'),novelController.updateNovel);

// Route untuk menghapus novel
router.delete('/novels/:id', novelController.deleteNovel);

router.get('/novels/author/:authorId', novelController.getNovelsByAuthorId);

module.exports = router;

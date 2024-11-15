// routes/chapterRoutes.js
const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/ChapterControllers');

// Route untuk mendapatkan semua chapter berdasarkan novelId
router.get('/novels/:novelId/chapters', chapterController.getChaptersByNovelId);

// Route untuk mendapatkan chapter berdasarkan ID
router.get('/chapters/:id', chapterController.getChapterById);

// Route untuk membuat chapter baru
router.post('/chapters', chapterController.createChapter);

// Route untuk memperbarui chapter
router.put('/chapters/:id', chapterController.updateChapter);

// Route untuk menghapus chapter
router.delete('/chapters/:id', chapterController.deleteChapter);

module.exports = router;

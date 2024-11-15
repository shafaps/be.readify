const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsForNovel,
  deleteComment,
} = require('../controllers/CommentControllers');

// Menambahkan komentar baru
router.post('/comments', createComment);

// Mendapatkan semua komentar untuk sebuah novel
router.get('/comments/:novelId', getCommentsForNovel);

// Menghapus komentar
router.delete('/comments/:commentId', deleteComment);

module.exports = router;

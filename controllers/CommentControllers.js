const { Comment, User, Novel } = require('../models');

// Menambahkan komentar baru
const createComment = async (req, res) => {
  const { novelId, userId, content } = req.body;

  // Validasi input
  if (!novelId || !userId || !content) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Cek apakah novel dan user yang bersangkutan ada
    const novel = await Novel.findByPk(novelId);
    const user = await User.findByPk(userId);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Membuat komentar baru
    const comment = await Comment.create({
      novelId,
      userId,
      content,
    });

    // Mengembalikan response dengan komentar yang baru ditambahkan
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Mendapatkan semua komentar untuk sebuah novel
const getCommentsForNovel = async (req, res) => {
  const { novelId } = req.params;

  try {
    // Mengambil komentar berdasarkan novelId
    const comments = await Comment.findAll({
      where: { novelId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],  // Include info user yang memberi komentar
        },
        {
          model: Novel,
          as: 'novel',
          attributes: ['id', 'title'],  // Include info novel yang dikomentari
        },
      ],
    });

    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found for this novel.' });
    }

    // Mengembalikan response dengan daftar komentar
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching comments', error });
  }
};

// Menghapus komentar
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Menghapus komentar berdasarkan commentId
    const deletedComment = await Comment.destroy({
      where: { id: commentId },
    });

    if (deletedComment) {
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting comment', error });
  }
};

module.exports = {
  createComment,
  getCommentsForNovel,
  deleteComment,
};

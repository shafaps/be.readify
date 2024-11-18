const { Novel, Chapter, Comment, User } = require('../models');
const ImageKit = require('imagekit');
const multer = require('multer');

// Konfigurasi Multer untuk menangani upload file
const upload = multer({ storage: multer.memoryStorage() });

// Konfigurasi ImageKit
const imagekit = new ImageKit({
  publicKey: 'public_hywsYp+2rwEH5NdQoxao3FUpBoU=',
  privateKey: 'private_2fNWVwe5taxBTmEl+0NQa1FuO8M=',
  urlEndpoint: 'https://ik.imagekit.io/shfps/'
});

// Fungsi untuk mengunggah gambar ke ImageKit
const uploadCoverImage = async (fileBuffer) => {
  try {
    return await imagekit.upload({
      file: fileBuffer,
      fileName: `novel-cover-${Date.now()}`,
      folder: '/novel-covers',
    });
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error.message);
    throw new Error('Image upload failed');
  }
};

// Create a new novel

const createNovel = async (req, res) => {
  try {
    const { title, authorId, description } = req.body;

    // Cek apakah authorId valid
    const author = await User.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Ambil username dari authorId
    const authorName = author.username;

    // Upload coverImage ke ImageKit jika disediakan
    let imageUrl = '';
    if (req.file) {
      const uploadResponse = await uploadCoverImage(req.file.buffer);
      imageUrl = uploadResponse.url;
    }

    // Membuat novel baru dengan memasukkan username sebagai author
    const novel = await Novel.create({
      title,
      authorId,
      author: authorName,  // Menyimpan username di kolom author
      coverImage: imageUrl,
      description,
    });

    return res.status(201).json(novel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Update a novel by ID
const updateNovel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, authorId, description } = req.body;

    const novel = await Novel.findByPk(id);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    // Jika ada coverImage baru, upload ke ImageKit
    if (req.file) {
      const uploadResponse = await uploadCoverImage(req.file.buffer);
      novel.coverImage = uploadResponse.url;
    }

    novel.title = title || novel.title;
    novel.authorId = authorId || novel.authorId;
    novel.description = description || novel.description;

    await novel.save();

    return res.status(200).json(novel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all novels
const getAllNovels = async (req, res) => {
  try {
    const novels = await Novel.findAll({
      include: [
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id', 'title', 'content'],
        },
      ],
    });
    return res.status(200).json(novels);
  } catch (error) {
    console.error('Error fetching novels:', error.message);
    return res.status(500).json({ message: 'Error fetching novels', error: error.message });
  }
};

// Get novel by ID
const getNovelById = async (req, res) => {
  try {
    const { id } = req.params;

    const novel = await Novel.findByPk(id, {
      include: [
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id', 'title', 'content'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username'],
            },
          ],
        },
      ],
    });

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    return res.status(200).json(novel);
  } catch (error) {
    console.error('Error fetching novel by ID:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Delete a novel by ID
const deleteNovel = async (req, res) => {
  try {
    const { id } = req.params;

    const novel = await Novel.findByPk(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    await novel.destroy();
    return res.status(200).json({ message: 'Novel deleted successfully' });
  } catch (error) {
    console.error('Error deleting novel:', error.message);
    return res.status(500).json({ message: 'Error deleting novel', error: error.message });
  }
};



const getNovelsByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params;

    const novels = await Novel.findAll({
      where: { authorId },
      include: [
        {
          model: Chapter,
          as: 'chapters',  // Pastikan nama alias ini sesuai dengan yang didefinisikan di model
          attributes: ['id', 'title', 'content'],
        },
        {
          model: Comment,
          as: 'comments', // Pastikan nama alias ini sesuai dengan yang didefinisikan di model
          include: [
            {
              model: User,
              as: 'user', // Pastikan ini sesuai dengan alias relasi di model Comment
              attributes: ['id', 'username'],
            }
          ],
        }
      ],
      // Menambahkan raw:true dan nestResults: true untuk hasil yang lebih sederhana dan terstruktur
      raw: true, 
      nest: true, 
    });

    if (!novels || novels.length === 0) {
      return res.status(404).json({ message: 'No novels found for this author' });
    }

    return res.status(200).json(novels);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllNovels,
  getNovelById,
  getNovelsByAuthorId,
  createNovel,
  updateNovel,
  deleteNovel,
};

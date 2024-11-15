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
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: `novel-cover-${Date.now()}`,
      folder: '/novel-covers',
    });
    console.log('Image uploaded to ImageKit:', uploadResponse);
    return uploadResponse;
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw new Error('Image upload failed');
  }
};



// Create a new novel
const createNovel = async (req, res) => {
  try {
    const { title, author, description } = req.body;

    // Upload coverImage ke ImageKit jika disediakan
    let imageUrl = '';
    if (req.file) { // Cek apakah ada file yang diupload
      const uploadResponse = await uploadCoverImage(req.file.buffer);
      imageUrl = uploadResponse.url; // URL yang dihasilkan oleh ImageKit
    }

    const novel = await Novel.create({
      title,
      author,
      coverImage: imageUrl,  // Menyimpan URL gambar dari ImageKit
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
    const { title, author, description } = req.body;

    const novel = await Novel.findByPk(id);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    // Jika ada coverImage baru, upload ke ImageKit
    if (req.file) { // Cek apakah ada file yang diupload
      const uploadResponse = await uploadCoverImage(req.file.buffer);
      novel.coverImage = uploadResponse.url; // URL yang dihasilkan oleh ImageKit
    }

    novel.title = title || novel.title;
    novel.author = author || novel.author;
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
      include: [{
        model: Chapter,
        as: 'chapters', // Include chapters as a related model
        attributes: ['id', 'title', 'content'] // Optional, include only necessary chapter fields
      }]
    });
    res.status(200).json(novels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching novels', error });
  }
};

// Get novel by ID
const getNovelById = async (req, res) => {
  try {
    const { id } = req.params;

    // Mencari novel berdasarkan ID dengan relasi chapters dan comments
    const novel = await Novel.findByPk(id, {
      include: [
        {
          model: Chapter,
          as: 'chapters', // Relasi dengan model Chapter
          attributes: ['id', 'title', 'content'], // Hanya ambil atribut yang dibutuhkan
        },
        {
          model: Comment,
          as: 'comments', // Relasi dengan model Comment
          include: [
            {
              model: User,
              as: 'user', // Relasi dengan User (untuk mendapatkan username)
              attributes: ['id', 'username'], // Hanya ambil atribut user yang dibutuhkan
            }
          ],
        }
      ],
    });

    // Jika novel tidak ditemukan
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    // Mengembalikan novel beserta chapters dan comments yang terkait
    return res.status(200).json(novel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a novel by ID
const deleteNovel = async (req, res) => {
  const { id } = req.params;
  try {
    const novel = await Novel.findByPk(id);
    if (novel) {
      await novel.destroy();
      res.status(200).json({ message: 'Novel deleted successfully' });
    } else {
      res.status(404).json({ message: 'Novel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting novel', error });
  }
};

module.exports = {
  getAllNovels,
  getNovelById,
  createNovel,
  updateNovel,
  deleteNovel
};

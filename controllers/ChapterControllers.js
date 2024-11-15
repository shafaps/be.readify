// controllers/chapterController.js

const { Chapter } = require('../models');

// Get all chapters for a specific novel
const getChaptersByNovelId = async (req, res) => {
  const { novelId } = req.params;
  try {
    const chapters = await Chapter.findAll({
      where: { novelId },
      attributes: ['id', 'title', 'content']  // Optional: specify fields you want to return
    });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapters', error });
  }
};

// Get chapter by ID
const getChapterById = async (req, res) => {
  const { id } = req.params;
  try {
    const chapter = await Chapter.findByPk(id);
    if (chapter) {
      res.status(200).json(chapter);
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapter', error });
  }
};

// Create a new chapter
const createChapter = async (req, res) => {
  const { title, content, novelId } = req.body;
  try {
    const newChapter = await Chapter.create({ title, content, novelId });
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chapter', error });
  }
};

// Update chapter by ID
const updateChapter = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const chapter = await Chapter.findByPk(id);
    if (chapter) {
      chapter.title = title || chapter.title;
      chapter.content = content || chapter.content;
      await chapter.save();
      res.status(200).json(chapter);
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating chapter', error });
  }
};

// Delete chapter by ID
const deleteChapter = async (req, res) => {
  const { id } = req.params;
  try {
    const chapter = await Chapter.findByPk(id);
    if (chapter) {
      await chapter.destroy();
      res.status(200).json({ message: 'Chapter deleted successfully' });
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chapter', error });
  }
};

module.exports = {
  getChaptersByNovelId,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter
};

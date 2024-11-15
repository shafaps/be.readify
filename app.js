const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/UserRoutes');
const novelRoutes = require('./routes/NovelRoutes');
const chapterRoutes = require('./routes/ChapterRoutes');
const favoriteRoutes = require('./routes/FavoritRoutes');
const commentRoutes = require('./routes/CommentRoutes');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Use user-related routes
app.use('/api/users', userRoutes);
app.use('/api', novelRoutes);
app.use('/api', chapterRoutes);
app.use('/api', favoriteRoutes);
app.use('/api', commentRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

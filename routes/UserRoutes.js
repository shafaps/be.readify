const express = require('express');
const { createUser, loginUser } = require('../controllers/UserControllers');

const router = express.Router();

// Route to create a new user
router.post('/register', createUser);

// Route to log in an existing user
router.post('/login', loginUser);

module.exports = router;

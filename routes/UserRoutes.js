const express = require('express');
const { createUser, loginUser,updateUser,getAllUsers,getUserById } = require('../controllers/UserControllers');
const upload = require('../middleware/UploadMiddleware')
const auth = require('../middleware/authMiddleware')
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);

// Route to log in an existing user
router.post('/login', loginUser);


router.put('/:id',upload.single('image'), updateUser);

// Route to get all users
router.get('/',auth, getAllUsers);

// Route to get a user by ID
router.get('/:id',getUserById);

module.exports = router;

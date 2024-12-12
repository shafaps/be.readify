const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Import the User model
const ImageKit = require('imagekit');
const jwt = require('jsonwebtoken');

const imagekit = new ImageKit({
  publicKey: 'public_hywsYp+2rwEH5NdQoxao3FUpBoU=',
  privateKey: 'private_2fNWVwe5taxBTmEl+0NQa1FuO8M=',
  urlEndpoint: 'https://ik.imagekit.io/shfps/'
});

const uploadUserImage = async (fileBuffer, username) => {
  try {
    // Upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: `${username}-profile-${Date.now()}`,  // Unique file name based on username
      folder: '/user-profile-images',  // You can change the folder as needed
    });

    // Return the image URL from the upload response
    return uploadResponse.url;
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error.message);
    throw new Error('Image upload failed');
  }
};


// Controller to handle user creation
const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,  // Use the hashed password here
      role: role || 'user',  // Default role is 'user' if not provided
    });

    // Respond with the created user (exclude password from response for security)
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const image = req.file;  // Assuming `image` is sent in the form-data (for file upload)

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the password if it's provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    let imageUrl = user.image;  // Default image URL (current image)

    // Upload image if a new one is provided
    if (image) {
      // Assuming you are using ImageKit for file upload
      const uploadResponse = await imagekit.upload({
        file: image.buffer,  // File buffer from `req.file`
        fileName: `user-${id}-profile`,
        folder: '/users',  // Optional folder name for image
      });

      // Use the uploaded image URL
      imageUrl = uploadResponse.url;
    }

    console.log('Current User Before Update:', user);

    // Update user fields, including image if provided
    await user.update({
      username: username || user.username,
      email: email || user.email,
      password: hashedPassword,
      role: role || user.role,
      image: imageUrl,  // Update the image field
    });

    // Prepare the response object with updated user data
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,  // Ensure the image field is included (null if no image)
    };

    return res.status(200).json({ user: userResponse });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Error updating user' });
  }
};

// Controller to handle login (for example, password validation)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, image: user.image },
      process.env.JWT_SECRET,  // Use the JWT_SECRET from your environment variables
    );

    // Respond with user details excluding the password and include the JWT token
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      token: token,  // Include the JWT token in the response

    };

    return res.status(200).json({
      user: userResponse,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Error logging in user' });
  }
};

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'image'] });
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

// Controller to get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { attributes: ['id', 'username', 'email', 'role', 'image'] });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Error fetching user' });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getAllUsers,
  getUserById,
};

const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Import the User model

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

    // Respond with user details excluding the password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Error logging in user' });
  }
};

module.exports = {
  createUser,
  loginUser,
};

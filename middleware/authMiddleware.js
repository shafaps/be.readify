const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming you have a User model

// Middleware to authenticate and authorize users
const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from Authorization header (Bearer token)
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object for later use
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user object to the request so we can access it in other routes
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

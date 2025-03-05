const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const authMiddleware = async (req, res, next) => {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Extract token (expecting "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    // Verify token using secret key (ensure you have this in your .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to request
    req.user = {
      id: new ObjectId(decoded.userId),
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const authMiddleware = async (req, res, next) => {
    // Assuming you're using a token-based authentication
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ensure userId is converted to a string, not an ObjectId
      req.user = {
        id: String(decoded.userId), // Explicitly convert to string
        // other user details
      };
  
      next();
    } catch (error) {
      res.status(401).unauthorized({ error: 'Unauthorized' });
    }
  };

module.exports = authMiddleware;
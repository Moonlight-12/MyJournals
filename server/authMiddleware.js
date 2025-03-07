const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization; 

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const actualToken = token.split(' ')[1];

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        req.user = {
            id: String(decoded.userId),
        };

        next();
    } catch (error) {
        console.error('Authentication Error:', error); // Log the error
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
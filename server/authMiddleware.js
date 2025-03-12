const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token format" });
    }

    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ error: "invalid token, missing userId" });
    }

    req.user = {
      id: String(decoded.userId),
    };

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;

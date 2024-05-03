const jwt = require("jsonwebtoken");
const User = require("../User/UserModel");

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token." });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request object for further use
    req.userId = decodedToken.userId;

    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};

module.exports = authMiddleware;

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Token blacklist Set to store invalidated tokens
 * In a production environment, this should be replaced with Redis or a database
 */
const tokenBlacklist = new Set();

/**
 * Adds a token to the blacklist
 * @param {string} token - The JWT token to blacklist
 */
export const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

/**
 * Middleware to protect routes by verifying JWT tokens
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add token and decoded info to request for use in routes
    req.user = user;
    req.token = token;
    req.tokenDecoded = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token format" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// auth fix
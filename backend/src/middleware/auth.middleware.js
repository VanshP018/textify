import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../lib/logger.js";
import { AppError } from "./error.middleware.js";

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
  logger.info(`Token blacklisted successfully`);
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
      throw new AppError(401, "Unauthorized - No Token Provided");
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      throw new AppError(401, "Token has been invalidated");
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new AppError(401, "Unauthorized - Invalid Token");
    }

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new AppError(401, "Token has expired");
    }

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Add token and decoded info to request for use in routes
    req.user = user;
    req.token = token;
    req.tokenDecoded = decoded;

    logger.debug(`User ${user._id} authenticated successfully`);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError(401, "Invalid token format"));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError(401, "Token has expired"));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      logger.error(`Authentication error: ${error.message}`);
      next(new AppError(500, "Internal server error"));
    }
  }
};
// auth fix
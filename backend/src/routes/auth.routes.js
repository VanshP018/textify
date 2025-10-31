import express from 'express';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// Add your auth routes here
// Example:
// router.post('/login', loginController);
// router.post('/register', registerController);
// router.post('/logout', logoutController);

export default router;
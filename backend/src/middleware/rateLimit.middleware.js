import rateLimit from 'express-rate-limit';

/**
 * Rate limiter configuration for authentication endpoints
 * Limits the number of requests from the same IP address
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        status: 429,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Store should be changed to Redis in production
    skipFailedRequests: false, // count failed requests
    skipSuccessfulRequests: true, // don't count successful requests
    keyGenerator: (req) => {
        return req.ip; // you can also use req.headers['x-forwarded-for'] or custom header
    },
    handler: (req, res) => {
        res.status(429).json({
            status: 429,
            message: 'Too many login attempts. Please try again after 15 minutes.',
            nextValidRequestTime: new Date(Date.now() + 15 * 60 * 1000)
        });
    }
});

/**
 * General API rate limiter for all other endpoints
 * Less strict than auth limiter
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            status: 429,
            message: 'Too many requests. Please try again after 15 minutes.',
            nextValidRequestTime: new Date(Date.now() + 15 * 60 * 1000)
        });
    }
});
import logger from '../lib/logger.js';

export class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    // Log stack trace for non-operational errors
    if (!err.isOperational) {
        logger.error('Stack trace:', err.stack);
    }

    // Development vs Production error response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production: don't leak error details
        res.status(err.statusCode).json({
            status: err.status,
            message: err.isOperational ? err.message : 'Something went wrong!'
        });
    }
};
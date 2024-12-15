const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};

module.exports = errorHandler;

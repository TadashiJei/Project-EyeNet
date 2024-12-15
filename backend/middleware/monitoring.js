const monitoringService = require('../services/monitoringService');

const monitoringMiddleware = (req, res, next) => {
    const start = process.hrtime();

    // Add response listener
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

        monitoringService.recordAPIMetric(
            req.method,
            req.path,
            duration,
            res.statusCode
        );
    });

    next();
};

module.exports = monitoringMiddleware;

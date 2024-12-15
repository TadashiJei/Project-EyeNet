const { NetworkUsage } = require('../models');

const networkMonitor = async (req, res, next) => {
    const startTime = process.hrtime();
    const originalSend = res.send;

    // Override res.send to capture response size and timing
    res.send = function (data) {
        const endTime = process.hrtime(startTime);
        const duration = (endTime[0] * 1000) + (endTime[1] / 1000000); // Convert to milliseconds
        
        // Only log if we have IP info (passed by ipRestriction middleware)
        if (req.ipInfo) {
            const networkUsage = new NetworkUsage({
                ipAddress: req.ipInfo.ipAddress,
                departmentId: req.ipInfo.departmentId,
                bytesUsed: Buffer.byteLength(JSON.stringify(data), 'utf8'),
                websiteVisited: req.originalUrl,
                duration: duration,
                category: determineCategory(req.originalUrl)
            });

            // Save asynchronously - don't wait for it
            networkUsage.save().catch(err => {
                console.error('Error saving network usage:', err);
            });
        }

        originalSend.call(this, data);
    };

    next();
};

function determineCategory(url) {
    if (url.includes('/api/work') || url.includes('/api/reports')) {
        return 'work';
    } else if (url.includes('/api/social') || url.includes('/facebook') || url.includes('/twitter')) {
        return 'social';
    } else if (url.includes('/stream') || url.includes('/video')) {
        return 'streaming';
    }
    return 'other';
}

module.exports = networkMonitor;

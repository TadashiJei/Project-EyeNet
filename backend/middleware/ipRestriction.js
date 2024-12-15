const { IPAddress } = require('../models');

const ipRestriction = async (req, res, next) => {
    try {
        const clientIP = req.ip || req.connection.remoteAddress;
        
        // Check if IP exists and is not blocked
        const ipRecord = await IPAddress.findOne({ ipAddress: clientIP });
        
        if (!ipRecord) {
            return res.status(403).json({
                status: 'error',
                message: 'IP not registered in the system'
            });
        }

        if (ipRecord.status === 'blocked') {
            return res.status(403).json({
                status: 'error',
                message: 'IP is blocked'
            });
        }

        // Check URL restrictions if any
        if (ipRecord.status === 'restricted' && ipRecord.restrictions.length > 0) {
            const currentUrl = req.originalUrl;
            const isRestricted = ipRecord.restrictions.some(pattern => 
                new RegExp(pattern).test(currentUrl)
            );

            if (isRestricted) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access to this resource is restricted'
                });
            }
        }

        // Update last active timestamp
        await IPAddress.updateOne(
            { _id: ipRecord._id },
            { $set: { lastActive: new Date() } }
        );

        // Add IP info to request for later use
        req.ipInfo = ipRecord;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = ipRestriction;

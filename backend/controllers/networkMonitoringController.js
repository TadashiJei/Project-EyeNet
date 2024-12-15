const NetworkDevice = require('../models/NetworkDevice');
const NetworkTraffic = require('../models/NetworkTraffic');
const NetworkAlert = require('../models/NetworkAlert');

// Get network statistics
exports.getNetworkStats = async (req, res) => {
    try {
        const activeDevices = await NetworkDevice.countDocuments({ status: 'online' });
        const totalTraffic = await NetworkTraffic.aggregate([
            {
                $group: {
                    _id: null,
                    totalBytesIn: { $sum: '$bytesIn' },
                    totalBytesOut: { $sum: '$bytesOut' }
                }
            }
        ]);

        const errorCount = await NetworkAlert.countDocuments({ 
            severity: 'critical',
            createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
        });

        res.json({
            activeDevices,
            totalTraffic: totalTraffic[0] || { totalBytesIn: 0, totalBytesOut: 0 },
            errorRate: ((errorCount / (activeDevices || 1)) * 100).toFixed(2),
            responseTime: Math.floor(Math.random() * 100) + 50 // Simulated response time
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get network alerts
exports.getNetworkAlerts = async (req, res) => {
    try {
        const alerts = await NetworkAlert.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get traffic analysis
exports.getTrafficAnalysis = async (req, res) => {
    try {
        const { timeRange = '1h' } = req.query;
        let timeFilter = {};

        switch (timeRange) {
            case '1h':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 60*60*1000) } };
                break;
            case '24h':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) } };
                break;
            case '7d':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 7*24*60*60*1000) } };
                break;
            case '30d':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 30*24*60*60*1000) } };
                break;
            default:
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 60*60*1000) } };
        }

        const trafficData = await NetworkTraffic.find(timeFilter)
            .sort({ timestamp: -1 })
            .limit(100);

        res.json(trafficData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get connected devices
exports.getConnectedDevices = async (req, res) => {
    try {
        const devices = await NetworkDevice.find()
            .sort({ lastSeen: -1 })
            .limit(20);

        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get performance metrics
exports.getPerformanceMetrics = async (req, res) => {
    try {
        const { timeRange = '1h' } = req.query;
        let timeFilter = {};

        switch (timeRange) {
            case '1h':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 60*60*1000) } };
                break;
            case '24h':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) } };
                break;
            case '7d':
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 7*24*60*60*1000) } };
                break;
            default:
                timeFilter = { timestamp: { $gte: new Date(Date.now() - 60*60*1000) } };
        }

        const metrics = await NetworkTraffic.aggregate([
            { $match: timeFilter },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: timeRange === '1h' ? '%Y-%m-%d %H:%M' : '%Y-%m-%d',
                            date: '$timestamp'
                        }
                    },
                    avgResponseTime: { $avg: '$responseTime' },
                    totalBytesIn: { $sum: '$bytesIn' },
                    totalBytesOut: { $sum: '$bytesOut' },
                    errorCount: { $sum: { $cond: [{ $gt: ['$errorCount', 0] }, 1, 0] } }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

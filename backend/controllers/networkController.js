const Device = require('../models/Device');

// Get network statistics
exports.getNetworkStats = async (req, res) => {
    try {
        // Get device statistics
        const deviceStats = await Device.aggregate([
            {
                $group: {
                    _id: null,
                    totalDevices: { $sum: 1 },
                    onlineDevices: {
                        $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] }
                    },
                    totalBandwidthIn: { $sum: '$networkUsage.inbound' },
                    totalBandwidthOut: { $sum: '$networkUsage.outbound' },
                    avgCpuUsage: { $avg: '$cpuUsage' },
                    avgMemoryUsage: { $avg: '$memoryUsage' },
                    avgDiskUsage: { $avg: '$diskUsage' }
                }
            }
        ]);

        // Get device type distribution
        const deviceTypes = await Device.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get department distribution
        const departmentStats = await Device.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            overview: deviceStats[0] || {
                totalDevices: 0,
                onlineDevices: 0,
                totalBandwidthIn: 0,
                totalBandwidthOut: 0,
                avgCpuUsage: 0,
                avgMemoryUsage: 0,
                avgDiskUsage: 0
            },
            deviceTypes,
            departmentStats
        });
    } catch (error) {
        console.error('Error in getNetworkStats:', error);
        res.status(500).json({ message: 'Error fetching network statistics' });
    }
};

// Get traffic analysis
exports.getTrafficAnalysis = async (req, res) => {
    try {
        const { timeRange = '1h' } = req.query;
        
        // Calculate the time threshold based on the timeRange
        const now = new Date();
        let timeThreshold = new Date();
        
        switch (timeRange) {
            case '1h':
                timeThreshold.setHours(now.getHours() - 1);
                break;
            case '24h':
                timeThreshold.setDate(now.getDate() - 1);
                break;
            case '7d':
                timeThreshold.setDate(now.getDate() - 7);
                break;
            case '30d':
                timeThreshold.setDate(now.getDate() - 30);
                break;
            default:
                timeThreshold.setHours(now.getHours() - 1);
        }

        const trafficData = await Device.aggregate([
            {
                $match: {
                    lastSeen: { $gte: timeThreshold }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: timeRange === '1h' ? '%Y-%m-%d %H:%M' : '%Y-%m-%d',
                            date: '$lastSeen'
                        }
                    },
                    inbound: { $sum: '$networkUsage.inbound' },
                    outbound: { $sum: '$networkUsage.outbound' }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);

        res.json(trafficData);
    } catch (error) {
        console.error('Error in getTrafficAnalysis:', error);
        res.status(500).json({ message: 'Error fetching traffic analysis' });
    }
};

// Get network alerts
exports.getNetworkAlerts = async (req, res) => {
    try {
        const alerts = await Device.aggregate([
            {
                $match: {
                    $or: [
                        { cpuUsage: { $gt: 90 } },
                        { memoryUsage: { $gt: 90 } },
                        { diskUsage: { $gt: 90 } },
                        { status: 'offline' }
                    ]
                }
            },
            {
                $project: {
                    deviceName: '$name',
                    deviceType: '$type',
                    severity: {
                        $switch: {
                            branches: [
                                { case: { $gt: ['$cpuUsage', 95] }, then: 'high' },
                                { case: { $gt: ['$memoryUsage', 95] }, then: 'high' },
                                { case: { $gt: ['$diskUsage', 95] }, then: 'high' },
                                { case: { $eq: ['$status', 'offline'] }, then: 'medium' },
                                { case: { $gt: ['$cpuUsage', 90] }, then: 'medium' },
                                { case: { $gt: ['$memoryUsage', 90] }, then: 'medium' },
                                { case: { $gt: ['$diskUsage', 90] }, then: 'medium' }
                            ],
                            default: 'low'
                        }
                    },
                    message: {
                        $concat: [
                            { $cond: [{ $gt: ['$cpuUsage', 90] }, 'High CPU usage', ''] },
                            { $cond: [{ $gt: ['$memoryUsage', 90] }, 'High memory usage', ''] },
                            { $cond: [{ $gt: ['$diskUsage', 90] }, 'High disk usage', ''] },
                            { $cond: [{ $eq: ['$status', 'offline'] }, 'Device offline', ''] }
                        ]
                    },
                    timestamp: '$lastSeen'
                }
            },
            {
                $sort: { severity: -1, timestamp: -1 }
            }
        ]);

        res.json(alerts);
    } catch (error) {
        console.error('Error in getNetworkAlerts:', error);
        res.status(500).json({ message: 'Error fetching network alerts' });
    }
};

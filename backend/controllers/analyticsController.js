const { NetworkUsage, Department, Device } = require('../models');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subHours } = require('date-fns');

const analyticsController = {
    // Get most visited websites
    getMostVisitedWebsites: async (req, res) => {
        try {
            const { departmentId, timeframe = 'day' } = req.query;
            let startDate, endDate;

            // Set time range based on timeframe
            switch(timeframe) {
                case 'week':
                    startDate = startOfWeek(new Date());
                    endDate = endOfWeek(new Date());
                    break;
                case 'month':
                    startDate = startOfMonth(new Date());
                    endDate = endOfMonth(new Date());
                    break;
                default:
                    startDate = startOfDay(new Date());
                    endDate = endOfDay(new Date());
            }

            const query = {
                timestamp: { $gte: startDate, $lte: endDate }
            };

            if (departmentId) {
                query.departmentId = departmentId;
            }

            const mostVisited = await NetworkUsage.aggregate([
                { $match: query },
                { $group: {
                    _id: '$websiteVisited',
                    visits: { $sum: 1 },
                    totalBytes: { $sum: '$bytesUsed' },
                    avgDuration: { $avg: '$duration' }
                }},
                { $sort: { visits: -1 }},
                { $limit: 10 }
            ]);

            res.json({
                status: 'success',
                data: mostVisited
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get department usage statistics
    getDepartmentUsage: async (req, res) => {
        try {
            const { timeframe = 'day' } = req.query;
            let startDate, endDate;

            // Set time range
            switch(timeframe) {
                case 'week':
                    startDate = startOfWeek(new Date());
                    endDate = endOfWeek(new Date());
                    break;
                case 'month':
                    startDate = startOfMonth(new Date());
                    endDate = endOfMonth(new Date());
                    break;
                default:
                    startDate = startOfDay(new Date());
                    endDate = endOfDay(new Date());
            }

            const departmentUsage = await NetworkUsage.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$departmentId',
                        totalBytes: { $sum: '$bytesUsed' },
                        totalDuration: { $sum: '$duration' },
                        uniqueWebsites: { $addToSet: '$websiteVisited' },
                        categoryBreakdown: {
                            $push: '$category'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'department'
                    }
                },
                {
                    $unwind: '$department'
                },
                {
                    $project: {
                        departmentName: '$department.name',
                        totalBytes: 1,
                        totalDuration: 1,
                        uniqueWebsitesCount: { $size: '$uniqueWebsites' },
                        categoryBreakdown: {
                            work: {
                                $size: {
                                    $filter: {
                                        input: '$categoryBreakdown',
                                        as: 'category',
                                        cond: { $eq: ['$$category', 'work'] }
                                    }
                                }
                            },
                            social: {
                                $size: {
                                    $filter: {
                                        input: '$categoryBreakdown',
                                        as: 'category',
                                        cond: { $eq: ['$$category', 'social'] }
                                    }
                                }
                            },
                            streaming: {
                                $size: {
                                    $filter: {
                                        input: '$categoryBreakdown',
                                        as: 'category',
                                        cond: { $eq: ['$$category', 'streaming'] }
                                    }
                                }
                            },
                            other: {
                                $size: {
                                    $filter: {
                                        input: '$categoryBreakdown',
                                        as: 'category',
                                        cond: { $eq: ['$$category', 'other'] }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: { totalBytes: -1 }
                }
            ]);

            res.json({
                status: 'success',
                data: departmentUsage
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get bandwidth usage over time
    getBandwidthUsage: async (req, res) => {
        try {
            const { timeRange = '24h' } = req.query;
            let startDate = new Date();

            switch (timeRange) {
                case '1h':
                    startDate = subHours(new Date(), 1);
                    break;
                case '24h':
                    startDate = subHours(new Date(), 24);
                    break;
                case '7d':
                    startDate = startOfWeek(new Date());
                    break;
                case '30d':
                    startDate = startOfMonth(new Date());
                    break;
                default:
                    startDate = subHours(new Date(), 24);
            }

            const bandwidthData = await NetworkUsage.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: timeRange === '1h' ? '%Y-%m-%d %H:%M' : '%Y-%m-%d',
                                date: '$timestamp'
                            }
                        },
                        inbound: { $sum: '$bytesReceived' },
                        outbound: { $sum: '$bytesSent' }
                    }
                },
                {
                    $sort: { '_id': 1 }
                }
            ]);

            res.json({
                status: 'success',
                data: bandwidthData
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get application usage statistics
    getApplicationUsage: async (req, res) => {
        try {
            const { timeRange = '24h' } = req.query;
            let startDate = new Date();

            switch (timeRange) {
                case '1h':
                    startDate = subHours(new Date(), 1);
                    break;
                case '24h':
                    startDate = subHours(new Date(), 24);
                    break;
                case '7d':
                    startDate = startOfWeek(new Date());
                    break;
                case '30d':
                    startDate = startOfMonth(new Date());
                    break;
                default:
                    startDate = subHours(new Date(), 24);
            }

            const appUsage = await NetworkUsage.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: '$application',
                        totalBytes: { $sum: { $add: ['$bytesReceived', '$bytesSent'] } },
                        sessions: { $sum: 1 }
                    }
                },
                {
                    $sort: { totalBytes: -1 }
                },
                {
                    $limit: 10
                }
            ]);

            res.json({
                status: 'success',
                data: appUsage
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get predictive analytics
    getPredictiveAnalytics: async (req, res) => {
        try {
            // Get current metrics
            const currentMetrics = await Promise.all([
                // Total bandwidth usage
                NetworkUsage.aggregate([
                    {
                        $match: {
                            timestamp: { $gte: startOfDay(new Date()) }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalBytes: { $sum: { $add: ['$bytesReceived', '$bytesSent'] } }
                        }
                    }
                ]),

                // Active devices count
                Device.countDocuments({ status: 'online' }),

                // Average network latency
                NetworkUsage.aggregate([
                    {
                        $match: {
                            timestamp: { $gte: startOfDay(new Date()) }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            avgLatency: { $avg: '$latency' }
                        }
                    }
                ]),

                // Packet loss rate
                NetworkUsage.aggregate([
                    {
                        $match: {
                            timestamp: { $gte: startOfDay(new Date()) }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            packetLoss: {
                                $avg: {
                                    $divide: [
                                        { $subtract: ['$packetsReceived', '$packetsSent'] },
                                        '$packetsSent'
                                    ]
                                }
                            }
                        }
                    }
                ])
            ]);

            // Simple prediction model (for demo purposes)
            // In a real application, you would use more sophisticated ML models
            const predictions = {
                bandwidthUsage: {
                    current: `${(currentMetrics[0][0]?.totalBytes / (1024 * 1024 * 1024)).toFixed(1)} TB`,
                    predicted: `${((currentMetrics[0][0]?.totalBytes * 1.15) / (1024 * 1024 * 1024)).toFixed(1)} TB`,
                    trend: 15
                },
                activeUsers: {
                    current: currentMetrics[1].toString(),
                    predicted: Math.round(currentMetrics[1] * 0.95).toString(),
                    trend: -5
                },
                networkLatency: {
                    current: `${currentMetrics[2][0]?.avgLatency.toFixed(0)}ms`,
                    predicted: `${(currentMetrics[2][0]?.avgLatency * 1.1).toFixed(0)}ms`,
                    trend: 10
                },
                packetLoss: {
                    current: `${(currentMetrics[3][0]?.packetLoss * 100).toFixed(1)}%`,
                    predicted: `${(currentMetrics[3][0]?.packetLoss * 90).toFixed(1)}%`,
                    trend: -10
                }
            };

            res.json({
                status: 'success',
                data: predictions
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = analyticsController;

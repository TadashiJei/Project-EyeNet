const { NetworkUsage, Department } = require('../models');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

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
    }
};

module.exports = analyticsController;

const monitoringService = require('../services/monitoringService');

const monitoringController = {
    // Get current metrics
    getCurrentMetrics: async (req, res) => {
        try {
            const metrics = monitoringService.getMetrics();
            res.json({
                status: 'success',
                data: metrics
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error.message
            });
        }
    },

    // Get system health
    getSystemHealth: async (req, res) => {
        try {
            const health = monitoringService.getSystemHealth();
            res.json({
                status: 'success',
                data: health
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error.message
            });
        }
    },

    // Get historical metrics
    getHistoricalMetrics: async (req, res) => {
        try {
            const { timeframe = '1h' } = req.query;
            const metrics = monitoringService.getMetrics();
            
            // Filter history based on timeframe
            const timeframeMs = parseTimeframe(timeframe);
            const cutoff = Date.now() - timeframeMs;
            
            const filteredHistory = Object.entries(metrics.history).reduce((acc, [key, data]) => {
                acc[key] = data.filter(item => item.timestamp >= cutoff);
                return acc;
            }, {});

            res.json({
                status: 'success',
                data: {
                    timeframe,
                    metrics: filteredHistory
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error.message
            });
        }
    },

    // Get API metrics
    getAPIMetrics: async (req, res) => {
        try {
            const metrics = monitoringService.getMetrics();
            res.json({
                status: 'success',
                data: {
                    api: metrics.current.api,
                    requests: metrics.history.requests
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error.message
            });
        }
    },

    // Get WebSocket metrics
    getWebSocketMetrics: async (req, res) => {
        try {
            const metrics = monitoringService.getMetrics();
            res.json({
                status: 'success',
                data: {
                    websocket: metrics.current.websocket
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error.message
            });
        }
    }
};

// Helper function to parse timeframe string to milliseconds
function parseTimeframe(timeframe) {
    const unit = timeframe.slice(-1);
    const value = parseInt(timeframe.slice(0, -1));
    
    switch (unit) {
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        case 'm':
            return value * 60 * 1000;
        default:
            return 60 * 60 * 1000; // default 1 hour
    }
}

module.exports = monitoringController;

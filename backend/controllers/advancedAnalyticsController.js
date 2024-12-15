const AnalyticsEngine = require('../services/analyticsEngine');
const { NetworkUsage, Department } = require('../models');
const cache = require('memory-cache');
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const advancedAnalyticsController = {
    // Get comprehensive department analysis
    getDepartmentAnalysis: async (req, res) => {
        try {
            const { departmentId } = req.params;
            const cacheKey = `dept_analysis_${departmentId}`;
            
            // Check cache first
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                return res.json({
                    status: 'success',
                    data: cachedData,
                    source: 'cache'
                });
            }

            // Parallel processing for different metrics
            const [
                anomalies,
                patterns,
                predictions,
                securityScore
            ] = await Promise.all([
                AnalyticsEngine.detectAnomalies(departmentId),
                AnalyticsEngine.analyzeUsagePatterns(departmentId),
                AnalyticsEngine.predictFutureUsage(departmentId),
                AnalyticsEngine.calculateSecurityScore(departmentId)
            ]);

            const analysis = {
                anomalies,
                patterns,
                predictions,
                securityScore,
                timestamp: new Date()
            };

            // Cache the results
            cache.put(cacheKey, analysis, CACHE_DURATION);

            res.json({
                status: 'success',
                data: analysis,
                source: 'fresh'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get real-time network insights
    getRealTimeInsights: async (req, res) => {
        try {
            const { departmentId } = req.params;
            const { window = 300 } = req.query; // Default 5 minutes window

            const startTime = new Date(Date.now() - (window * 1000));
            
            const realtimeData = await NetworkUsage.aggregate([
                {
                    $match: {
                        departmentId,
                        timestamp: { $gte: startTime }
                    }
                },
                {
                    $group: {
                        _id: {
                            minute: { $minute: '$timestamp' },
                            category: '$category'
                        },
                        bytesUsed: { $sum: '$bytesUsed' },
                        activeUsers: { $addToSet: '$ipAddress' }
                    }
                },
                {
                    $project: {
                        category: '$_id.category',
                        minute: '$_id.minute',
                        bytesUsed: 1,
                        activeUserCount: { $size: '$activeUsers' }
                    }
                }
            ]);

            res.json({
                status: 'success',
                data: {
                    realtimeData,
                    window,
                    timestamp: new Date()
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get predictive insights
    getPredictiveInsights: async (req, res) => {
        try {
            const { departmentId } = req.params;
            const { days = 7 } = req.query;

            const predictions = await AnalyticsEngine.predictFutureUsage(departmentId, days);
            const currentPatterns = await AnalyticsEngine.analyzeUsagePatterns(departmentId);

            // Combine predictions with pattern analysis
            const insights = predictions.map(pred => ({
                ...pred,
                patterns: currentPatterns.filter(p => 
                    p.dayOfWeek === new Date(pred.date).getDay()
                )
            }));

            res.json({
                status: 'success',
                data: {
                    predictions: insights,
                    confidence: this.calculatePredictionConfidence(insights)
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get security recommendations
    getSecurityRecommendations: async (req, res) => {
        try {
            const { departmentId } = req.params;
            
            const securityScore = await AnalyticsEngine.calculateSecurityScore(departmentId);
            const anomalies = await AnalyticsEngine.detectAnomalies(departmentId);
            
            // Generate specific recommendations based on security metrics
            const recommendations = this.generateRecommendations(securityScore, anomalies);

            res.json({
                status: 'success',
                data: {
                    securityScore,
                    recommendations,
                    urgentActions: recommendations.filter(r => r.priority === 'high')
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Helper methods
    calculatePredictionConfidence(insights) {
        const patternConfidence = insights.reduce((acc, insight) => {
            const avgPatternConfidence = insight.patterns.reduce(
                (sum, p) => sum + p.confidence, 0
            ) / (insight.patterns.length || 1);
            return acc + avgPatternConfidence;
        }, 0) / insights.length;

        return Math.round(patternConfidence * 100);
    },

    generateRecommendations(securityScore, anomalies) {
        const recommendations = [];

        // Score-based recommendations
        if (securityScore.overallScore < 70) {
            recommendations.push({
                type: 'security_policy',
                priority: 'high',
                message: 'Review and update security policies',
                impact: 'High impact on overall security posture'
            });
        }

        // Anomaly-based recommendations
        if (anomalies.length > 0) {
            recommendations.push({
                type: 'anomaly_investigation',
                priority: 'high',
                message: 'Investigate detected network anomalies',
                details: anomalies.map(a => ({
                    timestamp: a.timestamp,
                    bytesUsed: a.bytesUsed
                }))
            });
        }

        // Component-based recommendations
        if (securityScore.components.websiteScore < 60) {
            recommendations.push({
                type: 'website_access',
                priority: 'medium',
                message: 'Review and update website access policies',
                impact: 'Medium impact on security and productivity'
            });
        }

        return recommendations;
    }
};

module.exports = advancedAnalyticsController;

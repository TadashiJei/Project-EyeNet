const { NetworkUsage, IPAddress } = require('../models');
const { startOfDay, subDays, format, addDays } = require('date-fns');

class AnalyticsEngine {
    // Anomaly detection using Z-score algorithm
    static async detectAnomalies(departmentId, threshold = 2) {
        const today = startOfDay(new Date());
        const lastWeek = subDays(today, 7);

        const usageData = await NetworkUsage.find({
            departmentId,
            timestamp: { $gte: lastWeek }
        });

        // Calculate mean and standard deviation of bytes used
        const bytesArray = usageData.map(usage => usage.bytesUsed);
        const mean = bytesArray.reduce((a, b) => a + b, 0) / bytesArray.length;
        const stdDev = Math.sqrt(
            bytesArray.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / bytesArray.length
        );

        // Detect anomalies using Z-score
        return usageData.filter(usage => {
            const zScore = Math.abs((usage.bytesUsed - mean) / stdDev);
            return zScore > threshold;
        });
    }

    // Pattern detection using time series analysis
    static async analyzeUsagePatterns(departmentId, days = 30) {
        const startDate = subDays(startOfDay(new Date()), days);

        const usageData = await NetworkUsage.aggregate([
            {
                $match: {
                    departmentId,
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        hour: { $hour: '$timestamp' },
                        dayOfWeek: { $dayOfWeek: '$timestamp' }
                    },
                    avgUsage: { $avg: '$bytesUsed' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 }
            }
        ]);

        // Process patterns to identify peak usage times
        const patterns = this.processUsagePatterns(usageData);
        return patterns;
    }

    // Website categorization using TF-IDF algorithm
    static async categorizeWebsites(departmentId) {
        const websites = await NetworkUsage.aggregate([
            {
                $match: { departmentId }
            },
            {
                $group: {
                    _id: '$websiteVisited',
                    totalVisits: { $sum: 1 },
                    totalBytes: { $sum: '$bytesUsed' },
                    categories: { $addToSet: '$category' }
                }
            }
        ]);

        // Calculate TF-IDF scores
        const totalDocuments = websites.length;
        return websites.map(site => {
            const tfidf = this.calculateTFIDF(site, totalDocuments, websites);
            return {
                ...site,
                relevanceScore: tfidf
            };
        });
    }

    // Predictive analysis using exponential smoothing
    static async predictFutureUsage(departmentId, daysToPredict = 7) {
        const historicalData = await NetworkUsage.aggregate([
            {
                $match: { departmentId }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
                    },
                    totalBytes: { $sum: '$bytesUsed' }
                }
            },
            {
                $sort: { '_id.date': 1 }
            }
        ]);

        const alpha = 0.3; // smoothing factor
        const predictions = this.exponentialSmoothing(
            historicalData.map(d => d.totalBytes),
            alpha,
            daysToPredict
        );

        return predictions.map((value, index) => ({
            date: format(addDays(new Date(), index), 'yyyy-MM-dd'),
            predictedUsage: Math.round(value)
        }));
    }

    // Network Security Score calculation
    static async calculateSecurityScore(departmentId) {
        const metrics = await Promise.all([
            this.detectAnomalies(departmentId),
            this.analyzeUsagePatterns(departmentId),
            this.categorizeWebsites(departmentId)
        ]);

        const [anomalies, patterns, websites] = metrics;
        
        // Calculate security score components
        const anomalyScore = 100 - (anomalies.length * 5); // Deduct 5 points per anomaly
        const patternScore = this.calculatePatternScore(patterns);
        const websiteScore = this.calculateWebsiteScore(websites);

        // Weighted average of scores
        const securityScore = (
            (anomalyScore * 0.4) +
            (patternScore * 0.3) +
            (websiteScore * 0.3)
        );

        return {
            overallScore: Math.max(0, Math.min(100, securityScore)),
            components: {
                anomalyScore,
                patternScore,
                websiteScore
            },
            details: {
                anomaliesDetected: anomalies.length,
                riskySites: websites.filter(w => w.relevanceScore < 0.3).length,
                unusualPatterns: patterns.filter(p => p.confidence < 0.5).length
            }
        };
    }

    // Helper methods
    static processUsagePatterns(usageData) {
        return usageData.map(data => ({
            dayOfWeek: data._id.dayOfWeek,
            hour: data._id.hour,
            avgUsage: data.avgUsage,
            confidence: this.calculateConfidence(data.count, data.avgUsage)
        }));
    }

    static calculateTFIDF(site, totalDocs, allSites) {
        const tf = site.totalVisits;
        const df = allSites.filter(s => 
            s.categories.some(c => site.categories.includes(c))
        ).length;
        const idf = Math.log(totalDocs / (1 + df));
        return tf * idf;
    }

    static exponentialSmoothing(data, alpha, predict) {
        let smoothed = [data[0]];
        for (let i = 1; i < data.length; i++) {
            smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i-1];
        }
        
        // Make predictions
        let predictions = [];
        let lastValue = smoothed[smoothed.length - 1];
        for (let i = 0; i < predict; i++) {
            predictions.push(lastValue);
        }
        
        return predictions;
    }

    static calculateConfidence(count, avgUsage) {
        // Normalize confidence based on sample size and usage consistency
        const sampleWeight = Math.min(count / 100, 1);
        const usageWeight = Math.min(avgUsage / 1000000, 1);
        return (sampleWeight * 0.7 + usageWeight * 0.3);
    }

    static calculatePatternScore(patterns) {
        const regularityScore = patterns.reduce((acc, p) => acc + p.confidence, 0) / patterns.length;
        return regularityScore * 100;
    }

    static calculateWebsiteScore(websites) {
        const totalSites = websites.length;
        const riskyCount = websites.filter(w => w.relevanceScore < 0.3).length;
        return 100 - ((riskyCount / totalSites) * 100);
    }
}

module.exports = AnalyticsEngine;
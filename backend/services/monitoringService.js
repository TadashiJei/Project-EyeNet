const os = require('os');
const { performance } = require('perf_hooks');
const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');
const notificationService = require('./notificationService');

class MonitoringService extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            system: {},
            api: {},
            websocket: {},
            database: {},
            eyenet: {},
            alerts: [],
            customMetrics: {}
        };
        this.history = {
            cpu: [],
            memory: [],
            requests: [],
            errors: [],
            departments: [],
            analytics: [],
            customMetrics: {}
        };
        this.alertThresholds = {
            system: {
                cpu: 80,
                memory: 85,
                diskSpace: 90
            }
        }; // Set default thresholds
        // Initialize async
        this.initializeAsync();
        this.notificationSettings = {
            email: {
                enabled: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
                minSeverity: process.env.EMAIL_MIN_SEVERITY || 'warning'
            }
        };
        this.startMonitoring();
    }

    async initializeAsync() {
        try {
            this.alertThresholds = await this.loadThresholds();
        } catch (error) {
            console.error('Failed to load thresholds:', error);
            // Keep using default thresholds
        }
    }

    async loadThresholds() {
        try {
            const thresholdsPath = path.join(__dirname, '../config/thresholds.json');
            const data = await fs.readFile(thresholdsPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {
                system: {
                    cpu: 80,
                    memory: 85,
                    diskSpace: 90
                },
                api: {
                    errorRate: 5,
                    responseTime: 1000,
                    requestRate: 1000
                },
                eyenet: {
                    departmentLoad: 1000,
                    analyticsQueueSize: 100,
                    securityIncidents: {
                        critical: 1,
                        high: 5
                    },
                    modelAccuracy: 0.95,
                    predictionLatency: 200
                },
                custom: {} // For user-defined thresholds
            };
        }
    }

    async saveThresholds(thresholds) {
        const thresholdsPath = path.join(__dirname, '../config/thresholds.json');
        await fs.writeFile(thresholdsPath, JSON.stringify(thresholds, null, 2));
        this.alertThresholds = thresholds;
    }

    startMonitoring() {
        // System metrics every 5 seconds
        setInterval(() => this.collectSystemMetrics(), 5000);
        
        // EyeNet specific metrics every 10 seconds
        setInterval(() => this.collectEyeNetMetrics(), 10000);
        
        // Check for alerts every minute
        setInterval(() => this.checkAlerts(), 60000);
        
        // Clean up old history data every hour
        setInterval(() => this.cleanHistory(), 3600000);
    }

    async collectEyeNetMetrics() {
        try {
            const eyeNetMetrics = {
                timestamp: Date.now(),
                activeDepartments: await this.getActiveDepartments(),
                analyticsJobs: await this.getAnalyticsJobs(),
                securityIncidents: await this.getSecurityIncidents(),
                userActivity: await this.getUserActivity(),
                modelPerformance: await this.getModelPerformance(),
                resourceUtilization: await this.getResourceUtilization(),
                networkTraffic: await this.getNetworkTraffic(),
                predictionMetrics: await this.getPredictionMetrics()
            };

            this.metrics.eyenet = eyeNetMetrics;
            this.updateHistory('eyenet', eyeNetMetrics);
            this.emit('metrics:eyenet:update', eyeNetMetrics);
        } catch (error) {
            this.recordAlert('error', 'Failed to collect EyeNet metrics', error.message);
        }
    }

    async getModelPerformance() {
        return {
            accuracy: 0.98,
            precision: 0.97,
            recall: 0.96,
            f1Score: 0.97,
            latency: {
                avg: 150,
                p95: 200,
                p99: 250
            },
            throughput: 1000,
            errorRate: 0.02
        };
    }

    async getResourceUtilization() {
        return {
            gpu: {
                usage: 75,
                memory: 80,
                temperature: 65
            },
            storage: {
                total: 1000,
                used: 600,
                free: 400
            },
            bandwidth: {
                in: 100,
                out: 150
            }
        };
    }

    async getPredictionMetrics() {
        return {
            totalPredictions: 10000,
            successRate: 0.99,
            averageLatency: 150,
            batchSize: 32,
            queueLength: 10,
            modelVersion: '1.0.0',
            accuracy: {
                overall: 0.98,
                byCategory: {
                    category1: 0.97,
                    category2: 0.99
                }
            }
        };
    }

    async exportMetrics(timeframe) {
        const endTime = Date.now();
        const startTime = endTime - this.parseTimeframe(timeframe);
        
        const exportData = {
            system: this.filterMetricsByTimeframe(this.history.cpu, startTime, endTime),
            memory: this.filterMetricsByTimeframe(this.history.memory, startTime, endTime),
            api: this.filterMetricsByTimeframe(this.history.requests, startTime, endTime),
            eyenet: this.filterMetricsByTimeframe(this.history.departments, startTime, endTime),
            alerts: this.metrics.alerts.filter(alert => alert.timestamp >= startTime),
            customMetrics: {}
        };

        // Export custom metrics
        Object.keys(this.history.customMetrics).forEach(metric => {
            exportData.customMetrics[metric] = this.filterMetricsByTimeframe(
                this.history.customMetrics[metric],
                startTime,
                endTime
            );
        });

        return exportData;
    }

    parseTimeframe(timeframe) {
        const unit = timeframe.slice(-1);
        const value = parseInt(timeframe.slice(0, -1));
        
        switch (unit) {
            case 'h': return value * 60 * 60 * 1000;
            case 'd': return value * 24 * 60 * 60 * 1000;
            case 'w': return value * 7 * 24 * 60 * 60 * 1000;
            default: return 24 * 60 * 60 * 1000; // Default to 24 hours
        }
    }

    filterMetricsByTimeframe(metrics, startTime, endTime) {
        return metrics.filter(metric => 
            metric.timestamp >= startTime && metric.timestamp <= endTime
        );
    }

    addCustomMetric(name, value, metadata = {}) {
        if (!this.history.customMetrics[name]) {
            this.history.customMetrics[name] = [];
        }

        const metric = {
            timestamp: Date.now(),
            value,
            metadata
        };

        this.history.customMetrics[name].push(metric);
        this.checkCustomMetricThresholds(name, value, metadata);
    }

    checkCustomMetricThresholds(name, value, metadata) {
        const threshold = this.alertThresholds.custom[name];
        if (!threshold) return;

        if (threshold.max && value > threshold.max) {
            this.recordAlert('warning', `Custom Metric Alert: ${name}`,
                `Value ${value} exceeds maximum threshold of ${threshold.max}`);
        }

        if (threshold.min && value < threshold.min) {
            this.recordAlert('warning', `Custom Metric Alert: ${name}`,
                `Value ${value} below minimum threshold of ${threshold.min}`);
        }
    }

    async getActiveDepartments() {
        // Implement department metrics collection
        return {
            total: 0,
            active: 0,
            inactive: 0
        };
    }

    async getAnalyticsJobs() {
        // Implement analytics jobs metrics collection
        return {
            running: 0,
            queued: 0,
            completed: 0,
            failed: 0
        };
    }

    async getSecurityIncidents() {
        // Implement security incidents collection
        return {
            total: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        };
    }

    async getUserActivity() {
        // Implement user activity collection
        return {
            activeUsers: 0,
            totalSessions: 0,
            averageSessionDuration: 0
        };
    }

    checkAlerts() {
        const currentMetrics = this.metrics.system;
        const eyeNetMetrics = this.metrics.eyenet;

        // System alerts
        if (!this.alertThresholds?.system) {
            console.warn('Alert thresholds not properly initialized');
            return;
        }

        if (currentMetrics?.memory?.usedPercent > this.alertThresholds.system.memory) {
            this.recordAlert('warning', 'High Memory Usage', 
                `Memory usage at ${currentMetrics.memory.usedPercent.toFixed(2)}%`);
        }

        if (currentMetrics.cpu?.loadAvg[0] > this.alertThresholds.system.cpu) {
            this.recordAlert('warning', 'High CPU Usage', 
                `CPU load at ${currentMetrics.cpu.loadAvg[0].toFixed(2)}%`);
        }

        // EyeNet specific alerts
        if (eyeNetMetrics.securityIncidents?.critical > 0) {
            this.recordAlert('critical', 'Critical Security Incident', 
                `${eyeNetMetrics.securityIncidents.critical} critical security incidents detected`);
        }

        if (eyeNetMetrics.analyticsJobs?.failed > 0) {
            this.recordAlert('error', 'Failed Analytics Jobs', 
                `${eyeNetMetrics.analyticsJobs.failed} analytics jobs failed`);
        }
    }

    async recordAlert(level, title, message) {
        const alert = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            level,
            title,
            message,
            acknowledged: false
        };

        this.metrics.alerts.unshift(alert);
        // Keep only last 100 alerts
        if (this.metrics.alerts.length > 100) {
            this.metrics.alerts.pop();
        }

        this.emit('alert', alert);

        // Send email notification if enabled and severity meets threshold
        if (this.shouldSendNotification(level)) {
            await notificationService.sendAlertEmail(alert, this.metrics);
        }
    }

    shouldSendNotification(level) {
        if (!this.notificationSettings.email.enabled) return false;

        const severityLevels = {
            info: 0,
            warning: 1,
            error: 2,
            critical: 3
        };

        const alertSeverity = severityLevels[level] || 0;
        const minSeverity = severityLevels[this.notificationSettings.email.minSeverity] || 0;

        return alertSeverity >= minSeverity;
    }

    async updateNotificationSettings(settings) {
        this.notificationSettings = {
            ...this.notificationSettings,
            ...settings
        };

        // Test email configuration if email notifications are enabled
        if (settings.email?.enabled) {
            try {
                await notificationService.testEmailConfiguration();
            } catch (error) {
                throw new Error(`Failed to validate email configuration: ${error.message}`);
            }
        }
    }

    collectSystemMetrics() {
        const systemMetrics = {
            timestamp: Date.now(),
            cpu: {
                loadAvg: os.loadavg(),
                utilization: os.cpus().map(cpu => {
                    const total = Object.values(cpu.times).reduce((a, b) => a + b);
                    const idle = cpu.times.idle;
                    return ((total - idle) / total) * 100;
                })
            },
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),
                usedPercent: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
            },
            uptime: os.uptime(),
            network: this.getNetworkStats()
        };

        this.metrics.system = systemMetrics;
        this.history.cpu.push({
            timestamp: systemMetrics.timestamp,
            value: systemMetrics.cpu.loadAvg[0]
        });
        this.history.memory.push({
            timestamp: systemMetrics.timestamp,
            value: systemMetrics.memory.usedPercent
        });

        this.emit('metrics:update', this.metrics);
    }

    getNetworkStats() {
        const networkInterfaces = os.networkInterfaces();
        return Object.entries(networkInterfaces).reduce((acc, [name, interfaces]) => {
            acc[name] = interfaces.map(int => ({
                address: int.address,
                netmask: int.netmask,
                family: int.family,
                mac: int.mac,
                internal: int.internal
            }));
            return acc;
        }, {});
    }

    recordAPIMetric(method, path, duration, statusCode) {
        const key = `${method}:${path}`;
        if (!this.metrics.api[key]) {
            this.metrics.api[key] = {
                count: 0,
                totalDuration: 0,
                errors: 0,
                lastStatus: statusCode
            };
        }

        this.metrics.api[key].count++;
        this.metrics.api[key].totalDuration += duration;
        if (statusCode >= 400) {
            this.metrics.api[key].errors++;
        }
        this.metrics.api[key].lastStatus = statusCode;

        this.history.requests.push({
            timestamp: Date.now(),
            path: key,
            duration,
            statusCode
        });
    }

    recordWebSocketMetric(event, connectionCount) {
        this.metrics.websocket = {
            timestamp: Date.now(),
            connections: connectionCount,
            lastEvent: event
        };
    }

    recordDatabaseMetric(operation, collection, duration) {
        const key = `${operation}:${collection}`;
        if (!this.metrics.database[key]) {
            this.metrics.database[key] = {
                count: 0,
                totalDuration: 0,
                avgDuration: 0
            };
        }

        this.metrics.database[key].count++;
        this.metrics.database[key].totalDuration += duration;
        this.metrics.database[key].avgDuration = 
            this.metrics.database[key].totalDuration / this.metrics.database[key].count;
    }

    cleanHistory() {
        const oneHourAgo = Date.now() - 3600000;
        ['cpu', 'memory', 'requests', 'errors', 'departments', 'analytics'].forEach(metric => {
            this.history[metric] = this.history[metric].filter(
                item => item.timestamp > oneHourAgo
            );
        });
    }

    getMetrics() {
        return {
            current: this.metrics,
            history: this.history
        };
    }

    getSystemHealth() {
        const metrics = this.metrics.system;
        return {
            status: this.calculateHealthStatus(metrics),
            metrics: {
                cpu: metrics.cpu.loadAvg[0],
                memory: metrics.memory.usedPercent,
                uptime: metrics.uptime
            }
        };
    }

    calculateHealthStatus(metrics) {
        if (metrics.memory.usedPercent > 90 || metrics.cpu.loadAvg[0] > 80) {
            return 'critical';
        }
        if (metrics.memory.usedPercent > 70 || metrics.cpu.loadAvg[0] > 60) {
            return 'warning';
        }
        return 'healthy';
    }

    updateHistory(metric, data) {
        if (!this.history[metric]) {
            this.history[metric] = [];
        }

        this.history[metric].push({
            timestamp: data.timestamp,
            value: data
        });
    }
}

module.exports = new MonitoringService();

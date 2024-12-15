const { EventEmitter } = require('events');
const NotificationHistory = require('../models/notificationHistory');

class NotificationBatchService extends EventEmitter {
    constructor() {
        super();
        this.batches = new Map();
        this.batchConfig = {
            maxBatchSize: parseInt(process.env.NOTIFICATION_MAX_BATCH_SIZE) || 10,
            batchTimeWindow: parseInt(process.env.NOTIFICATION_BATCH_WINDOW) || 300000, // 5 minutes
            minBatchInterval: parseInt(process.env.NOTIFICATION_MIN_INTERVAL) || 60000, // 1 minute
            maxRetries: parseInt(process.env.NOTIFICATION_MAX_RETRIES) || 3
        };
        this.initializeBatching();
    }

    initializeBatching() {
        // Process batches periodically
        setInterval(() => this.processBatches(), this.batchConfig.minBatchInterval);
    }

    async addToBatch(type, notification) {
        const batchKey = this.getBatchKey(type, notification);
        
        if (!this.batches.has(batchKey)) {
            this.batches.set(batchKey, {
                notifications: [],
                lastProcessed: 0,
                retryCount: 0
            });
        }

        const batch = this.batches.get(batchKey);
        batch.notifications.push(notification);

        // Process immediately if batch is full
        if (batch.notifications.length >= this.batchConfig.maxBatchSize) {
            await this.processBatch(batchKey);
        }
    }

    getBatchKey(type, notification) {
        // Group by type and recipient for emails, or by webhook URL for Discord
        if (type === 'email') {
            return `email:${notification.recipients.sort().join(',')}`;
        } else if (type === 'discord') {
            return `discord:${notification.webhookUrl}`;
        }
        return `${type}:default`;
    }

    async processBatches() {
        const now = Date.now();
        const promises = [];

        for (const [key, batch] of this.batches.entries()) {
            if (this.shouldProcessBatch(batch, now)) {
                promises.push(this.processBatch(key));
            }
        }

        await Promise.allSettled(promises);
    }

    shouldProcessBatch(batch, now) {
        return (
            batch.notifications.length > 0 &&
            (now - batch.lastProcessed >= this.batchConfig.batchTimeWindow ||
             batch.notifications.length >= this.batchConfig.maxBatchSize)
        );
    }

    async processBatch(batchKey) {
        const batch = this.batches.get(batchKey);
        if (!batch || batch.notifications.length === 0) return;

        try {
            const [type] = batchKey.split(':');
            const notifications = [...batch.notifications];
            
            // Clear batch before processing to prevent duplicates
            batch.notifications = [];
            batch.lastProcessed = Date.now();

            await this.sendBatchedNotifications(type, notifications);
            
            // Log successful batch
            await this.logBatchSuccess(type, notifications);
        } catch (error) {
            console.error(`Failed to process batch ${batchKey}:`, error);
            
            // Handle retry logic
            if (batch.retryCount < this.batchConfig.maxRetries) {
                batch.retryCount++;
                // Put notifications back in batch
                batch.notifications.unshift(...batch.notifications);
            } else {
                // Log failed notifications
                await this.logBatchFailure(batchKey, batch.notifications, error);
                // Clear failed batch
                this.batches.delete(batchKey);
            }
        }
    }

    async sendBatchedNotifications(type, notifications) {
        if (type === 'email') {
            await this.sendBatchedEmails(notifications);
        } else if (type === 'discord') {
            await this.sendBatchedDiscordMessages(notifications);
        }
    }

    async sendBatchedEmails(notifications) {
        // Group notifications by template
        const templateGroups = new Map();
        notifications.forEach(notification => {
            const key = notification.template.name;
            if (!templateGroups.has(key)) {
                templateGroups.set(key, []);
            }
            templateGroups.get(key).push(notification);
        });

        // Send one email per template group
        for (const [template, groupNotifications] of templateGroups) {
            const combinedMetrics = this.combineMetrics(groupNotifications);
            await this.emit('sendEmail', {
                template,
                notifications: groupNotifications,
                metrics: combinedMetrics
            });
        }
    }

    async sendBatchedDiscordMessages(notifications) {
        // Group by severity for better visualization
        const severityGroups = new Map();
        notifications.forEach(notification => {
            const key = notification.severity;
            if (!severityGroups.has(key)) {
                severityGroups.set(key, []);
            }
            severityGroups.get(key).push(notification);
        });

        // Send one message per severity group
        for (const [severity, groupNotifications] of severityGroups) {
            const combinedMetrics = this.combineMetrics(groupNotifications);
            await this.emit('sendDiscord', {
                severity,
                notifications: groupNotifications,
                metrics: combinedMetrics
            });
        }
    }

    combineMetrics(notifications) {
        // Combine metrics from multiple notifications
        const combined = {
            system: {},
            api: {},
            eyenet: {},
            summary: {
                totalAlerts: notifications.length,
                severityCounts: {}
            }
        };

        notifications.forEach(notification => {
            // Count severities
            const severity = notification.severity || 'info';
            combined.summary.severityCounts[severity] = 
                (combined.summary.severityCounts[severity] || 0) + 1;

            // Combine metrics using max values for critical metrics
            if (notification.metrics) {
                this.updateMaxMetrics(combined, notification.metrics);
            }
        });

        return combined;
    }

    updateMaxMetrics(combined, metrics) {
        // Update system metrics
        if (metrics.system) {
            combined.system.cpu = combined.system.cpu || {};
            combined.system.cpu.loadAvg = [
                Math.max(combined.system.cpu.loadAvg?.[0] || 0, metrics.system.cpu.loadAvg[0]),
                Math.max(combined.system.cpu.loadAvg?.[1] || 0, metrics.system.cpu.loadAvg[1]),
                Math.max(combined.system.cpu.loadAvg?.[2] || 0, metrics.system.cpu.loadAvg[2])
            ];
        }

        // Update API metrics
        if (metrics.api) {
            combined.api.errorRate = Math.max(combined.api.errorRate || 0, metrics.api.errorRate);
            combined.api.avgResponseTime = Math.max(
                combined.api.avgResponseTime || 0,
                metrics.api.avgResponseTime
            );
        }

        // Update EyeNet metrics
        if (metrics.eyenet) {
            combined.eyenet.modelPerformance = combined.eyenet.modelPerformance || {};
            combined.eyenet.modelPerformance.latency = Math.max(
                combined.eyenet.modelPerformance?.latency || 0,
                metrics.eyenet.modelPerformance.latency
            );
        }
    }

    async logBatchSuccess(type, notifications) {
        await NotificationHistory.create({
            type: 'batch',
            status: 'success',
            batchSize: notifications.length,
            notificationType: type,
            timestamp: new Date()
        });
    }

    async logBatchFailure(batchKey, notifications, error) {
        await NotificationHistory.create({
            type: 'batch',
            status: 'failure',
            batchSize: notifications.length,
            batchKey,
            error: error.message,
            timestamp: new Date()
        });
    }
}

module.exports = new NotificationBatchService();

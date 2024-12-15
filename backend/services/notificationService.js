const nodemailer = require('nodemailer');
const User = require('../models/user');
const NotificationHistory = require('../models/notificationHistory');
const schedules = require('../config/notificationSchedules');
const axios = require('axios');
const cron = require('node-cron');

class NotificationService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
        this.schedules = new Map();
        this.initializeServices();
    }

    async initializeServices() {
        this.initializeEmailTransport();
        await this.initializeSchedules();
    }

    initializeEmailTransport() {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize email transport:', error);
            this.initialized = false;
        }
    }

    async getAdminEmails() {
        try {
            const admins = await User.find({ role: 'admin', emailNotifications: true });
            return admins.map(admin => admin.email);
        } catch (error) {
            console.error('Failed to fetch admin emails:', error);
            return [];
        }
    }

    async sendAlertEmail(alert, metrics) {
        if (!this.initialized) {
            console.error('Email transport not initialized');
            return;
        }

        try {
            const adminEmails = await this.getAdminEmails();
            if (adminEmails.length === 0) {
                console.log('No admin emails configured for notifications');
                return;
            }

            const emailContent = this.generateEmailContent(alert, metrics);
            
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: adminEmails.join(','),
                subject: `EyeNet Alert: ${alert.level.toUpperCase()} - ${alert.title}`,
                html: emailContent
            });

            console.log(`Alert email sent to ${adminEmails.length} administrators`);
        } catch (error) {
            console.error('Failed to send alert email:', error);
        }
    }

    generateEmailContent(alert, metrics) {
        const severityColor = {
            critical: '#ff0000',
            error: '#ff4444',
            warning: '#ffbb33',
            info: '#33b5e5'
        };

        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                    EyeNet Monitoring Alert
                </h2>
                
                <div style="background-color: ${severityColor[alert.level]}; color: white; padding: 10px; border-radius: 5px; margin: 15px 0;">
                    <strong>Alert Level:</strong> ${alert.level.toUpperCase()}
                </div>

                <div style="margin: 20px 0;">
                    <h3 style="color: #444;">${alert.title}</h3>
                    <p style="color: #666;">${alert.message}</p>
                    <p style="color: #888; font-size: 0.9em;">
                        Timestamp: ${new Date(alert.timestamp).toLocaleString()}
                    </p>
                </div>

                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h4 style="color: #444; margin-top: 0;">System Metrics at Time of Alert:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${this.formatMetrics(metrics)}
                    </ul>
                </div>

                <div style="margin: 20px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
                    <p style="margin: 0; color: #666;">
                        View complete details in the 
                        <a href="${process.env.FRONTEND_URL}/monitoring" style="color: #0066cc;">
                            Monitoring Dashboard
                        </a>
                    </p>
                </div>

                <div style="font-size: 0.8em; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                    <p>This is an automated message from EyeNet Monitoring System.</p>
                    <p>To configure notification settings, visit your profile settings in the EyeNet dashboard.</p>
                </div>
            </div>
        `;
    }

    formatMetrics(metrics) {
        let formattedMetrics = '';

        if (metrics.system) {
            formattedMetrics += `
                <li style="margin: 5px 0;">
                    <strong>CPU Usage:</strong> ${metrics.system.cpu.loadAvg[0].toFixed(2)}%
                </li>
                <li style="margin: 5px 0;">
                    <strong>Memory Usage:</strong> ${metrics.system.memory.usedPercent.toFixed(2)}%
                </li>
            `;
        }

        if (metrics.eyenet) {
            formattedMetrics += `
                <li style="margin: 5px 0;">
                    <strong>Active Departments:</strong> ${metrics.eyenet.activeDepartments.active}
                </li>
                <li style="margin: 5px 0;">
                    <strong>Analytics Jobs:</strong> 
                    Running: ${metrics.eyenet.analyticsJobs.running}, 
                    Queued: ${metrics.eyenet.analyticsJobs.queued}
                </li>
            `;

            if (metrics.eyenet.modelPerformance) {
                formattedMetrics += `
                    <li style="margin: 5px 0;">
                        <strong>Model Performance:</strong>
                        Accuracy: ${(metrics.eyenet.modelPerformance.accuracy * 100).toFixed(2)}%,
                        Latency: ${metrics.eyenet.modelPerformance.latency.avg}ms
                    </li>
                `;
            }
        }

        return formattedMetrics;
    }

    async sendDiscordAlert(alert, metrics) {
        if (!process.env.DISCORD_WEBHOOK_URL) {
            console.log('Discord webhook URL not configured');
            return;
        }

        const severityColors = {
            info: 0x3498db,
            warning: 0xf1c40f,
            error: 0xe74c3c,
            critical: 0xff0000
        };

        try {
            const embed = {
                title: `🚨 EyeNet Alert: ${alert.title}`,
                color: severityColors[alert.level] || 0x7289da,
                description: alert.message,
                fields: [
                    {
                        name: '📊 Severity Level',
                        value: alert.level.toUpperCase(),
                        inline: true
                    },
                    {
                        name: '⏰ Timestamp',
                        value: new Date(alert.timestamp).toLocaleString(),
                        inline: true
                    }
                ],
                footer: {
                    text: 'EyeNet Monitoring System'
                }
            };

            // Add system metrics
            if (metrics.system) {
                embed.fields.push({
                    name: '💻 System Metrics',
                    value: `CPU: ${metrics.system.cpu.loadAvg[0].toFixed(2)}%\nMemory: ${metrics.system.memory.usedPercent.toFixed(2)}%`,
                    inline: false
                });
            }

            // Add EyeNet metrics
            if (metrics.eyenet) {
                embed.fields.push({
                    name: '👁 EyeNet Metrics',
                    value: `Active Depts: ${metrics.eyenet.activeDepartments.active}\nAnalytics Jobs: ${metrics.eyenet.analyticsJobs.running} running, ${metrics.eyenet.analyticsJobs.queued} queued`,
                    inline: false
                });
            }

            await axios.post(process.env.DISCORD_WEBHOOK_URL, { embeds: [embed] });
            console.log('Discord notification sent successfully');
        } catch (error) {
            console.error('Failed to send Discord notification:', error);
        }
    }

    async initializeSchedules() {
        try {
            // Load schedules from database or config
            const schedules = await this.loadSchedules();
            schedules.forEach(schedule => this.addSchedule(schedule));
        } catch (error) {
            console.error('Failed to initialize schedules:', error);
        }
    }

    async loadSchedules() {
        return schedules;
    }

    addSchedule(schedule) {
        const { id, cronExpression, type, recipients, template, conditions } = schedule;
        
        if (this.schedules.has(id)) {
            this.schedules.get(id).task.destroy();
        }

        const task = cron.schedule(cronExpression, async () => {
            try {
                const metrics = await this.getMetricsSnapshot();
                if (this.checkConditions(metrics, conditions)) {
                    await this.sendScheduledNotification(type, recipients, template, metrics);
                }
            } catch (error) {
                console.error(`Failed to process scheduled notification ${id}:`, error);
            }
        });

        this.schedules.set(id, { schedule, task });
    }

    async sendScheduledNotification(type, recipients, template, metrics) {
        switch (type) {
            case 'email':
                await this.sendScheduledEmail(recipients, template, metrics);
                break;
            case 'discord':
                await this.sendScheduledDiscord(template, metrics);
                break;
            default:
                console.error(`Unknown notification type: ${type}`);
        }
    }

    async sendScheduledEmail(recipients, template, metrics) {
        const emailContent = await this.renderEmailTemplate(template, metrics);
        
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: recipients.join(','),
            subject: `EyeNet ${template.name} Report`,
            html: emailContent
        });
    }

    async renderEmailTemplate(template, metrics) {
        const templates = {
            daily_summary: this.getDailySummaryTemplate,
            performance_report: this.getPerformanceReportTemplate,
            security_audit: this.getSecurityAuditTemplate,
            system_health: this.getSystemHealthTemplate
        };

        const templateFunction = templates[template.name];
        if (!templateFunction) {
            throw new Error(`Unknown email template: ${template.name}`);
        }

        return templateFunction.call(this, metrics);
    }

    getDailySummaryTemplate(metrics) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center;">EyeNet Daily Summary</h1>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #34495e;">System Overview</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h3>Resource Usage</h3>
                            <ul>
                                <li>CPU: ${metrics.system.cpu.loadAvg[0].toFixed(2)}%</li>
                                <li>Memory: ${metrics.system.memory.usedPercent.toFixed(2)}%</li>
                                <li>Storage: ${metrics.system.disk.usedPercent}%</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Network Stats</h3>
                            <ul>
                                <li>Total Requests: ${metrics.api.totalRequests}</li>
                                <li>Error Rate: ${metrics.api.errorRate.toFixed(2)}%</li>
                                <li>Avg Response Time: ${metrics.api.avgResponseTime}ms</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #2e7d32;">EyeNet Analytics</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h3>Department Activity</h3>
                            <ul>
                                <li>Active Departments: ${metrics.eyenet.activeDepartments.active}</li>
                                <li>Total Users: ${metrics.eyenet.activeDepartments.totalUsers}</li>
                                <li>Active Sessions: ${metrics.eyenet.activeDepartments.sessions}</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Model Performance</h3>
                            <ul>
                                <li>Accuracy: ${(metrics.eyenet.modelPerformance.accuracy * 100).toFixed(2)}%</li>
                                <li>Avg Latency: ${metrics.eyenet.modelPerformance.latency.avg}ms</li>
                                <li>Success Rate: ${(metrics.eyenet.modelPerformance.successRate * 100).toFixed(2)}%</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}/monitoring" 
                       style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        View Full Dashboard
                    </a>
                </div>
            </div>
        `;
    }

    getPerformanceReportTemplate(metrics) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center;">EyeNet Performance Report</h1>
                
                <div style="background: #f1f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #0366d6;">Model Performance Metrics</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h3>Accuracy Metrics</h3>
                            <ul>
                                <li>Overall Accuracy: ${(metrics.eyenet.modelPerformance.accuracy * 100).toFixed(2)}%</li>
                                <li>Precision: ${(metrics.eyenet.modelPerformance.precision * 100).toFixed(2)}%</li>
                                <li>Recall: ${(metrics.eyenet.modelPerformance.recall * 100).toFixed(2)}%</li>
                                <li>F1 Score: ${(metrics.eyenet.modelPerformance.f1Score * 100).toFixed(2)}%</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Performance Metrics</h3>
                            <ul>
                                <li>Average Latency: ${metrics.eyenet.modelPerformance.latency.avg}ms</li>
                                <li>95th Percentile: ${metrics.eyenet.modelPerformance.latency.p95}ms</li>
                                <li>Success Rate: ${(metrics.eyenet.modelPerformance.successRate * 100).toFixed(2)}%</li>
                                <li>Error Rate: ${(metrics.eyenet.modelPerformance.errorRate * 100).toFixed(2)}%</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: #f6f8fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #24292e;">Resource Utilization</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h3>GPU Metrics</h3>
                            <ul>
                                <li>GPU Usage: ${metrics.eyenet.resources.gpu.usage}%</li>
                                <li>GPU Memory: ${metrics.eyenet.resources.gpu.memory}%</li>
                                <li>Active Models: ${metrics.eyenet.resources.gpu.activeModels}</li>
                            </ul>
                        </div>
                        <div>
                            <h3>System Resources</h3>
                            <ul>
                                <li>CPU Usage: ${metrics.system.cpu.loadAvg[0].toFixed(2)}%</li>
                                <li>Memory Usage: ${metrics.system.memory.usedPercent.toFixed(2)}%</li>
                                <li>Storage Usage: ${metrics.system.disk.usedPercent}%</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #24292e;">API Performance</h2>
                    <ul>
                        <li>Total Requests: ${metrics.api.totalRequests}</li>
                        <li>Average Response Time: ${metrics.api.avgResponseTime}ms</li>
                        <li>Error Rate: ${(metrics.api.errorRate * 100).toFixed(2)}%</li>
                        <li>Success Rate: ${(100 - metrics.api.errorRate * 100).toFixed(2)}%</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getSecurityAuditTemplate(metrics) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center;">EyeNet Security Audit Report</h1>
                
                <div style="background: #fff3f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #e74c3c;">Security Incidents</h2>
                    <ul>
                        <li>Total Incidents: ${metrics.eyenet.security.incidentCount}</li>
                        <li>Critical Incidents: ${metrics.eyenet.security.criticalIncidents}</li>
                        <li>Resolved Incidents: ${metrics.eyenet.security.resolvedIncidents}</li>
                        <li>Average Resolution Time: ${metrics.eyenet.security.avgResolutionTime}h</li>
                    </ul>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #24292e;">Access Metrics</h2>
                    <ul>
                        <li>Failed Login Attempts: ${metrics.eyenet.security.failedLogins}</li>
                        <li>Successful Logins: ${metrics.eyenet.security.successfulLogins}</li>
                        <li>Password Resets: ${metrics.eyenet.security.passwordResets}</li>
                        <li>API Authentication Failures: ${metrics.eyenet.security.apiAuthFailures}</li>
                    </ul>
                </div>

                <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #22863a;">System Security</h2>
                    <ul>
                        <li>SSL Certificate Valid: ${metrics.eyenet.security.sslValid ? 'Yes' : 'No'}</li>
                        <li>Days Until SSL Expiry: ${metrics.eyenet.security.sslDaysRemaining}</li>
                        <li>Firewall Status: ${metrics.eyenet.security.firewallStatus}</li>
                        <li>Last Security Update: ${new Date(metrics.eyenet.security.lastUpdateTime).toLocaleString()}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getSystemHealthTemplate(metrics) {
        const getHealthStatus = (value, threshold) => {
            return value > threshold ? '🔴 Critical' : value > threshold * 0.8 ? '🟡 Warning' : '🟢 Good';
        };

        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center;">EyeNet System Health Report</h1>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #24292e;">System Resources</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h3>CPU Usage</h3>
                            <p>Status: ${getHealthStatus(metrics.system.cpu.loadAvg[0], 80)}</p>
                            <ul>
                                <li>Current: ${metrics.system.cpu.loadAvg[0].toFixed(2)}%</li>
                                <li>Average (5m): ${metrics.system.cpu.loadAvg[1].toFixed(2)}%</li>
                                <li>Average (15m): ${metrics.system.cpu.loadAvg[2].toFixed(2)}%</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Memory Usage</h3>
                            <p>Status: ${getHealthStatus(metrics.system.memory.usedPercent, 90)}</p>
                            <ul>
                                <li>Used: ${metrics.system.memory.usedPercent.toFixed(2)}%</li>
                                <li>Available: ${(100 - metrics.system.memory.usedPercent).toFixed(2)}%</li>
                                <li>Swap Used: ${metrics.system.memory.swapUsed.toFixed(2)}%</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: #f1f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #0366d6;">Network Health</h2>
                    <ul>
                        <li>Network Latency: ${metrics.network.latency}ms</li>
                        <li>Packet Loss: ${metrics.network.packetLoss}%</li>
                        <li>Bandwidth Usage: ${metrics.network.bandwidthUsage}%</li>
                        <li>Active Connections: ${metrics.network.activeConnections}</li>
                    </ul>
                </div>

                <div style="background: #fff5cc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #b08800;">Service Health</h2>
                    <ul>
                        <li>API Status: ${metrics.api.status}</li>
                        <li>Database Status: ${metrics.database.status}</li>
                        <li>Cache Status: ${metrics.cache.status}</li>
                        <li>Queue Status: ${metrics.queue.status}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    async logNotification(type, template, recipients, status, error = null, metrics = null, conditions = null) {
        try {
            await NotificationHistory.create({
                type,
                template,
                recipients,
                status,
                error,
                metrics,
                conditions: conditions?.map(c => ({
                    ...c,
                    actualValue: this.getMetricValue(metrics, c.metric)
                }))
            });
        } catch (err) {
            console.error('Failed to log notification:', err);
        }
    }

    async getNotificationAnalytics(startDate, endDate) {
        const pipeline = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        type: '$type',
                        status: '$status',
                        template: '$template'
                    },
                    count: { $sum: 1 },
                    avgMetrics: {
                        $avg: {
                            $cond: [
                                { $eq: ['$type', 'email'] },
                                '$metrics.system.cpu.loadAvg.0',
                                0
                            ]
                        }
                    }
                }
            }
        ];

        return await NotificationHistory.aggregate(pipeline);
    }

    checkConditions(metrics, conditions) {
        if (!conditions) return true;

        return conditions.every(condition => {
            const value = this.getMetricValue(metrics, condition.metric);
            switch (condition.operator) {
                case '>': return value > condition.value;
                case '<': return value < condition.value;
                case '>=': return value >= condition.value;
                case '<=': return value <= condition.value;
                case '==': return value === condition.value;
                default: return false;
            }
        });
    }

    getMetricValue(metrics, path) {
        return path.split('.').reduce((obj, key) => obj?.[key], metrics);
    }

    async testEmailConfiguration() {
        if (!this.initialized) {
            throw new Error('Email transport not initialized');
        }

        try {
            const adminEmails = await this.getAdminEmails();
            if (adminEmails.length === 0) {
                throw new Error('No admin emails configured');
            }

            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: adminEmails.join(','),
                subject: 'EyeNet Monitoring - Email Configuration Test',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>EyeNet Monitoring System</h2>
                        <p>This is a test email to confirm your email notification settings are working correctly.</p>
                        <p>If you received this email, your notification system is properly configured.</p>
                    </div>
                `
            });

            return { success: true, message: 'Test email sent successfully' };
        } catch (error) {
            throw new Error(`Email test failed: ${error.message}`);
        }
    }
}

module.exports = new NotificationService();

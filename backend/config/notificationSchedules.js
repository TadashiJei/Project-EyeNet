const schedules = [
    {
        id: 'daily-summary',
        cronExpression: process.env.DAILY_SUMMARY_SCHEDULE || '0 9 * * *',
        type: 'email',
        recipients: ['admin@example.com'], // Replace with actual admin emails
        template: {
            name: 'daily_summary'
        },
        conditions: [
            {
                metric: 'system.cpu.loadAvg.0',
                operator: '>',
                value: 80
            }
        ]
    },
    {
        id: 'weekly-performance',
        cronExpression: process.env.PERFORMANCE_REPORT_SCHEDULE || '0 0 * * 1',
        type: 'email',
        recipients: ['admin@example.com'],
        template: {
            name: 'performance_report'
        }
    },
    {
        id: 'security-audit',
        cronExpression: process.env.SECURITY_AUDIT_SCHEDULE || '0 1 * * *',
        type: 'email',
        recipients: ['security@example.com'],
        template: {
            name: 'security_audit'
        },
        conditions: [
            {
                metric: 'eyenet.security.incidentCount',
                operator: '>',
                value: 0
            }
        ]
    },
    {
        id: 'resource-alert',
        cronExpression: '*/15 * * * *', // Every 15 minutes
        type: 'discord',
        template: {
            name: 'resource_alert'
        },
        conditions: [
            {
                metric: 'system.memory.usedPercent',
                operator: '>',
                value: 90
            },
            {
                metric: 'system.disk.usedPercent',
                operator: '>',
                value: 85
            }
        ]
    }
];

module.exports = schedules;

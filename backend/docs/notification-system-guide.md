# EyeNet Notification System Guide

## Overview
The EyeNet Notification System provides comprehensive monitoring alerts and scheduled reports through multiple channels (email and Discord). This guide covers the system's features, implementation details, and common use cases.

## Table of Contents
- [Features](#features)
- [Setup Guide](#setup-guide)
- [Use Cases](#use-cases)
- [Implementation Guide](#implementation-guide)
- [Templates](#templates)
- [Analytics](#analytics)
- [Notification Batching and Throttling](#notification-batching-and-throttling)
- [Scaling the Notification System](#scaling-the-notification-system)
- [Advanced Troubleshooting Guide](#advanced-troubleshooting-guide)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Environment Configuration Guide](#environment-configuration-guide)

## Features

### Notification Channels
- **Email Notifications**
  - Real-time alerts
  - Scheduled reports
  - Rich HTML templates
  - Conditional triggering
  
- **Discord Integration**
  - Real-time alerts
  - Rich embeds with metrics
  - Severity-based color coding
  - Custom webhook support

### Scheduling System
- Cron-based scheduling
- Conditional execution
- Multiple report types
- Customizable frequencies

### Templates
1. **Daily Summary**
   - System overview
   - Key performance metrics
   - Resource utilization
   - Department activity

2. **Performance Report**
   - Model accuracy metrics
   - Latency statistics
   - Resource utilization
   - API performance

3. **Security Audit**
   - Security incidents
   - Access metrics
   - SSL status
   - System security

4. **System Health**
   - Resource usage
   - Network health
   - Service status
   - Health indicators

## Setup Guide

### 1. Environment Configuration
```env
# Email Settings
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_MIN_SEVERITY=warning
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Discord Settings
DISCORD_WEBHOOK_URL=your-webhook-url
DISCORD_MIN_SEVERITY=warning

# Schedule Settings
DAILY_SUMMARY_SCHEDULE="0 9 * * *"
PERFORMANCE_REPORT_SCHEDULE="0 0 * * 1"
```

### 2. Schedule Configuration
```javascript
// notificationSchedules.js
const schedules = [
  {
    id: 'daily-summary',
    cronExpression: '0 9 * * *',
    type: 'email',
    recipients: ['admin@example.com'],
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
  }
];
```

## Use Cases

### 1. System Monitoring
```javascript
// Monitor high CPU usage
{
  id: 'cpu-alert',
  cronExpression: '*/5 * * * *',
  type: 'discord',
  template: {
    name: 'system_alert'
  },
  conditions: [
    {
      metric: 'system.cpu.loadAvg.0',
      operator: '>',
      value: 90
    }
  ]
}
```

### 2. Security Monitoring
```javascript
// Monitor failed login attempts
{
  id: 'security-alert',
  cronExpression: '*/10 * * * *',
  type: 'email',
  recipients: ['security@example.com'],
  template: {
    name: 'security_alert'
  },
  conditions: [
    {
      metric: 'eyenet.security.failedLogins',
      operator: '>',
      value: 10
    }
  ]
}
```

### 3. Performance Monitoring
```javascript
// Monitor model performance
{
  id: 'model-performance',
  cronExpression: '0 * * * *',
  type: 'email',
  template: {
    name: 'performance_alert'
  },
  conditions: [
    {
      metric: 'eyenet.modelPerformance.accuracy',
      operator: '<',
      value: 0.95
    }
  ]
}
```

## Implementation Guide

### Adding New Templates

1. Create template function in `notificationService.js`:
```javascript
getCustomTemplate(metrics) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h1>Custom Report</h1>
      <div>
        <h2>Metrics</h2>
        <ul>
          <li>Metric 1: ${metrics.custom.metric1}</li>
          <li>Metric 2: ${metrics.custom.metric2}</li>
        </ul>
      </div>
    </div>
  `;
}
```

2. Register template:
```javascript
async renderEmailTemplate(template, metrics) {
  const templates = {
    custom_template: this.getCustomTemplate,
    // ... other templates
  };
}
```

### Adding New Notification Channels

1. Create channel handler:
```javascript
async sendSlackAlert(alert, metrics) {
  // Implement Slack notification logic
}
```

2. Update notification service:
```javascript
async sendNotification(type, alert, metrics) {
  switch(type) {
    case 'slack':
      await this.sendSlackAlert(alert, metrics);
      break;
    // ... other channels
  }
}
```

## Analytics

### Viewing Notification History
```javascript
// Get notification analytics for date range
const analytics = await notificationService.getNotificationAnalytics(
  '2024-01-01',
  '2024-12-31'
);
```

### Available Metrics
- Notification success/failure rates
- Template usage statistics
- Condition trigger frequency
- Channel performance
- Response times

### Example Analytics Query
```javascript
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
        status: '$status'
      },
      count: { $sum: 1 }
    }
  }
];
```

## Notification Batching and Throttling

### Batch Configuration
```env
# Batching Settings
NOTIFICATION_MAX_BATCH_SIZE=10
NOTIFICATION_BATCH_WINDOW=300000
NOTIFICATION_MIN_INTERVAL=60000
NOTIFICATION_MAX_RETRIES=3
```

### How Batching Works
1. **Collection Phase**
   ```javascript
   // Add notification to batch
   await notificationBatchService.addToBatch('email', {
     recipients: ['admin@example.com'],
     template: { name: 'alert' },
     metrics: currentMetrics
   });
   ```

2. **Processing Phase**
   ```javascript
   // Batch processing logic
   async processBatch(batchKey) {
     const batch = this.batches.get(batchKey);
     if (batch.notifications.length >= this.batchConfig.maxBatchSize) {
       await this.sendBatchedNotifications(type, batch.notifications);
       batch.notifications = [];
     }
   }
   ```

3. **Throttling**
   ```javascript
   shouldProcessBatch(batch, now) {
     return (
       batch.notifications.length > 0 &&
       (now - batch.lastProcessed >= this.batchConfig.batchTimeWindow ||
        batch.notifications.length >= this.batchConfig.maxBatchSize)
     );
   }
   ```

## Scaling the Notification System

### 1. Horizontal Scaling
```javascript
// Using Redis for distributed batching
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: 3
});

class DistributedBatchService {
  async addToBatch(type, notification) {
    const batchKey = `notifications:${type}`;
    await redis.lpush(batchKey, JSON.stringify(notification));
    
    // Process if batch is full
    const batchSize = await redis.llen(batchKey);
    if (batchSize >= this.maxBatchSize) {
      await this.processBatch(batchKey);
    }
  }
}
```

### 2. Load Balancing
```javascript
// Using PM2 for process management
module.exports = {
  apps: [{
    name: 'notification-service',
    script: 'notificationService.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 3. Caching
```javascript
// Cache template rendering
class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 300000; // 5 minutes
  }

  async getTemplate(name, metrics) {
    const key = `${name}:${JSON.stringify(metrics)}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const template = await this.renderTemplate(name, metrics);
    this.cache.set(key, template);
    return template;
  }
}
```

### 4. Queue Management
```javascript
// Using Bull for queue management
const Queue = require('bull');
const notificationQueue = new Queue('notifications', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Add to queue
await notificationQueue.add('email', {
  type: 'alert',
  recipients: ['admin@example.com'],
  data: alertData
}, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000
  }
});

// Process queue
notificationQueue.process('email', async (job) => {
  const { type, recipients, data } = job.data;
  await notificationService.sendEmail(recipients, type, data);
});
```

## Advanced Troubleshooting Guide

### 1. Performance Issues

#### Slow Email Delivery
```javascript
// Monitor email sending performance
const startTime = process.hrtime();
await transporter.sendMail(mailOptions);
const [seconds, nanoseconds] = process.hrtime(startTime);
const duration = seconds * 1000 + nanoseconds / 1e6;

if (duration > 5000) {
  console.warn(`Slow email delivery detected: ${duration}ms`);
  // Implement fallback or optimization
}
```

#### Memory Leaks
```javascript
// Monitor batch size
setInterval(() => {
  const totalNotifications = Array.from(this.batches.values())
    .reduce((sum, batch) => sum + batch.notifications.length, 0);
  
  if (totalNotifications > 10000) {
    console.error('Batch size exceeds limit');
    this.processBatchesImmediately();
  }
}, 60000);
```

### 2. Error Handling

#### Retry Logic
```javascript
async function sendWithRetry(notification, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sendNotification(notification);
      return;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

#### Circuit Breaker
```javascript
class NotificationCircuitBreaker {
  constructor() {
    this.failures = 0;
    this.lastFailure = null;
    this.threshold = 5;
    this.resetTimeout = 60000;
  }

  async execute(notification) {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }

    try {
      await sendNotification(notification);
      this.reset();
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  isOpen() {
    if (!this.lastFailure) return false;
    if (Date.now() - this.lastFailure > this.resetTimeout) {
      this.reset();
      return false;
    }
    return this.failures >= this.threshold;
  }
}
```

### 3. Monitoring and Debugging

#### Performance Metrics
```javascript
const metrics = {
  async collectMetrics() {
    return {
      batchSizes: Array.from(batches.values())
        .map(b => b.notifications.length),
      processingTimes: this.getProcessingTimes(),
      errorRates: await this.calculateErrorRates(),
      throughput: this.calculateThroughput()
    };
  }
};
```

#### Debug Logging
```javascript
const debug = require('debug')('eyenet:notifications');

function logNotificationEvent(event, data) {
  debug('%s: %o', event, {
    timestamp: new Date().toISOString(),
    ...data
  });
}
```

## Best Practices

1. **Template Design**
   - Use responsive HTML
   - Include relevant metrics
   - Clear visual hierarchy
   - Consistent styling

2. **Scheduling**
   - Use appropriate intervals
   - Consider time zones
   - Implement rate limiting
   - Handle failures gracefully

3. **Conditions**
   - Set appropriate thresholds
   - Use multiple conditions
   - Include buffer zones
   - Regular review and adjustment

4. **Security**
   - Secure SMTP credentials
   - Validate webhook URLs
   - Limit recipient access
   - Log all notifications

## Troubleshooting

### Common Issues
1. **Email Not Sending**
   - Check SMTP credentials
   - Verify recipient addresses
   - Check spam filters
   - Review error logs

2. **Discord Webhook Failures**
   - Validate webhook URL
   - Check rate limits
   - Verify payload format
   - Review Discord server settings

3. **Schedule Issues**
   - Verify cron expressions
   - Check timezone settings
   - Monitor system time
   - Review schedule logs

## Environment Configuration Guide

### Complete Environment Variables
```env
# Email Notification Settings
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_MIN_SEVERITY=warning  # Options: info, warning, error, critical

# SMTP Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_FROM=eyenet-monitoring@your-domain.com

# Discord Integration
DISCORD_WEBHOOK_URL=your-webhook-url
DISCORD_MIN_SEVERITY=warning

# Frontend and Backend URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://api.example.com

# Notification Batching Settings
NOTIFICATION_MAX_BATCH_SIZE=10        # Maximum notifications per batch
NOTIFICATION_BATCH_WINDOW=300000      # Batch window in milliseconds (5 minutes)
NOTIFICATION_MIN_INTERVAL=60000       # Minimum interval between batches (1 minute)
NOTIFICATION_MAX_RETRIES=3           # Maximum retry attempts for failed notifications
```

### Configuration Categories

1. **Email Settings**
   ```env
   ENABLE_EMAIL_NOTIFICATIONS=true
   EMAIL_MIN_SEVERITY=warning
   ```
   - `ENABLE_EMAIL_NOTIFICATIONS`: Toggle email notifications
   - `EMAIL_MIN_SEVERITY`: Minimum severity level for sending emails

2. **SMTP Configuration**
   ```env
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password
   SMTP_FROM=eyenet-monitoring@your-domain.com
   ```
   - Required for sending emails
   - Secure SMTP with TLS support
   - Use environment-specific credentials

3. **Discord Integration**
   ```env
   DISCORD_WEBHOOK_URL=your-webhook-url
   DISCORD_MIN_SEVERITY=warning
   ```
   - Webhook URL from Discord channel settings
   - Minimum severity for Discord notifications

4. **Notification Batching**
   ```env
   NOTIFICATION_MAX_BATCH_SIZE=10
   NOTIFICATION_BATCH_WINDOW=300000
   NOTIFICATION_MIN_INTERVAL=60000
   ```
   - Controls notification grouping and throttling
   - Prevents notification flooding
   - Optimizes delivery performance

### Configuration Best Practices

1. **Security**
   - Never commit sensitive values to version control
   - Use different credentials for each environment
   - Rotate credentials regularly
   - Use secure password generation

2. **Performance**
   - Adjust batch settings based on load:
     ```env
     # High-traffic settings
     NOTIFICATION_MAX_BATCH_SIZE=50
     NOTIFICATION_BATCH_WINDOW=60000
     
     # Low-traffic settings
     NOTIFICATION_MAX_BATCH_SIZE=5
     NOTIFICATION_BATCH_WINDOW=300000
     ```

3. **Monitoring**
   - Log configuration changes
   - Monitor notification performance
   - Alert on configuration issues

### Environment-Specific Configurations

1. **Development**
   ```env
   SMTP_HOST=smtp.mailtrap.io
   NOTIFICATION_MAX_BATCH_SIZE=2
   NOTIFICATION_BATCH_WINDOW=30000
   ```

2. **Staging**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   NOTIFICATION_MAX_BATCH_SIZE=5
   NOTIFICATION_BATCH_WINDOW=120000
   ```

3. **Production**
   ```env
   SMTP_HOST=smtp.production.com
   NOTIFICATION_MAX_BATCH_SIZE=10
   NOTIFICATION_BATCH_WINDOW=300000
   ```

### Validation and Testing

```javascript
// Configuration validation
function validateConfig() {
  const required = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'NOTIFICATION_MAX_BATCH_SIZE',
    'NOTIFICATION_BATCH_WINDOW'
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }

  // Validate numeric values
  const numeric = [
    'NOTIFICATION_MAX_BATCH_SIZE',
    'NOTIFICATION_BATCH_WINDOW',
    'NOTIFICATION_MIN_INTERVAL'
  ];

  numeric.forEach(key => {
    const value = parseInt(process.env[key]);
    if (isNaN(value)) {
      throw new Error(`Invalid numeric value for ${key}`);
    }
  });
}

// Test configuration
async function testConfiguration() {
  try {
    // Test email
    await notificationService.testEmailConfiguration();
    
    // Test Discord
    if (process.env.DISCORD_WEBHOOK_URL) {
      await notificationService.testDiscordWebhook();
    }
    
    // Test batching
    await notificationBatchService.testBatchProcessing();
    
    console.log('Configuration test successful');
  } catch (error) {
    console.error('Configuration test failed:', error);
    process.exit(1);
  }
}
```

### Troubleshooting Configuration Issues

1. **SMTP Connection Issues**
   ```javascript
   // Test SMTP connection
   async function testSMTP() {
     try {
       await transporter.verify();
       console.log('SMTP connection successful');
     } catch (error) {
       console.error('SMTP connection failed:', error);
       // Check firewall, credentials, and server status
     }
   }
   ```

2. **Discord Webhook Issues**
   ```javascript
   // Test Discord webhook
   async function testDiscord() {
     try {
       await axios.post(process.env.DISCORD_WEBHOOK_URL, {
         content: 'Test notification'
       });
       console.log('Discord webhook successful');
     } catch (error) {
       console.error('Discord webhook failed:', error);
       // Check webhook URL and server permissions
     }
   }
   ```

3. **Batch Configuration Issues**
   ```javascript
   // Monitor batch processing
   function monitorBatching() {
     setInterval(() => {
       const metrics = notificationBatchService.getMetrics();
       if (metrics.failureRate > 0.1) {
         console.warn('High batch failure rate detected');
         // Adjust batch settings or investigate issues
       }
     }, 60000);
   }
   ```

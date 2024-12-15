# Performance Testing Guide

## Load Testing Scenarios

### 1. Basic API Performance

#### Department List Endpoint
```yaml
# artillery/scenarios/department-list.yml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
  variables:
    token: "eyJhbGciOiJIUzI1..."

scenarios:
  - name: "List Departments"
    flow:
      - get:
          url: "/api/departments"
          headers:
            Authorization: "Bearer {{token}}"
      - think: 1
```

#### Analytics Dashboard Data
```yaml
# artillery/scenarios/analytics-dashboard.yml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 300
      arrivalRate: 20
      name: "Dashboard load"
  variables:
    token: "eyJhbGciOiJIUzI1..."

scenarios:
  - name: "Dashboard Data Load"
    flow:
      - get:
          url: "/api/departments"
          headers:
            Authorization: "Bearer {{token}}"
          capture:
            - json: "$.data.departments[0].id"
              as: "deptId"
      - get:
          url: "/api/analytics/department/{{deptId}}"
          headers:
            Authorization: "Bearer {{token}}"
      - get:
          url: "/api/advanced-analytics/department/{{deptId}}/realtime"
          headers:
            Authorization: "Bearer {{token}}"
      - think: 2
```

### 2. Stress Testing

#### Concurrent Department Updates
```yaml
# artillery/scenarios/department-updates.yml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 60
      arrivalRate: 10
      rampTo: 100
  variables:
    token: "eyJhbGciOiJIUzI1..."

scenarios:
  - name: "Concurrent Department Updates"
    flow:
      - get:
          url: "/api/departments"
          headers:
            Authorization: "Bearer {{token}}"
          capture:
            - json: "$.data.departments[0].id"
              as: "deptId"
      - put:
          url: "/api/departments/{{deptId}}"
          headers:
            Authorization: "Bearer {{token}}"
          json:
            networkQuota:
              daily: "{{ Math.floor(Math.random() * 5368709120) }}"
              monthly: "{{ Math.floor(Math.random() * 161061273600) }}"
      - think: 1
```

### 3. Endurance Testing

#### Long-Running Analytics
```yaml
# artillery/scenarios/analytics-endurance.yml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 3600  # 1 hour
      arrivalRate: 10
  variables:
    token: "eyJhbGciOiJIUzI1..."

scenarios:
  - name: "Analytics Endurance"
    flow:
      - get:
          url: "/api/departments"
          headers:
            Authorization: "Bearer {{token}}"
          capture:
            - json: "$.data.departments[0].id"
              as: "deptId"
      - get:
          url: "/api/advanced-analytics/department/{{deptId}}/predictions"
          headers:
            Authorization: "Bearer {{token}}"
      - think: 5
```

### 4. Spike Testing

#### Traffic Spike Simulation
```yaml
# artillery/scenarios/traffic-spike.yml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 30
      arrivalRate: 100
      name: "Spike"
    - duration: 60
      arrivalRate: 5
      name: "Recovery"
  variables:
    token: "eyJhbGciOiJIUzI1..."

scenarios:
  - name: "Traffic Spike"
    flow:
      - get:
          url: "/api/departments"
          headers:
            Authorization: "Bearer {{token}}"
      - get:
          url: "/api/analytics/most-visited"
          headers:
            Authorization: "Bearer {{token}}"
      - think: 1
```

## WebSocket Performance Testing

### 1. Connection Stress Test
```javascript
// tests/performance/websocket/connection-stress.js
const io = require('socket.io-client');
const { performance } = require('perf_hooks');

const runConnectionTest = async (connections = 1000) => {
  const sockets = [];
  const metrics = {
    successful: 0,
    failed: 0,
    connectionTimes: []
  };

  for (let i = 0; i < connections; i++) {
    const start = performance.now();
    try {
      const socket = io('http://localhost:5001', {
        auth: { token: 'test_token' }
      });

      await new Promise((resolve, reject) => {
        socket.on('connect', () => {
          metrics.connectionTimes.push(performance.now() - start);
          metrics.successful++;
          resolve();
        });

        socket.on('connect_error', (error) => {
          metrics.failed++;
          reject(error);
        });

        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });

      sockets.push(socket);
    } catch (error) {
      metrics.failed++;
    }

    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return {
    ...metrics,
    averageConnectionTime: 
      metrics.connectionTimes.reduce((a, b) => a + b, 0) / 
      metrics.connectionTimes.length
  };
};
```

### 2. Real-time Updates Test
```javascript
// tests/performance/websocket/realtime-updates.js
const runRealtimeTest = async (duration = 300000) => {  // 5 minutes
  const metrics = {
    messagesSent: 0,
    messagesReceived: 0,
    latencies: []
  };

  const socket = io('http://localhost:5001', {
    auth: { token: 'test_token' }
  });

  await new Promise((resolve) => {
    const interval = setInterval(() => {
      const start = performance.now();
      metrics.messagesSent++;
      
      socket.emit('analytics:request', { timestamp: Date.now() }, () => {
        metrics.latencies.push(performance.now() - start);
        metrics.messagesReceived++;
      });
    }, 100);  // Send request every 100ms

    setTimeout(() => {
      clearInterval(interval);
      socket.disconnect();
      resolve();
    }, duration);
  });

  return {
    ...metrics,
    averageLatency: 
      metrics.latencies.reduce((a, b) => a + b, 0) / 
      metrics.latencies.length,
    messageRate: metrics.messagesSent / (duration / 1000)
  };
};
```

## Performance Monitoring

### 1. System Metrics Collection
```javascript
// monitoring/metrics.js
const os = require('os');
const { performance } = require('perf_hooks');

const collectMetrics = () => ({
  timestamp: Date.now(),
  cpu: {
    loadAverage: os.loadavg(),
    utilizationPercent: os.cpus().map(cpu => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b);
      const idle = cpu.times.idle;
      return ((total - idle) / total) * 100;
    })
  },
  memory: {
    total: os.totalmem(),
    free: os.freemem(),
    usedPercent: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
  },
  eventLoop: {
    lag: performance.eventLoopUtilization().utilization
  }
});
```

### 2. Response Time Monitoring
```javascript
// middleware/performance.js
const responseTimeMiddleware = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    const path = req.route ? req.route.path : req.path;
    
    metrics.record({
      path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: Date.now()
    });
  });

  next();
};
```

## Performance Analysis

### 1. Response Time Analysis
```javascript
// analysis/response-times.js
const analyzeResponseTimes = (metrics) => {
  const percentile = (arr, p) => {
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  const times = metrics.map(m => m.duration);

  return {
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((a, b) => a + b) / times.length,
    p50: percentile(times, 0.5),
    p95: percentile(times, 0.95),
    p99: percentile(times, 0.99)
  };
};
```

### 2. Error Rate Analysis
```javascript
// analysis/error-rates.js
const analyzeErrorRates = (metrics) => {
  const total = metrics.length;
  const errors = metrics.filter(m => m.statusCode >= 500).length;
  const clientErrors = metrics.filter(m => m.statusCode >= 400 && m.statusCode < 500).length;

  return {
    total,
    errorRate: (errors / total) * 100,
    clientErrorRate: (clientErrors / total) * 100,
    statusCodes: metrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
      return acc;
    }, {})
  };
};
```

## Performance Optimization Tips

### 1. Database Optimization
```javascript
// Example index creation for common queries
db.departments.createIndex({ "name": 1 });
db.networkUsage.createIndex({ 
  "departmentId": 1, 
  "timestamp": -1 
});

// Example compound index for analytics queries
db.networkUsage.createIndex({
  "departmentId": 1,
  "timestamp": -1,
  "bytes": 1
});
```

### 2. Caching Strategy
```javascript
// Example caching middleware
const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.send(cachedResponse);
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};
```

### 3. Query Optimization
```javascript
// Example optimized aggregation pipeline
const getUsageStats = async (departmentId, timeframe) => {
  return await NetworkUsage.aggregate([
    {
      $match: {
        departmentId,
        timestamp: {
          $gte: new Date(Date.now() - timeframe * 86400000)
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" },
          hour: { $hour: "$timestamp" }
        },
        totalBytes: { $sum: "$bytes" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
        "_id.hour": 1
      }
    }
  ]).allowDiskUse(true);
};
```

# Monitoring Dashboards Setup

## Grafana Dashboard Setup

### 1. System Metrics Dashboard

```json
{
  "dashboard": {
    "id": null,
    "title": "EyeNet System Metrics",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 0
        },
        "targets": [
          {
            "expr": "rate(process_cpu_seconds_total[5m]) * 100",
            "legendFormat": "CPU %"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 0
        },
        "targets": [
          {
            "expr": "process_resident_memory_bytes / 1024 / 1024",
            "legendFormat": "Memory (MB)"
          }
        ]
      }
    ]
  }
}
```

### 2. API Performance Dashboard

```json
{
  "dashboard": {
    "title": "API Performance",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 0
        },
        "targets": [
          {
            "expr": "rate(http_requests_total[1m])",
            "legendFormat": "{{method}} {{path}}"
          }
        ]
      },
      {
        "title": "Response Times",
        "type": "heatmap",
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 0
        },
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_bucket[5m])",
            "format": "heatmap"
          }
        ]
      }
    ]
  }
}
```

### 3. WebSocket Metrics Dashboard

```json
{
  "dashboard": {
    "title": "WebSocket Metrics",
    "panels": [
      {
        "title": "Active Connections",
        "type": "stat",
        "gridPos": {
          "h": 4,
          "w": 6,
          "x": 0,
          "y": 0
        },
        "targets": [
          {
            "expr": "websocket_active_connections"
          }
        ]
      },
      {
        "title": "Message Rate",
        "type": "graph",
        "gridPos": {
          "h": 8,
          "w": 18,
          "x": 6,
          "y": 0
        },
        "targets": [
          {
            "expr": "rate(websocket_messages_total[1m])",
            "legendFormat": "{{type}}"
          }
        ]
      }
    ]
  }
}
```

## Prometheus Configuration

### 1. Metrics Collection

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'eyenet'
    static_configs:
      - targets: ['localhost:5001']
    metrics_path: '/metrics'
    scheme: 'http'
```

### 2. Custom Metrics

```javascript
// metrics/prometheus.js
const prometheus = require('prom-client');

// Request duration histogram
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// WebSocket metrics
const websocketConnections = new prometheus.Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections'
});

const websocketMessages = new prometheus.Counter({
  name: 'websocket_messages_total',
  help: 'Total WebSocket messages',
  labelNames: ['type']
});
```

## Alert Configuration

### 1. System Alerts

```yaml
# alerts.yml
groups:
  - name: system
    rules:
      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High CPU usage detected
          
      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 1024
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High memory usage detected
```

### 2. API Alerts

```yaml
groups:
  - name: api
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100 > 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          
      - alert: SlowResponses
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: Slow response times detected
```

## Logging Configuration

### 1. Winston Logger Setup

```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'eyenet' },
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. ELK Stack Configuration

```yaml
# logstash.conf
input {
  file {
    path => "/path/to/combined.log"
    type => "nodejs"
    codec => json
  }
}

filter {
  if [type] == "nodejs" {
    date {
      match => [ "timestamp", "ISO8601" ]
      target => "@timestamp"
    }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "eyenet-logs-%{+YYYY.MM.dd}"
  }
}
```

## Dashboard Examples

### 1. Department Usage Dashboard

```javascript
// frontend/src/components/DepartmentDashboard.js
const DepartmentDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const socket = io('/departments');
    
    socket.on('metrics:update', (data) => {
      setMetrics(data);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div className="dashboard">
      <div className="metric-card">
        <h3>Active Users</h3>
        <div className="metric-value">{metrics?.activeUsers}</div>
      </div>
      <div className="metric-card">
        <h3>Bandwidth Usage</h3>
        <div className="metric-value">
          {formatBytes(metrics?.bandwidth)}
        </div>
      </div>
      <div className="metric-card">
        <h3>Security Score</h3>
        <div className="metric-value">
          {metrics?.securityScore}/100
        </div>
      </div>
    </div>
  );
};
```

### 2. Real-time Network Monitor

```javascript
// frontend/src/components/NetworkMonitor.js
const NetworkMonitor = () => {
  const [data, setData] = useState({
    connections: [],
    bandwidth: {
      current: 0,
      peak: 0
    }
  });
  
  useEffect(() => {
    const socket = io('/network');
    
    socket.on('connection:new', (conn) => {
      setData(prev => ({
        ...prev,
        connections: [...prev.connections, conn]
      }));
    });
    
    socket.on('bandwidth:update', (bandwidth) => {
      setData(prev => ({
        ...prev,
        bandwidth
      }));
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div className="network-monitor">
      <BandwidthGraph data={data.bandwidth} />
      <ConnectionsList connections={data.connections} />
    </div>
  );
};
```

### 3. Security Dashboard

```javascript
// frontend/src/components/SecurityDashboard.js
const SecurityDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [threats, setThreats] = useState([]);
  
  useEffect(() => {
    const socket = io('/security');
    
    socket.on('alert:new', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });
    
    socket.on('threat:detected', (threat) => {
      setThreats(prev => [threat, ...prev]);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div className="security-dashboard">
      <ThreatMap threats={threats} />
      <AlertsList alerts={alerts} />
      <SecurityMetrics />
    </div>
  );
};
```

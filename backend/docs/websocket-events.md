# WebSocket Events Documentation

## Connection Setup

### Client Connection
```javascript
const socket = io('http://localhost:5001', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Connection Events
```javascript
socket.on('connect', () => {
  console.log('Connected with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
});
```

## Network Monitoring Events

### Real-time Usage Updates
```javascript
// Server Emission
socket.emit('usage:update', {
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  metrics: {
    bytesTransferred: 1073741824,
    activeConnections: 25,
    bandwidthUtilization: 0.75
  }
});

// Client Subscription
socket.on('usage:update', (data) => {
  updateDashboard(data);
});
```

### Quota Alerts
```javascript
// Server Emission
socket.emit('quota:alert', {
  type: 'warning',
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  quota: {
    type: 'daily',
    used: 4294967296,
    limit: 5368709120,
    percentage: 80
  }
});

// Client Subscription
socket.on('quota:alert', (alert) => {
  showQuotaNotification(alert);
});
```

### Security Incidents
```javascript
// Server Emission
socket.emit('security:incident', {
  severity: 'high',
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  incident: {
    type: 'unusual_traffic',
    source: '192.168.1.100',
    details: 'Sudden spike in outbound traffic'
  }
});

// Client Subscription
socket.on('security:incident', (incident) => {
  handleSecurityIncident(incident);
});
```

## Department Events

### Department Status Updates
```javascript
// Server Emission
socket.emit('department:status', {
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  status: {
    active: true,
    connectedUsers: 25,
    healthScore: 0.95
  }
});

// Client Subscription
socket.on('department:status', (status) => {
  updateDepartmentStatus(status);
});
```

### IP Management Events
```javascript
// Server Emission
socket.emit('ip:blocked', {
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  ip: {
    address: '192.168.1.100',
    reason: 'Exceeded rate limit',
    duration: 3600
  }
});

// Client Subscription
socket.on('ip:blocked', (data) => {
  notifyIPBlocked(data);
});
```

## Analytics Events

### Real-time Analytics Updates
```javascript
// Server Emission
socket.emit('analytics:update', {
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  metrics: {
    activeUsers: 25,
    topWebsites: [
      { domain: 'github.com', visits: 150 },
      { domain: 'jira.com', visits: 100 }
    ],
    bandwidth: {
      current: 1048576,
      trend: 'increasing'
    }
  }
});

// Client Subscription
socket.on('analytics:update', (data) => {
  updateAnalyticsDashboard(data);
});
```

### Anomaly Detection
```javascript
// Server Emission
socket.emit('analytics:anomaly', {
  departmentId: 'dept123',
  timestamp: '2024-12-15T04:49:29.000Z',
  anomaly: {
    type: 'usage_spike',
    severity: 'medium',
    details: 'Unusual increase in streaming traffic',
    confidence: 0.85
  }
});

// Client Subscription
socket.on('analytics:anomaly', (anomaly) => {
  handleAnomalyDetection(anomaly);
});
```

## System Events

### Health Status Updates
```javascript
// Server Emission
socket.emit('system:health', {
  timestamp: '2024-12-15T04:49:29.000Z',
  status: {
    cpu: {
      usage: 45.5,
      temperature: 65
    },
    memory: {
      used: 4294967296,
      total: 8589934592
    },
    storage: {
      used: 107374182400,
      total: 214748364800
    }
  }
});

// Client Subscription
socket.on('system:health', (health) => {
  updateSystemHealth(health);
});
```

### Maintenance Notifications
```javascript
// Server Emission
socket.emit('system:maintenance', {
  timestamp: '2024-12-15T04:49:29.000Z',
  maintenance: {
    type: 'scheduled',
    startTime: '2024-12-16T02:00:00.000Z',
    duration: 3600,
    impact: 'System will be in read-only mode'
  }
});

// Client Subscription
socket.on('system:maintenance', (maintenance) => {
  showMaintenanceNotification(maintenance);
});
```

## Error Handling

### Error Events
```javascript
// Server Emission
socket.emit('error', {
  code: 'E_QUOTA_EXCEEDED',
  message: 'Department quota exceeded',
  timestamp: '2024-12-15T04:49:29.000Z'
});

// Client Subscription
socket.on('error', (error) => {
  handleSocketError(error);
});
```

## Best Practices

### Reconnection Strategy
```javascript
const socket = io('http://localhost:5001', {
  auth: { token: 'your_jwt_token' },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnection attempt ${attempt}`);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect after 5 attempts');
});
```

### Event Acknowledgments
```javascript
// Server-side
socket.on('analytics:subscribe', (departmentId, callback) => {
  try {
    // Subscribe logic
    callback({ success: true });
  } catch (error) {
    callback({ success: false, error: error.message });
  }
});

// Client-side
socket.emit('analytics:subscribe', 'dept123', (response) => {
  if (response.success) {
    console.log('Successfully subscribed');
  } else {
    console.error('Subscription failed:', response.error);
  }
});
```

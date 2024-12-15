# EyeNet API Examples

## Authentication Examples

### Login and Get Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

## Department Management Examples

### Create Department with Full Configuration
```http
POST /api/departments
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "name": "Engineering",
  "description": "Software Engineering Department",
  "managerId": "user_id",
  "allowedIPs": [
    "192.168.1.100",
    "192.168.1.101"
  ],
  "networkQuota": {
    "daily": 5368709120,    // 5GB
    "monthly": 161061273600 // 150GB
  },
  "securityLevel": "high",
  "restrictions": {
    "blockedWebsites": [
      "facebook.com",
      "twitter.com"
    ],
    "allowedHours": {
      "start": "09:00",
      "end": "18:00"
    }
  }
}
```

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "department": {
      "id": "dept_id",
      "name": "Engineering",
      "description": "Software Engineering Department",
      "managerId": "user_id",
      "allowedIPs": ["192.168.1.100", "192.168.1.101"],
      "networkQuota": {
        "daily": 5368709120,
        "monthly": 161061273600
      },
      "securityLevel": "high",
      "status": "active",
      "createdAt": "2024-12-15T04:44:48.000Z",
      "updatedAt": "2024-12-15T04:44:48.000Z"
    }
  }
}
```

### Get Department Analytics with Detailed Metrics
```http
GET /api/analytics/department-usage?departmentId=dept_id&timeframe=week
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "usage": {
      "total": {
        "bytes": 42949672960,
        "requests": 15000
      },
      "byCategory": {
        "work": {
          "bytes": 32212254720,
          "percentage": 75
        },
        "social": {
          "bytes": 6442450944,
          "percentage": 15
        },
        "streaming": {
          "bytes": 4294967296,
          "percentage": 10
        }
      },
      "topWebsites": [
        {
          "domain": "github.com",
          "visits": 5000,
          "bytes": 10737418240
        }
      ],
      "hourlyDistribution": [
        {
          "hour": 9,
          "bytes": 2147483648,
          "requests": 1000
        }
      ]
    },
    "quotaStatus": {
      "daily": {
        "used": 4294967296,
        "remaining": 1073741824,
        "percentage": 80
      },
      "monthly": {
        "used": 85899345920,
        "remaining": 75161927680,
        "percentage": 53.33
      }
    }
  }
}
```

## Advanced Analytics Examples

### Get Real-time Network Insights
```http
GET /api/advanced-analytics/department/dept_id/realtime?window=300
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "activeUsers": {
      "count": 25,
      "byCategory": {
        "work": 20,
        "social": 3,
        "streaming": 2
      }
    },
    "bandwidth": {
      "current": {
        "bytesPerSecond": 1048576,
        "activeConnections": 50
      },
      "peak": {
        "bytesPerSecond": 2097152,
        "timestamp": "2024-12-15T04:30:00.000Z"
      }
    },
    "activities": [
      {
        "timestamp": "2024-12-15T04:44:30.000Z",
        "ipAddress": "192.168.1.100",
        "action": "download",
        "bytes": 104857600,
        "category": "work"
      }
    ],
    "alerts": [
      {
        "type": "quota_warning",
        "message": "Department approaching daily quota (80%)",
        "severity": "warning",
        "timestamp": "2024-12-15T04:40:00.000Z"
      }
    ]
  }
}
```

### Get Predictive Insights with Confidence Scores
```http
GET /api/advanced-analytics/department/dept_id/predictions?days=7
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "predictions": [
      {
        "date": "2024-12-16",
        "predictedUsage": {
          "bytes": 5368709120,
          "confidence": 0.85
        },
        "peakHours": [
          {
            "hour": 14,
            "predictedBytes": 536870912,
            "confidence": 0.9
          }
        ]
      }
    ],
    "trends": {
      "overall": "increasing",
      "byCategory": {
        "work": "stable",
        "social": "increasing",
        "streaming": "decreasing"
      }
    },
    "recommendations": [
      {
        "type": "quota_adjustment",
        "suggestion": "Consider increasing daily quota by 20%",
        "reason": "Consistent high usage pattern detected",
        "confidence": 0.88
      }
    ]
  }
}
```

## IP Management Examples

### Register Multiple IPs with Restrictions
```http
POST /api/ips/batch
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "departmentId": "dept_id",
  "ips": [
    {
      "ipAddress": "192.168.1.100",
      "status": "active",
      "restrictions": [
        "facebook.com",
        "youtube.com"
      ],
      "bandwidth": {
        "limit": 1048576,
        "period": "hour"
      }
    },
    {
      "ipAddress": "192.168.1.101",
      "status": "restricted",
      "restrictions": [
        "*.social-media.com",
        "gaming.*"
      ],
      "allowedHours": {
        "start": "09:00",
        "end": "17:00"
      }
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "registered": [
      {
        "ipAddress": "192.168.1.100",
        "status": "active",
        "id": "ip_id_1"
      },
      {
        "ipAddress": "192.168.1.101",
        "status": "restricted",
        "id": "ip_id_2"
      }
    ],
    "failed": []
  }
}
```

## Error Response Examples

### Rate Limit Exceeded
```json
{
  "status": "error",
  "error": {
    "code": 429,
    "message": "Rate limit exceeded",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetTime": "2024-12-15T04:59:48.000Z"
    }
  }
}
```

### Validation Error
```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": {
      "fields": [
        {
          "field": "networkQuota.daily",
          "message": "Must be a positive number",
          "value": -1000
        },
        {
          "field": "allowedIPs",
          "message": "Invalid IP address format",
          "value": "256.256.256.256"
        }
      ]
    }
  }
}
```

### Authentication Error
```json
{
  "status": "error",
  "error": {
    "code": 401,
    "message": "Authentication failed",
    "details": {
      "reason": "Token expired",
      "expiredAt": "2024-12-15T04:30:00.000Z"
    }
  }
}
```

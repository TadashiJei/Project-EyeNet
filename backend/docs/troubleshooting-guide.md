# EyeNet Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### JWT Token Invalid or Expired
**Problem:** Receiving 401 Unauthorized with "Token invalid" or "Token expired"
```json
{
  "status": "error",
  "error": {
    "code": 401,
    "message": "Token expired"
  }
}
```

**Solutions:**
1. Check token expiration
   ```javascript
   // Check token expiration
   const decoded = jwt.decode(token);
   const isExpired = decoded.exp < Date.now() / 1000;
   ```

2. Request new token using refresh token
   ```http
   POST /api/auth/refresh
   Content-Type: application/json
   {
     "refreshToken": "your_refresh_token"
   }
   ```

#### Rate Limit Exceeded
**Problem:** Receiving 429 Too Many Requests
```json
{
  "status": "error",
  "error": {
    "code": 429,
    "message": "Rate limit exceeded"
  }
}
```

**Solutions:**
1. Check rate limit headers in response
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 0
   X-RateLimit-Reset: 1639547388
   ```

2. Implement exponential backoff
   ```javascript
   const backoff = async (retries) => {
     const delay = Math.min(1000 * Math.pow(2, retries), 10000);
     await new Promise(resolve => setTimeout(resolve, delay));
   };
   ```

### Database Connection Issues

#### MongoDB Connection Failed
**Problem:** Server fails to start with MongoDB connection error

**Solutions:**
1. Check MongoDB service status:
   ```bash
   sudo systemctl status mongodb
   ```

2. Verify connection string:
   ```javascript
   // Test connection
   mongoose.connect(uri, {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000
   }).then(
     () => console.log('Connected'),
     err => console.error('Connection error:', err)
   );
   ```

3. Check network connectivity:
   ```bash
   nc -zv localhost 27017
   ```

### Performance Issues

#### Slow API Response Times
**Problem:** API endpoints taking longer than expected to respond

**Solutions:**
1. Enable request timing logging:
   ```javascript
   app.use((req, res, next) => {
     req.startTime = Date.now();
     res.on('finish', () => {
       const duration = Date.now() - req.startTime;
       console.log(`${req.method} ${req.path} - ${duration}ms`);
     });
     next();
   });
   ```

2. Check MongoDB query performance:
   ```javascript
   // Add explain to queries
   const result = await Model.find({}).explain('executionStats');
   console.log(result.executionStats);
   ```

3. Implement caching:
   ```javascript
   const cache = require('memory-cache');
   
   const cacheMiddleware = (duration) => {
     return (req, res, next) => {
       const key = '__express__' + req.originalUrl;
       const cachedBody = cache.get(key);
       
       if (cachedBody) {
         res.send(cachedBody);
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

### Memory Issues

#### Memory Leaks
**Problem:** Server memory usage gradually increases

**Solutions:**
1. Monitor memory usage:
   ```javascript
   setInterval(() => {
     const used = process.memoryUsage();
     console.log({
       rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
       heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
       heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
       external: `${Math.round(used.external / 1024 / 1024)}MB`
     });
   }, 60000);
   ```

2. Check for unclosed connections:
   ```javascript
   // Properly close MongoDB connections
   process.on('SIGINT', async () => {
     await mongoose.connection.close();
     process.exit(0);
   });
   ```

### Network Issues

#### CORS Errors
**Problem:** Receiving CORS policy errors in browser

**Solutions:**
1. Check CORS configuration:
   ```javascript
   const corsOptions = {
     origin: (origin, callback) => {
       if (!origin || whitelist.indexOf(origin) !== -1) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
   };
   ```

2. Verify request headers:
   ```javascript
   app.use((req, res, next) => {
     console.log('Origin:', req.headers.origin);
     console.log('Access-Control-Request-Method:', 
       req.headers['access-control-request-method']);
     next();
   });
   ```

## Debugging Tools

### Request Logging
```javascript
const requestLogger = (req, res, next) => {
  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers
  });
  next();
};
```

### Response Logging
```javascript
const responseLogger = (req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString('utf8');
    console.log({
      timestamp: new Date().toISOString(),
      status: res.statusCode,
      body: body
    });
    oldEnd.apply(res, arguments);
  };

  next();
};
```

### Error Handling
```javascript
const errorHandler = (err, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    status: 'error',
    error: {
      code: err.status || 500,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    }
  });
};
```

## Diagnostic Commands

### System Health Check
```bash
# Check Node.js process
ps aux | grep node

# Check memory usage
free -m

# Check disk space
df -h

# Check network connections
netstat -tulpn

# Check MongoDB status
mongosh --eval "db.serverStatus()"
```

### Log Analysis
```bash
# Search for errors in logs
grep -i error /path/to/app.log

# Count occurrences of specific error
grep -c "MongoError" /path/to/app.log

# View real-time logs
tail -f /path/to/app.log | grep --line-buffered "error"
```

## Monitoring Setup

### Basic Monitoring
```javascript
const monitor = {
  startTime: Date.now(),
  requests: 0,
  errors: 0,
  
  increment() {
    this.requests++;
  },
  
  recordError() {
    this.errors++;
  },
  
  getStats() {
    const uptime = (Date.now() - this.startTime) / 1000;
    return {
      uptime,
      requests: this.requests,
      errors: this.errors,
      requestsPerSecond: this.requests / uptime
    };
  }
};

app.get('/metrics', (req, res) => {
  res.json(monitor.getStats());
});
```

### Health Check Endpoint
```javascript
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB
    await mongoose.connection.db.admin().ping();
    
    // Check memory
    const memoryUsage = process.memoryUsage();
    
    // Check uptime
    const uptime = process.uptime();
    
    res.json({
      status: 'healthy',
      checks: {
        database: 'connected',
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed
        },
        uptime
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

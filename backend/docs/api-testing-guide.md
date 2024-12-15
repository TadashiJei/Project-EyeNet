# EyeNet API Testing Guide

## Testing Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 10000,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/fixtures/'
  ]
};
```

### Test Environment Setup
```javascript
// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
```

## Unit Tests

### Department Controller Tests
```javascript
// tests/unit/controllers/departmentController.test.js
const request = require('supertest');
const app = require('../../../app');
const { Department } = require('../../../models');
const { generateToken } = require('../../helpers/auth');

describe('Department Controller', () => {
  let token;
  let department;

  beforeEach(async () => {
    token = generateToken({ id: 'user123', role: 'admin' });
    department = await Department.create({
      name: 'Test Department',
      description: 'Test Description',
      managerId: 'user123'
    });
  });

  describe('GET /api/departments', () => {
    it('should return all departments', async () => {
      const res = await request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.departments).toHaveLength(1);
      expect(res.body.data.departments[0].name).toBe('Test Department');
    });

    it('should paginate results', async () => {
      // Create 15 departments
      await Promise.all(
        Array(14).fill().map((_, i) => 
          Department.create({
            name: `Department ${i}`,
            description: `Description ${i}`,
            managerId: 'user123'
          })
        )
      );

      const res = await request(app)
        .get('/api/departments?page=2&limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.departments).toHaveLength(5);
      expect(res.body.data.pagination).toEqual({
        currentPage: 2,
        totalPages: 2,
        totalItems: 15,
        hasNextPage: false,
        hasPrevPage: true
      });
    });
  });

  describe('POST /api/departments', () => {
    it('should create a new department', async () => {
      const newDept = {
        name: 'New Department',
        description: 'New Description',
        managerId: 'user123',
        networkQuota: {
          daily: 5368709120,
          monthly: 161061273600
        }
      };

      const res = await request(app)
        .post('/api/departments')
        .set('Authorization', `Bearer ${token}`)
        .send(newDept);

      expect(res.status).toBe(201);
      expect(res.body.data.department.name).toBe(newDept.name);
      expect(res.body.data.department.networkQuota).toEqual(newDept.networkQuota);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/departments')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: 'Name is required'
        })
      );
    });
  });
});
```

### Analytics Service Tests
```javascript
// tests/unit/services/analyticsService.test.js
const { 
  analyzeUsagePatterns,
  detectAnomalies,
  generatePredictions
} = require('../../../services/analyticsEngine');
const { NetworkUsage } = require('../../../models');

describe('Analytics Engine', () => {
  describe('analyzeUsagePatterns', () => {
    it('should identify peak usage hours', async () => {
      // Create test usage data
      await NetworkUsage.insertMany([
        {
          departmentId: 'dept123',
          timestamp: new Date('2024-12-15T09:00:00'),
          bytes: 1073741824
        },
        {
          departmentId: 'dept123',
          timestamp: new Date('2024-12-15T14:00:00'),
          bytes: 2147483648
        }
      ]);

      const patterns = await analyzeUsagePatterns('dept123');
      expect(patterns.peakHours).toContainEqual({
        hour: 14,
        avgUsage: 2147483648
      });
    });
  });

  describe('detectAnomalies', () => {
    it('should detect unusual usage spikes', async () => {
      // Create normal usage pattern
      const normalUsage = Array(24).fill().map((_, i) => ({
        departmentId: 'dept123',
        timestamp: new Date(`2024-12-15T${i}:00:00`),
        bytes: 1073741824
      }));

      // Add anomaly
      normalUsage.push({
        departmentId: 'dept123',
        timestamp: new Date('2024-12-15T15:00:00'),
        bytes: 10737418240
      });

      await NetworkUsage.insertMany(normalUsage);

      const anomalies = await detectAnomalies('dept123');
      expect(anomalies).toContainEqual(
        expect.objectContaining({
          timestamp: expect.any(Date),
          severity: 'high',
          deviation: expect.any(Number)
        })
      );
    });
  });
});
```

## Integration Tests

### Department Workflow Tests
```javascript
// tests/integration/workflows/department.test.js
describe('Department Workflow', () => {
  it('should handle complete department lifecycle', async () => {
    // 1. Create department
    const createRes = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Engineering',
        description: 'Engineering Department',
        managerId: 'user123'
      });

    const deptId = createRes.body.data.department.id;

    // 2. Add IPs to department
    await request(app)
      .post(`/api/departments/${deptId}/ips`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ips: ['192.168.1.100', '192.168.1.101']
      });

    // 3. Generate some network usage
    await NetworkUsage.create({
      departmentId: deptId,
      timestamp: new Date(),
      bytes: 1073741824,
      requests: 1000
    });

    // 4. Get department analytics
    const analyticsRes = await request(app)
      .get(`/api/analytics/department/${deptId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(analyticsRes.body.data.usage.total.bytes).toBe(1073741824);

    // 5. Update department quota
    await request(app)
      .put(`/api/departments/${deptId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        networkQuota: {
          daily: 5368709120,
          monthly: 161061273600
        }
      });

    // 6. Verify quota update
    const deptRes = await request(app)
      .get(`/api/departments/${deptId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deptRes.body.data.department.networkQuota.daily)
      .toBe(5368709120);
  });
});
```

### Advanced Analytics Tests
```javascript
// tests/integration/workflows/analytics.test.js
describe('Advanced Analytics Workflow', () => {
  it('should generate comprehensive department analysis', async () => {
    // 1. Create test data
    const dept = await Department.create({
      name: 'Test Department',
      managerId: 'user123'
    });

    // 2. Generate historical usage data
    const usageData = generateTestUsageData(dept.id, 30); // Helper function
    await NetworkUsage.insertMany(usageData);

    // 3. Get real-time insights
    const realtimeRes = await request(app)
      .get(`/api/advanced-analytics/department/${dept.id}/realtime`)
      .set('Authorization', `Bearer ${token}`);

    expect(realtimeRes.status).toBe(200);
    expect(realtimeRes.body.data.bandwidth).toBeDefined();

    // 4. Get predictions
    const predictionsRes = await request(app)
      .get(`/api/advanced-analytics/department/${dept.id}/predictions`)
      .set('Authorization', `Bearer ${token}`);

    expect(predictionsRes.status).toBe(200);
    expect(predictionsRes.body.data.predictions).toHaveLength(7);

    // 5. Get security recommendations
    const securityRes = await request(app)
      .get(`/api/advanced-analytics/department/${dept.id}/security`)
      .set('Authorization', `Bearer ${token}`);

    expect(securityRes.status).toBe(200);
    expect(securityRes.body.data.recommendations).toBeDefined();
  });
});
```

## Load Testing

### Artillery Configuration
```yaml
# tests/load/config.yml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 50
  defaults:
    headers:
      Authorization: "Bearer {{token}}"

scenarios:
  - name: "Department Analytics Flow"
    flow:
      - get:
          url: "/api/departments"
          capture:
            - json: "$.data.departments[0].id"
              as: "deptId"
      - get:
          url: "/api/analytics/department/{{deptId}}"
      - get:
          url: "/api/advanced-analytics/department/{{deptId}}/realtime"
      - think: 1
      - get:
          url: "/api/advanced-analytics/department/{{deptId}}/predictions"
```

### Load Test Script
```javascript
// tests/load/run.js
const artillery = require('artillery');
const program = artillery.program();

program
  .script('./tests/load/config.yml')
  .on('stats', (stats) => {
    console.log('Test metrics:', {
      scenariosCreated: stats.scenariosCreated,
      scenariosCompleted: stats.scenariosCompleted,
      requestsCompleted: stats.requestsCompleted,
      latency: {
        min: stats.latency.min,
        max: stats.latency.max,
        median: stats.latency.median,
        p95: stats.latency.p95,
        p99: stats.latency.p99
      }
    });
  })
  .run();
```

## Security Testing

### JWT Token Tests
```javascript
// tests/security/auth.test.js
describe('JWT Authentication', () => {
  it('should reject expired tokens', async () => {
    const expiredToken = generateToken(
      { id: 'user123', role: 'admin' },
      '0s'
    );

    const res = await request(app)
      .get('/api/departments')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Token expired');
  });

  it('should reject tampered tokens', async () => {
    const token = generateToken({ id: 'user123', role: 'admin' });
    const tamperedToken = token.slice(0, -5) + 'xxxxx';

    const res = await request(app)
      .get('/api/departments')
      .set('Authorization', `Bearer ${tamperedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid token');
  });
});
```

### Rate Limiting Tests
```javascript
// tests/security/rateLimiter.test.js
describe('Rate Limiting', () => {
  it('should block excessive requests', async () => {
    const token = generateToken({ id: 'user123', role: 'admin' });
    const requests = Array(101).fill().map(() => 
      request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${token}`)
    );

    const responses = await Promise.all(requests);
    const blockedResponses = responses.filter(r => r.status === 429);
    
    expect(blockedResponses).toHaveLength(1);
    expect(blockedResponses[0].body.error.code).toBe(429);
  });
});
```

## Test Helpers

### Test Data Generators
```javascript
// tests/helpers/generators.js
const generateTestUsageData = (departmentId, days) => {
  const data = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(hour, 0, 0, 0);

      // Generate realistic usage pattern
      const baseUsage = 1073741824; // 1GB
      const timeMultiplier = hour >= 9 && hour <= 17 ? 2 : 0.5;
      const randomVariation = Math.random() * 0.5 + 0.75;

      data.push({
        departmentId,
        timestamp: date,
        bytes: Math.floor(baseUsage * timeMultiplier * randomVariation),
        requests: Math.floor(1000 * timeMultiplier * randomVariation)
      });
    }
  }

  return data;
};

module.exports = {
  generateTestUsageData
};
```

### Mock Response Helpers
```javascript
// tests/helpers/mocks.js
const mockSuccessResponse = (data) => ({
  status: 'success',
  data
});

const mockErrorResponse = (code, message, details = null) => ({
  status: 'error',
  error: {
    code,
    message,
    ...(details && { details })
  }
});

module.exports = {
  mockSuccessResponse,
  mockErrorResponse
};
```

## Running Tests

### NPM Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --config=jest.integration.config.js",
    "test:load": "node tests/load/run.js",
    "test:security": "jest --testPathPattern=tests/security"
  }
}
```

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          npm run test
          npm run test:integration
          npm run test:security
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2

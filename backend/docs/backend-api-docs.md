# EyeNet Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
All API endpoints require JWT authentication unless specified otherwise. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Department Management

### Create Department
```http
POST /departments
```
**Request Body:**
```json
{
  "name": "IT Department",
  "description": "Information Technology Department",
  "managerId": "user_id",
  "allowedIPs": ["192.168.1.1", "192.168.1.2"],
  "networkQuota": {
    "daily": 1073741824,  // 1GB in bytes
    "monthly": 32212254720  // 30GB in bytes
  },
  "securityLevel": "high"
}
```

### List Departments
```http
GET /departments
```
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (active/inactive/suspended)

### Get Department
```http
GET /departments/:id
```

### Update Department
```http
PUT /departments/:id
```
**Request Body:** Same as Create Department

### Delete Department
```http
DELETE /departments/:id
```

## Basic Analytics

### Most Visited Websites
```http
GET /analytics/most-visited
```
**Query Parameters:**
- `departmentId`: Optional department filter
- `timeframe`: day/week/month (default: day)

### Department Usage Statistics
```http
GET /analytics/department-usage
```
**Query Parameters:**
- `timeframe`: day/week/month (default: day)

## Advanced Analytics

### Comprehensive Department Analysis
```http
GET /advanced-analytics/department/:departmentId/analysis
```
Returns:
- Anomaly detection results
- Usage patterns
- Future predictions
- Security score

### Real-time Network Insights
```http
GET /advanced-analytics/department/:departmentId/realtime
```
**Query Parameters:**
- `window`: Time window in seconds (default: 300)

Returns live network usage data including:
- Active users
- Bandwidth usage
- Category breakdown
- Current activities

### Predictive Network Insights
```http
GET /advanced-analytics/department/:departmentId/predictions
```
**Query Parameters:**
- `days`: Number of days to predict (default: 7)

Returns:
- Usage predictions
- Confidence scores
- Pattern analysis
- Trend indicators

### Security Recommendations
```http
GET /advanced-analytics/department/:departmentId/security
```
Returns:
- Security score
- Risk assessment
- Actionable recommendations
- Urgent security concerns

## IP Management

### Register IP
```http
POST /ips
```
**Request Body:**
```json
{
  "ipAddress": "192.168.1.1",
  "departmentId": "department_id",
  "status": "active",
  "restrictions": ["facebook.com", "twitter.com"]
}
```

### List IPs
```http
GET /ips
```
**Query Parameters:**
- `departmentId`: Filter by department
- `status`: Filter by status (active/restricted/blocked)

### Update IP Restrictions
```http
PUT /ips/:ip
```
**Request Body:**
```json
{
  "status": "restricted",
  "restrictions": ["facebook.com", "twitter.com"]
}
```

### Remove IP
```http
DELETE /ips/:ip
```

## Response Format
All API responses follow this format:
```json
{
  "status": "success/error",
  "data": {
    // Response data
  },
  "message": "Optional message"
}
```

## Error Codes
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication failed
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Security Features
1. **Request Validation**
   - Input sanitization
   - Schema validation
   - Type checking

2. **Protection Mechanisms**
   - XSS protection
   - NoSQL injection prevention
   - Parameter pollution prevention
   - Request size limiting (10KB)

3. **Access Control**
   - JWT-based authentication
   - Role-based authorization
   - IP-based restrictions
   - Department-level isolation

## Monitoring and Logging
All requests are logged with:
- Timestamp
- IP address
- Request method and path
- Response status
- Response time
- User ID (if authenticated)
- Department ID (if applicable)

## WebSocket Events
Real-time updates are available through WebSocket connections for:
- Network usage alerts
- Security incidents
- Quota violations
- System status changes

## Environment Variables
Required environment variables:
```shell
MONGODB_URI=mongodb://localhost:27017/eyenet
JWT_SECRET=your_jwt_secret
SWAGGER_AUTH=true/false
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=secure_password
BACKEND_URL=http://localhost:5001
PORT=5001
```

## Development Tools
- Swagger UI available at `/api-docs`
- Health check endpoint at `/health`
- Metrics endpoint at `/metrics` (Prometheus format)

## Best Practices
1. Always use HTTPS in production
2. Implement proper error handling
3. Use appropriate HTTP methods
4. Include proper headers
5. Follow rate limiting guidelines
6. Keep authentication tokens secure
7. Monitor API usage
8. Regular security audits

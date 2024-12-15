const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const rateLimiter = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const swaggerAuth = require('./middleware/swaggerAuth');
const ipRestriction = require('./middleware/ipRestriction');
const networkMonitor = require('./middleware/networkMonitor');
const monitoringMiddleware = require('./middleware/monitoring');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

// Construct backend URL
const backendHost = process.env.BACKEND_URL || 'localhost';
const backendUrl = backendHost.includes('http') 
    ? backendHost 
    : `http://${backendHost}:${port}`;

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent parameter pollution

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 600
};
app.use(cors(corsOptions));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EyeNet API Documentation',
            version: '1.0.0',
            description: 'API documentation for the EyeNet backend'
        },
        servers: [
            {
                url: backendUrl,
                description: 'Backend server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(rateLimiter);
app.use(requestLogger);

// Monitoring middleware - should be added before route handlers
app.use(monitoringMiddleware);

// Network monitoring and IP restriction
app.use('/api', ipRestriction);
app.use('/api', networkMonitor);

// API Documentation with optional authentication
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'EyeNet API Documentation'
}));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        serverUrl: backendUrl,
        swaggerAuth: process.env.SWAGGER_AUTH === 'true'
    });
});

// MongoDB Connection with enhanced security
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => {
    console.log('MongoDB database connection established successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Import routes
const usersRouter = require('./routes/users');
const departmentsRouter = require('./routes/departments');
const ipsRouter = require('./routes/ips');
const reportsRouter = require('./routes/reports');
const analyticsRouter = require('./routes/analytics');
const advancedAnalyticsRouter = require('./routes/advancedAnalytics');
const networkMonitoringRoutes = require('./routes/networkMonitoring');
const monitoringRouter = require('./routes/monitoring');

// Use routes
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/ips', ipsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/advanced-analytics', advancedAnalyticsRouter);
app.use('/api/monitoring', monitoringRouter);
app.use('/api/network', networkMonitoringRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello from the EyeNet backend!');
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(`API Documentation available at ${backendUrl}/api-docs`);
    console.log(`Swagger Authentication: ${process.env.SWAGGER_AUTH === 'true' ? 'Enabled' : 'Disabled'}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const rateLimiter = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const swaggerAuth = require('./middleware/swaggerAuth');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Construct backend URL
const backendHost = process.env.BACKEND_URL || 'localhost';
const backendUrl = backendHost.includes('http') 
    ? backendHost 
    : `http://${backendHost}:${port}`;

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
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

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

// MongoDB Connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Routes
const usersRouter = require('./routes/users');
const departmentsRouter = require('./routes/departments');
const ipsRouter = require('./routes/ips');
const reportsRouter = require('./routes/reports');

app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/ips', ipsRouter);
app.use('/api/reports', reportsRouter);

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

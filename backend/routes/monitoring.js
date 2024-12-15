const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/monitoring/metrics:
 *   get:
 *     summary: Get current system metrics
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current system metrics
 */
router.get('/metrics', auth, monitoringController.getCurrentMetrics);

/**
 * @swagger
 * /api/monitoring/health:
 *   get:
 *     summary: Get system health status
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System health information
 */
router.get('/health', auth, monitoringController.getSystemHealth);

/**
 * @swagger
 * /api/monitoring/historical:
 *   get:
 *     summary: Get historical metrics
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *         description: Timeframe for historical data (e.g., 1h, 24h, 7d)
 *     responses:
 *       200:
 *         description: Historical metrics data
 */
router.get('/historical', auth, monitoringController.getHistoricalMetrics);

/**
 * @swagger
 * /api/monitoring/api:
 *   get:
 *     summary: Get API metrics
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API usage metrics
 */
router.get('/api', auth, monitoringController.getAPIMetrics);

/**
 * @swagger
 * /api/monitoring/websocket:
 *   get:
 *     summary: Get WebSocket metrics
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: WebSocket metrics
 */
router.get('/websocket', auth, monitoringController.getWebSocketMetrics);

module.exports = router;

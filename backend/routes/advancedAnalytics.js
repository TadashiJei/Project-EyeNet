const router = require('express').Router();
const advancedAnalyticsController = require('../controllers/advancedAnalyticsController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Advanced Analytics
 *   description: Advanced analytics endpoints
 */

/**
 * @swagger
 * /api/advanced-analytics/department/{departmentId}/analysis:
 *   get:
 *     tags:
 *       - Advanced Analytics
 *     summary: Get comprehensive department analysis
 *     description: Retrieves detailed analysis including anomalies, patterns, and predictions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Comprehensive analysis retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId/analysis', auth, advancedAnalyticsController.getDepartmentAnalysis);

/**
 * @swagger
 * /api/advanced-analytics/department/{departmentId}/realtime:
 *   get:
 *     tags:
 *       - Advanced Analytics
 *     summary: Get real-time network insights
 *     description: Retrieves real-time network usage data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *       - in: query
 *         name: window
 *         schema:
 *           type: integer
 *         description: Time window in seconds
 *         default: 300
 *     responses:
 *       200:
 *         description: Real-time insights retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId/realtime', auth, advancedAnalyticsController.getRealTimeInsights);

/**
 * @swagger
 * /api/advanced-analytics/department/{departmentId}/predictions:
 *   get:
 *     tags:
 *       - Advanced Analytics
 *     summary: Get predictive network insights
 *     description: Retrieves predictions for future network usage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days to predict
 *         default: 7
 *     responses:
 *       200:
 *         description: Predictive insights retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId/predictions', auth, advancedAnalyticsController.getPredictiveInsights);

/**
 * @swagger
 * /api/advanced-analytics/department/{departmentId}/security:
 *   get:
 *     tags:
 *       - Advanced Analytics
 *     summary: Get security recommendations
 *     description: Retrieves security analysis and recommendations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Security recommendations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId/security', auth, advancedAnalyticsController.getSecurityRecommendations);

module.exports = router;

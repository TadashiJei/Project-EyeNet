const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/analytics/most-visited:
 *   get:
 *     tags: [Analytics]
 *     summary: Get most visited websites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Optional department ID to filter results
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Timeframe for the analytics
 *     responses:
 *       200:
 *         description: Successfully retrieved most visited websites
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/most-visited', auth, analyticsController.getMostVisitedWebsites);

/**
 * @swagger
 * /api/analytics/department-usage:
 *   get:
 *     tags: [Analytics]
 *     summary: Get department usage statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Timeframe for the analytics
 *     responses:
 *       200:
 *         description: Successfully retrieved department usage statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/department-usage', auth, analyticsController.getDepartmentUsage);

module.exports = router;

const express = require('express');
const router = express.Router();
const networkMonitoringController = require('../controllers/networkMonitoringController');
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

// Get network statistics
router.get('/stats', networkMonitoringController.getNetworkStats);

// Get network alerts
router.get('/alerts', networkMonitoringController.getNetworkAlerts);

// Get traffic analysis
router.get('/traffic', networkMonitoringController.getTrafficAnalysis);

// Get connected devices
router.get('/devices', networkMonitoringController.getConnectedDevices);

// Get performance metrics
router.get('/performance', networkMonitoringController.getPerformanceMetrics);

module.exports = router;

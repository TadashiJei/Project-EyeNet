const express = require('express');
const networkController = require('../controllers/networkController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get network statistics
router.get('/stats', networkController.getNetworkStats);

// Get traffic analysis
router.get('/traffic', networkController.getTrafficAnalysis);

// Get network alerts
router.get('/alerts', networkController.getNetworkAlerts);

module.exports = router;

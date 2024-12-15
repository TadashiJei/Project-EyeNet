const router = require('express').Router();
const ipController = require('../controllers/ipController');

// Create a new IP
router.route('/').post(ipController.createIP);

// Get all IPs
router.route('/').get(ipController.getAllIPs);

// Get a specific IP by address
router.route('/:address').get(ipController.getIP);

// Update an IP by address
router.route('/:address').patch(ipController.updateIP);

// Delete an IP by address
router.route('/:address').delete(ipController.deleteIP);

module.exports = router;

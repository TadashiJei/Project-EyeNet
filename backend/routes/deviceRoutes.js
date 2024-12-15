const express = require('express');
const { body } = require('express-validator');
const deviceController = require('../controllers/deviceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateDevice = [
    body('name').trim().notEmpty().withMessage('Device name is required'),
    body('type').isIn(['laptop', 'desktop', 'mobile', 'tablet', 'router', 'printer', 'other'])
        .withMessage('Invalid device type'),
    body('ip').trim().notEmpty().withMessage('IP address is required')
        .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/).withMessage('Invalid IP address'),
    body('mac').trim().notEmpty().withMessage('MAC address is required')
        .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).withMessage('Invalid MAC address'),
    body('status').optional().isIn(['online', 'offline', 'idle'])
        .withMessage('Invalid status')
];

// Apply auth middleware to all routes
router.use(auth);

// Get all devices with filtering and pagination
router.get('/', deviceController.getDevices);

// Get device statistics
router.get('/stats', deviceController.getDeviceStats);

// Get specific device
router.get('/:id', deviceController.getDeviceById);

// Create new device
router.post('/', validateDevice, deviceController.createDevice);

// Update device
router.put('/:id', validateDevice, deviceController.updateDevice);

// Update device status
router.patch('/:id/status', deviceController.updateDeviceStatus);

// Delete device
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;

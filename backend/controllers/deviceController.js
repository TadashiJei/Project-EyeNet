const Device = require('../models/Device');
const { validationResult } = require('express-validator');

// Get all devices with filtering and pagination
exports.getDevices = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            type, 
            department,
            search 
        } = req.query;

        const query = {};

        // Apply filters
        if (status) query.status = status;
        if (type) query.type = type;
        if (department) query.department = department;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { ip: { $regex: search, $options: 'i' } },
                { mac: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const devices = await Device.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ lastSeen: -1 });

        // Get total documents
        const count = await Device.countDocuments(query);

        res.json({
            devices,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalDevices: count
        });
    } catch (error) {
        console.error('Error in getDevices:', error);
        res.status(500).json({ message: 'Error fetching devices' });
    }
};

// Get device by ID
exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json(device);
    } catch (error) {
        console.error('Error in getDeviceById:', error);
        res.status(500).json({ message: 'Error fetching device' });
    }
};

// Create new device
exports.createDevice = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const device = new Device(req.body);
        await device.save();
        res.status(201).json(device);
    } catch (error) {
        console.error('Error in createDevice:', error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Device with this IP or MAC address already exists' 
            });
        }
        res.status(500).json({ message: 'Error creating device' });
    }
};

// Update device
exports.updateDevice = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json(device);
    } catch (error) {
        console.error('Error in updateDevice:', error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Device with this IP or MAC address already exists' 
            });
        }
        res.status(500).json({ message: 'Error updating device' });
    }
};

// Delete device
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        console.error('Error in deleteDevice:', error);
        res.status(500).json({ message: 'Error deleting device' });
    }
};

// Get device statistics
exports.getDeviceStats = async (req, res) => {
    try {
        const stats = await Device.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    online: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'online'] }, 1, 0]
                        }
                    },
                    offline: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'offline'] }, 1, 0]
                        }
                    },
                    idle: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'idle'] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const deviceTypes = await Device.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            overview: stats[0] || {
                total: 0,
                online: 0,
                offline: 0,
                idle: 0
            },
            byType: deviceTypes
        });
    } catch (error) {
        console.error('Error in getDeviceStats:', error);
        res.status(500).json({ message: 'Error fetching device statistics' });
    }
};

// Update device status
exports.updateDeviceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['online', 'offline', 'idle'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const device = await Device.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                lastSeen: status === 'offline' ? Date.now() : undefined
            },
            { new: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json(device);
    } catch (error) {
        console.error('Error in updateDeviceStatus:', error);
        res.status(500).json({ message: 'Error updating device status' });
    }
};

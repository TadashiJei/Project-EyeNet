const IP = require('../models/ip.model');

// Create a new IP
exports.createIP = async (req, res) => {
  try {
    const newIP = new IP({
      address: req.body.address,
      department: req.body.department,
      usage: req.body.usage
    });

    const savedIP = await newIP.save();
    res.status(201).json(savedIP);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all IPs
exports.getAllIPs = async (req, res) => {
  try {
    const ips = await IP.find();
    res.json(ips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific IP by address
exports.getIP = async (req, res) => {
  try {
    const ip = await IP.findOne({ address: req.params.address });
    if (!ip) {
      return res.status(404).json({ message: 'IP not found' });
    }
    res.json(ip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an IP by address
exports.updateIP = async (req, res) => {
  try {
    const ip = await IP.findOne({ address: req.params.address });
    if (!ip) {
      return res.status(404).json({ message: 'IP not found' });
    }

    // Update IP fields
    if (req.body.department) {
      ip.department = req.body.department;
    }
    if (req.body.usage) {
      ip.usage = req.body.usage;
    }

    const updatedIP = await ip.save();
    res.json(updatedIP);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an IP by address
exports.deleteIP = async (req, res) => {
  try {
    const ip = await IP.findOneAndDelete({ address: req.params.address });
    if (!ip) {
      return res.status(404).json({ message: 'IP not found' });
    }
    res.json({ message: 'IP deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

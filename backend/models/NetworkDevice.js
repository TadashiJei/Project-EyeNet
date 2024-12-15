const mongoose = require('mongoose');

const networkDeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['laptop', 'desktop', 'mobile', 'tablet', 'server', 'other'],
        default: 'other'
    },
    ip: {
        type: String,
        required: true
    },
    mac: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'idle'],
        default: 'offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    usage: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: 'Unknown'
    },
    owner: {
        type: String,
        default: 'Unknown'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NetworkDevice', networkDeviceSchema);

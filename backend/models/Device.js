const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['laptop', 'desktop', 'mobile', 'tablet', 'router', 'printer', 'other']
    },
    ip: {
        type: String,
        required: true,
        unique: true
    },
    mac: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['online', 'offline', 'idle'],
        default: 'offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    department: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    manufacturer: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: false
    },
    os: {
        type: String,
        required: false
    },
    osVersion: {
        type: String,
        required: false
    },
    uptime: {
        type: Number,
        default: 0
    },
    cpuUsage: {
        type: Number,
        default: 0
    },
    memoryUsage: {
        type: Number,
        default: 0
    },
    diskUsage: {
        type: Number,
        default: 0
    },
    networkUsage: {
        inbound: {
            type: Number,
            default: 0
        },
        outbound: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
deviceSchema.index({ ip: 1 });
deviceSchema.index({ mac: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ type: 1 });
deviceSchema.index({ department: 1 });

module.exports = mongoose.model('Device', deviceSchema);

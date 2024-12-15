const mongoose = require('mongoose');

const networkTrafficSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    protocol: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    bytesIn: {
        type: Number,
        default: 0
    },
    bytesOut: {
        type: Number,
        default: 0
    },
    packets: {
        type: Number,
        default: 0
    },
    responseTime: {
        type: Number,
        default: 0
    },
    errorCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient querying
networkTrafficSchema.index({ timestamp: -1 });
networkTrafficSchema.index({ source: 1, destination: 1 });
networkTrafficSchema.index({ protocol: 1 });

module.exports = mongoose.model('NetworkTraffic', networkTrafficSchema);

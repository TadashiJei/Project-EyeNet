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
    },
    departmentId: {
        type: String,
        required: true
    },
    activeUsers: {
        type: Number,
        default: 0
    },
    activityType: {
        type: String,
        enum: ['streaming', 'meeting', 'download', 'upload', 'browsing', 'other']
    },
    concurrentApplications: {
        type: Number,
        default: 0
    },
    currentBandwidth: {
        type: Number,
        default: 0
    },
    averageBandwidth: {
        type: Number,
        default: 0
    },
    peakBandwidth: {
        type: Number,
        default: 0
    },
    bandwidthTrend: {
        type: Number,
        default: 0
    },
    applicationType: {
        type: String,
        enum: ['video', 'conference', 'file transfer', 'browsing', 'other']
    },
    dataConsumed: {
        type: Number,
        default: 0
    },
    usageFrequency: {
        type: Number,
        default: 0
    },
    allowedApplication: {
        type: Boolean,
        default: true
    },
     latency: {
        type: Number,
        default: 0
    },
    packetLoss: {
        type: Number,
        default: 0
    },
    connectionStability: {
        type: Number,
        default: 1
    },
    forecastDeviation: {
        type: Number,
        default: 0
    },
    usagePattern: {
        type: String,
        default: '{}'
    },
    thresholdExceedance: {
        type: Number,
        default: 0
    },
    bandwidthLimit: {
        type: Number,
        default: 0
    },
    priorityLevel: {
        type: String,
        enum: ['high', 'medium', 'low']
    },
    timeRestriction: {
         type: String,
         default: '{}'
    },
    weatherCondition: {
        type: String
    },
    specialEvent: {
        type: String
    },
    networkUpgrade: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient querying
networkTrafficSchema.index({ timestamp: -1 });
networkTrafficSchema.index({ source: 1, destination: 1 });
networkTrafficSchema.index({ protocol: 1 });
networkTrafficSchema.index({ departmentId: 1 });

module.exports = mongoose.model('NetworkTraffic', networkTrafficSchema);

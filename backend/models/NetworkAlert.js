const mongoose = require('mongoose');

const networkAlertSchema = new mongoose.Schema({
    severity: {
        type: String,
        enum: ['critical', 'warning', 'info', 'success'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NetworkDevice'
    },
    resolved: {
        type: Boolean,
        default: false
    },
    resolvedAt: {
        type: Date
    },
    resolvedBy: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient querying
networkAlertSchema.index({ severity: 1, createdAt: -1 });
networkAlertSchema.index({ deviceId: 1 });

module.exports = mongoose.model('NetworkAlert', networkAlertSchema);

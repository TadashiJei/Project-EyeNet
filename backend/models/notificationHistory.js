const mongoose = require('mongoose');

const notificationHistorySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['email', 'discord'],
        required: true
    },
    template: {
        type: String,
        required: true
    },
    recipients: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['success', 'failure'],
        required: true
    },
    error: {
        type: String
    },
    metrics: {
        type: mongoose.Schema.Types.Mixed
    },
    conditions: [{
        metric: String,
        operator: String,
        value: mongoose.Schema.Types.Mixed,
        actualValue: mongoose.Schema.Types.Mixed
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient querying
notificationHistorySchema.index({ type: 1, createdAt: -1 });
notificationHistorySchema.index({ status: 1 });
notificationHistorySchema.index({ 'recipients': 1 });

module.exports = mongoose.model('NotificationHistory', notificationHistorySchema);

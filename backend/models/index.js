const mongoose = require('mongoose');

// Department Schema
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    allowedIPs: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
            },
            message: props => `${props.value} is not a valid IP address!`
        }
    }],
    networkQuota: {
        daily: {
            type: Number,
            default: 1024 * 1024 * 1024 // 1GB in bytes
        },
        monthly: {
            type: Number,
            default: 30 * 1024 * 1024 * 1024 // 30GB in bytes
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    securityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Network Usage Schema
const networkUsageSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
            },
            message: props => `${props.value} is not a valid IP address!`
        }
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    bytesUsed: {
        type: Number,
        required: true,
        min: 0
    },
    websiteVisited: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['work', 'social', 'streaming', 'other'],
        default: 'other'
    }
});

// IP Address Schema
const ipAddressSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
            },
            message: props => `${props.value} is not a valid IP address!`
        }
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'restricted', 'blocked'],
        default: 'active'
    },
    restrictions: [{
        type: String,
        trim: true
    }],
    lastActive: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add pre-save hooks and indexes
[departmentSchema, networkUsageSchema, ipAddressSchema].forEach(schema => {
    schema.pre('save', function(next) {
        this.updatedAt = new Date();
        next();
    });
});

// Create indexes
departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ status: 1 });
departmentSchema.index({ managerId: 1 });

networkUsageSchema.index({ departmentId: 1, timestamp: -1 });
networkUsageSchema.index({ ipAddress: 1, timestamp: -1 });
networkUsageSchema.index({ category: 1 });

ipAddressSchema.index({ ipAddress: 1 }, { unique: true });
ipAddressSchema.index({ departmentId: 1 });
ipAddressSchema.index({ status: 1 });

// Export models
module.exports = {
    Department: mongoose.model('Department', departmentSchema),
    NetworkUsage: mongoose.model('NetworkUsage', networkUsageSchema),
    IPAddress: mongoose.model('IPAddress', ipAddressSchema)
};

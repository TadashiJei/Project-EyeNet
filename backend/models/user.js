const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    notificationPreferences: {
        email: {
            enabled: { type: Boolean, default: true },
            frequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'immediate' },
            minSeverity: { type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'warning' }
        },
        discord: {
            enabled: { type: Boolean, default: false },
            webhookUrl: { type: String },
            minSeverity: { type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'error' }
        }
    },
    lastLogin: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Update lastLogin
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Get user's notification settings
userSchema.methods.getNotificationSettings = function() {
    return {
        email: this.notificationPreferences.email,
        discord: this.notificationPreferences.discord
    };
};

// Check if user should receive notification
userSchema.methods.shouldReceiveNotification = function(severity) {
    const severityLevels = {
        'info': 0,
        'warning': 1,
        'error': 2,
        'critical': 3
    };

    const emailMinSeverity = severityLevels[this.notificationPreferences.email.minSeverity];
    const discordMinSeverity = severityLevels[this.notificationPreferences.discord.minSeverity];
    const notificationSeverity = severityLevels[severity];

    return {
        email: this.notificationPreferences.email.enabled && notificationSeverity >= emailMinSeverity,
        discord: this.notificationPreferences.discord.enabled && notificationSeverity >= discordMinSeverity
    };
};

const User = mongoose.model('User', userSchema);

module.exports = User;

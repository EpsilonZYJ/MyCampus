const mongoose = require('mongoose');

// 跑腿员档案子模式
const runnerProfileSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['ONLINE', 'OFFLINE', 'DELIVERING'],
        default: 'OFFLINE'
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 0,
        max: 5
    },
    totalOrdersCompleted: {
        type: Number,
        default: 0
    },
    idCardNumber: String,
    healthCertificateUrl: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    runnerSince: {
        type: Date,
        default: Date.now
    },
    totalEarnings: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        get: v => v ? parseFloat(v.toString()) : 0
    }
}, { _id: false });

// 地址子模式
const addressSchema = new mongoose.Schema({
    addressId: {
        type: String,
        default: () => require('crypto').randomUUID()
    },
    name: {
        type: String,
        required: true
    },
    building: {
        type: String,
        required: true
    },
    room: String,
    notes: String,
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    student_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatarUrl: {
        type: String,
        default: '/opt/app/images/user_avatars/default.png'
    },
    balance: {
        type: Number,
        default: 0.0
    },
    roles: {
        type: [String],
        default: ['ROLE_STUDENT']
    },
    runnerProfile: runnerProfileSchema,
    addresses: [addressSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: Date
});

// 添加索引
userSchema.index({ roles: 1 });

// 启用 getter
userSchema.set('toJSON', { getters: true });
userSchema.set('toObject', { getters: true });

module.exports = mongoose.model('User', userSchema, 'tb_user');

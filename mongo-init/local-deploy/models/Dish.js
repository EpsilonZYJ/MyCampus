const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    dish_name: {
        type: String,
        required: true,
        trim: true
    },
    restaurant: {
        type: String,
        required: true,
        trim: true
    },
    image_data: {
        type: String,
        required: true
    },
    image_type: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    review_count: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// 添加索引
dishSchema.index({ dish_name: 1, restaurant: 1 });
dishSchema.index({ restaurant: 1 });
dishSchema.index({ category: 1 });
dishSchema.index({ price: 1 });
dishSchema.index({ rating: -1 });
dishSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Dish', dishSchema, 'tb_dish');

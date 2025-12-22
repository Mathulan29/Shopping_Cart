const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category_id: {
        type: Number,
        required: true,
        ref: 'Category', // Optional: if you want populating later, though we are using manual id matching for now based on mock data
    },
    image_url: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);

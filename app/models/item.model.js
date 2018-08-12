const mongoose = require('mongoose');
//LOCAL
const storeModel = require('../models/store.model');

const itemSchema = mongoose.Schema(
    {
        product_id: { type: String, required: true},
        name: { type: String, required: true, text: true },
        subcategory: { type: String, required: true, text: true },
        category: { type: String, required: true, text: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: false, default: 0 },
        priority: { type: Number, required: false, default: 0 },
        store: { type: storeModel.schema, required: true },
        rating: { type: Number, required: false, default: 5 },
        image: { type: String, required: false, default: '' },
        order_count: { type: Number, required: false, default: 0 }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Item', itemSchema);
const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
    {
        uid: { type: String, required: true },
        name: { type: String, required: true, text: true },
        category: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        image: { type: String, required: false, default: '' },
        delivery_distance_threshold: { type: Number, required: false, default: 3 },
        extra_distance_unit_cost: { type: Number, required: false, default: 6 },
        account_number: { type: String, required: false, default: null },
        account_holder_name: { type: String, required: false, default: null },
        ifsc: { type: String, required: false, default: null },
        rating: { type: Number, required: false, default: 5 }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Store', storeSchema);
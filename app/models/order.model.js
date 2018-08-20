const mongoose = require('mongoose');
//LOCAL
const itemModel = require('./item.model');
const customerModel = require('./customer.model');

const orderSchema = mongoose.Schema(
    {
        delivery_location_latitude: { type: Number, required: true },
        delivery_location_longitude: { type: Number, required: true },
        customer: { type: customerModel.schema, required: true },
        items: { type: [itemModel.schema], required: true },
        status: { type: String, required: false, default: 'WAIT' },
        transaction_id: { type: String, required: false, default: null }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);
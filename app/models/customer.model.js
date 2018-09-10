const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
    {
        uid: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        image: { type: String, required: false, default: '' },
        phone: { type: String, required: false },
        account_number: { type: String, required: false, default: null },
        account_holder_name: { type: String, required: false, default: null },
        ifsc: { type: String, required: false, default: null }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Customer', customerSchema);
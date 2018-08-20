const mongoose = require('mongoose');

const searchModel = mongoose.Schema(
    {
        name: { type: String, required: true },
        count: { type: Number, required: false, default: 0 }   
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Search', searchModel);
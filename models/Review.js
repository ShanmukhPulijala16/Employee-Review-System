const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: {
        type: String
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const reviewModel = mongoose.model('Review', reviewSchema);
module.exports = reviewModel;
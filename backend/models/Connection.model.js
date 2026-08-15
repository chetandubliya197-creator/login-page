const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'connected', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Ensure a user cannot send multiple requests to the same person
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Connection = mongoose.model('Connection', connectionSchema);
module.exports = Connection;

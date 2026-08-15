const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);

const PrivateMessage = require('../models/PrivateMessage.model');
const User = require('../models/User.model');

// @desc    Get all private messages for the current user
// @route   GET /api/private-chat
// @access  Private
const getMyPrivateMessages = async (req, res) => {
    try {
        const messages = await PrivateMessage.find({
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        // Filter out messages from blocked users
        const blockedUsers = req.user.blockedUsers || [];
        const blockedStr = blockedUsers.map(id => id.toString());

        const filteredMessages = messages.filter(msg => {
            const otherUserId = msg.senderId.toString() === req.user._id.toString() ? msg.receiverId.toString() : msg.senderId.toString();
            return !blockedStr.includes(otherUserId);
        });

        // Format to match frontend structure
        const formattedMessages = filteredMessages.map(msg => ({
            id: msg._id,
            senderId: msg.senderId,
            receiverId: msg.receiverId, // IMPORTANT: always include for E2EE key
            conversationId: msg.senderId.toString() === req.user._id.toString() ? msg.receiverId : msg.senderId,
            text: msg.text,
            isEdited: msg.isEdited,
            read: msg.read,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json(formattedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMyPrivateMessages
};

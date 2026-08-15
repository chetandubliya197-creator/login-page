const Message = require('../models/Message.model');

// @desc    Get global chat messages
// @route   GET /api/chat/global
// @access  Private
const getGlobalMessages = async (req, res) => {
    try {
        // Fetch last 50 messages, oldest to newest
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('senderId', 'name anonUsername avatar isOnline')
            .lean();

        // Reverse to get oldest first for chat flow
        const formattedMessages = messages.reverse().map(msg => ({
            id: msg._id.toString(),
            senderId: msg.senderId._id.toString(),
            senderInfo: msg.senderId, // for frontend easy access
            text: msg.text,
            attachment: msg.attachment,
            replyToId: msg.replyToId ? msg.replyToId.toString() : null,
            isEdited: msg.isEdited,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: msg.reactions.map(r => ({
                emoji: r.emoji,
                userId: r.userId.toString()
            }))
        }));

        res.json(formattedMessages);
    } catch (error) {
        console.error('Error fetching global messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getGlobalMessages
};

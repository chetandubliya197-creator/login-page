const User = require('../models/User.model');
const Connection = require('../models/Connection.model');
const Notification = require('../models/Notification.model');

// @desc    Get all students for discover page (with connection status)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Fetch all users except the current one
        const users = await User.find({ _id: { $ne: currentUserId } }).select('-password');
        
        // Fetch all connections involving the current user
        const connections = await Connection.find({
            $or: [
                { requester: currentUserId },
                { recipient: currentUserId }
            ]
        });

        // Map users and inject connectionStatus relative to the current user
        const usersWithStatus = users.map(user => {
            const userObj = user.toObject();
            
            // Map MongoDB _id to id for frontend compatibility
            userObj.id = userObj._id.toString();
            
            // Default status
            userObj.connectionStatus = 'not_connected';

            // Find if there's a connection between currentUserId and this user
            const connection = connections.find(c => 
                c.requester.toString() === userObj.id || c.recipient.toString() === userObj.id
            );

            if (connection) {
                if (connection.status === 'connected') {
                    userObj.connectionStatus = 'connected';
                } else if (connection.status === 'pending') {
                    // If current user is the requester, it's pending for them
                    // If current user is recipient, we can still show pending or 'received_request'
                    // For now, frontend just uses 'pending'
                    userObj.connectionStatus = 'pending';
                }
            }

            return userObj;
        });

        res.json(usersWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

// @desc    Send a connection request
// @route   POST /api/users/connect/:id
// @access  Private
const sendConnectionRequest = async (req, res) => {
    try {
        const requesterId = req.user._id;
        const recipientId = req.params.id;

        if (requesterId.toString() === recipientId) {
            return res.status(400).json({ message: 'Cannot connect with yourself' });
        }

        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({ message: 'Connection already exists or is pending' });
        }

        // Create new connection
        const newConnection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        // Create notification for recipient
        await Notification.create({
            recipient: recipientId,
            sender: requesterId,
            type: 'connection_request',
            message: `${req.user.name} sent you a connection request.`
        });

        res.status(201).json({ message: 'Connection request sent', connection: newConnection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error sending request' });
    }
};

// @desc    Accept a connection request
// @route   POST /api/users/accept/:id
// @access  Private
const acceptConnectionRequest = async (req, res) => {
    try {
        const recipientId = req.user._id;
        const requesterId = req.params.id; // ID of the user who sent the request

        const connection = await Connection.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        connection.status = 'connected';
        await connection.save();

        // Notify the requester
        await Notification.create({
            recipient: requesterId,
            sender: recipientId,
            type: 'connection_accepted',
            message: `${req.user.name} accepted your connection request.`
        });

        res.json({ message: 'Connection accepted', connection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error accepting request' });
    }
};

// @desc    Reject/Cancel a connection request
// @route   POST /api/users/reject/:id
// @access  Private
const rejectConnectionRequest = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const otherUserId = req.params.id;

        const connection = await Connection.findOneAndDelete({
            $or: [
                { requester: currentUserId, recipient: otherUserId },
                { requester: otherUserId, recipient: currentUserId }
            ]
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        res.json({ message: 'Connection removed/rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error rejecting request' });
    }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort('-createdAt')
            .limit(20);
        
        // Map _id to id
        const formatted = notifications.map(n => ({
            id: n._id.toString(),
            type: n.type,
            message: n.message,
            read: n.read,
            time: n.createdAt,
            senderId: n.sender ? n.sender.toString() : null
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

module.exports = {
    getAllUsers,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getNotifications
};

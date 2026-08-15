const User = require('../models/User.model');
const Message = require('../models/Message.model');

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle user suspension
// @route   POST /api/admin/users/:id/toggle-suspend
// @access  Private/Admin
const toggleSuspendUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot suspend an admin' });
        }

        user.isSuspended = !user.isSuspended;
        await user.save();

        res.json({ message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete any global message
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
const deleteGlobalMessageAdmin = async (req, res) => {
    try {
        const msg = await Message.findByIdAndDelete(req.params.id);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message deleted by admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAdminUsers,
    toggleSuspendUser,
    deleteGlobalMessageAdmin
};

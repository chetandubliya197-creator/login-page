const User = require('../models/User.model');

const adminProtect = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user attached' });
        }
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { adminProtect };

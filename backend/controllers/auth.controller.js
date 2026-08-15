const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, collegeId, password } = req.body;

        if (!name || !email || !collegeId || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { collegeId }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with that email or college ID' });
        }

        const user = new User({
            name,
            email,
            collegeId,
            password
        });
        
        user.anonUsername = user.generateAnonUsername();
        await user.save();

        if (user) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                collegeId: user.collegeId,
                anonUsername: user.anonUsername,
                avatar: user.avatar,
                isOnboarded: user.isOnboarded,
                token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { emailOrId, password } = req.body;

        if (!emailOrId || !password) {
            return res.status(400).json({ message: 'Please provide email/college ID and password' });
        }

        // Find user by email or collegeId
        const user = await User.findOne({ 
            $or: [{ email: emailOrId.toLowerCase() }, { collegeId: emailOrId.toUpperCase() }] 
        });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                collegeId: user.collegeId,
                anonUsername: user.anonUsername,
                avatar: user.avatar,
                bio: user.bio,
                branch: user.branch,
                year: user.year,
                interests: user.interests,
                isOnboarded: user.isOnboarded,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                collegeId: user.collegeId,
                anonUsername: user.anonUsername,
                avatar: user.avatar,
                bio: user.bio,
                branch: user.branch,
                year: user.year,
                interests: user.interests,
                isOnboarded: user.isOnboarded
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Complete onboarding
// @route   PUT /api/auth/onboarding
// @access  Private
const completeOnboarding = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.branch = req.body.branch || user.branch;
            user.year = req.body.year || user.year;
            user.bio = req.body.bio || user.bio;
            user.interests = req.body.interests || user.interests;
            user.isOnboarded = true;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                anonUsername: updatedUser.anonUsername,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio,
                branch: updatedUser.branch,
                year: updatedUser.year,
                interests: updatedUser.interests,
                isOnboarded: updatedUser.isOnboarded,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    completeOnboarding
};

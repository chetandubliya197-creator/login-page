const User = require('../models/User.model');
const Otp = require('../models/Otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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
        const { name, email, collegeId, password, otp } = req.body;

        if (!name || !email || !collegeId || !password || !otp) {
            return res.status(400).json({ message: 'Please provide all fields including OTP' });
        }

        // Verify OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
        }
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
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
            // Delete OTP after successful registration
            await Otp.deleteOne({ email });

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

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email, type = 'register' } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const userExists = await User.findOne({ email });

        if (type === 'register' && userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        if (type === 'reset' && !userExists) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this email
        await Otp.deleteOne({ email });

        // Save new OTP
        await Otp.create({
            email,
            otp
        });

        // Send Email via Google Apps Script Web App
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
        
        if (!scriptUrl) {
            console.error('GOOGLE_SCRIPT_URL is missing in environment variables');
            return res.status(500).json({ message: 'Email service configuration missing.' });
        }

        const response = await axios.post(scriptUrl, JSON.stringify({ email, otp }), {
            headers: {
                'Content-Type': 'text/plain',
            },
            maxRedirects: 5
        });

        const result = response.data;

        if (result.success) {
            res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            console.error('GAS Error:', result.error);
            res.status(500).json({ message: 'Failed to send OTP. Google Script error.', error: result.error });
        }

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message, stack: error.stack });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
        }
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password manually since pre('save') only handles if isModified, but we can just set it and save
        user.password = newPassword;
        await user.save(); // The pre('save') hook will hash it!

        // Delete OTP
        await Otp.deleteOne({ email });

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error resetting password' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    completeOnboarding,
    sendOtp,
    resetPassword
};

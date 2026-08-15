const User = require('../models/User.model');
const Otp = require('../models/Otp.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Nodemailer transporter setup
// User needs to provide EMAIL_USER and EMAIL_PASS in .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
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

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CampusPulse - Your Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome to CampusPulse!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please check your email configuration.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    completeOnboarding,
    sendOtp
};

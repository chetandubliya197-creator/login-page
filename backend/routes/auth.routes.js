const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserProfile, 
    completeOnboarding,
    sendOtp 
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/send-otp', sendOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/onboarding').put(protect, completeOnboarding);

module.exports = router;

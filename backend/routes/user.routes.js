const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getNotifications
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getAllUsers);
router.route('/notifications').get(protect, getNotifications);
router.route('/connect/:id').post(protect, sendConnectionRequest);
router.route('/accept/:id').post(protect, acceptConnectionRequest);
router.route('/reject/:id').post(protect, rejectConnectionRequest);

module.exports = router;

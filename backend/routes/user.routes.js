const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getNotifications,
    blockUser,
    reportUser
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getAllUsers);
router.route('/notifications').get(protect, getNotifications);
router.route('/connect/:id').post(protect, sendConnectionRequest);
router.route('/accept/:id').post(protect, acceptConnectionRequest);
router.route('/reject/:id').post(protect, rejectConnectionRequest);
router.route('/:id/block').post(protect, blockUser);
router.route('/:id/report').post(protect, reportUser);

module.exports = router;

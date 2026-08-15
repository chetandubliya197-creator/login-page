const express = require('express');
const router = express.Router();
const { getGlobalMessages } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/global').get(protect, getGlobalMessages);

module.exports = router;

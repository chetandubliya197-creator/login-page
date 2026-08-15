const express = require('express');
const router = express.Router();
const { getMyPrivateMessages } = require('../controllers/privateChat.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getMyPrivateMessages);

module.exports = router;

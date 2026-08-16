const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createGroup, getGroups, getGroupMessages } = require('../controllers/group.controller');

router.use(protect); // All group routes require authentication

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:groupId/messages', getGroupMessages);

module.exports = router;

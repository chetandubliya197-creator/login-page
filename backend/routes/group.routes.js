const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createGroup, getGroups, getGroupMessages, leaveGroup, deleteGroup } = require('../controllers/group.controller');

router.use(protect); // All group routes require authentication

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:groupId/messages', getGroupMessages);
router.post('/:groupId/leave', leaveGroup);
router.delete('/:groupId', deleteGroup);

module.exports = router;

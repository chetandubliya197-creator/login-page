const express = require('express');
const router = express.Router();
const { getAdminUsers, toggleSuspendUser, deleteGlobalMessageAdmin } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminProtect } = require('../middleware/admin.middleware');

router.use(protect);
router.use(adminProtect);

router.route('/users').get(getAdminUsers);
router.route('/users/:id/toggle-suspend').post(toggleSuspendUser);
router.route('/messages/:id').delete(deleteGlobalMessageAdmin);

module.exports = router;

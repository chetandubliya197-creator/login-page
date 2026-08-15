const express = require('express');
const router = express.Router();
const { getSocieties, toggleJoinSociety, getAnnouncements, createAnnouncement, createSociety } = require('../controllers/society.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .get(getSocieties)
    .post(createSociety);
router.route('/announcements').get(getAnnouncements);
router.route('/:id/toggle-join').post(toggleJoinSociety);
router.route('/:id/announcements').post(createAnnouncement);

module.exports = router;

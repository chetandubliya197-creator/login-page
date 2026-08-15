const express = require('express');
const router = express.Router();
const { createPost, getPosts, toggleLike, deletePost } = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .get(getPosts)
    .post(createPost);

router.route('/:id/like').post(toggleLike);
router.route('/:id').delete(deletePost);

module.exports = router;

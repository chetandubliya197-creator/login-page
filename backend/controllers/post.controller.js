const Post = require('../models/Post.model');
const User = require('../models/User.model');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const post = await Post.create({
            author: req.user._id,
            content: content.trim()
        });

        const populatedPost = await post.populate('author', 'name avatar role branch year');
        
        // Format to match frontend expectations
        const formatted = {
            id: populatedPost._id.toString(),
            author: populatedPost.author.name,
            authorId: populatedPost.author._id.toString(),
            role: populatedPost.author.role === 'admin' ? 'Founder' : `${populatedPost.author.branch}, ${populatedPost.author.year}`,
            avatar: populatedPost.author.avatar,
            content: populatedPost.content,
            time: 'Just now', // frontend can parse actual Date
            createdAt: populatedPost.createdAt,
            likes: [],
            comments: []
        };

        res.status(201).json(formatted);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error creating post' });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name avatar role branch year')
            .populate('comments.author', 'name avatar');

        const formatted = posts.map(post => {
            const timeDiff = Date.now() - new Date(post.createdAt).getTime();
            let timeStr = 'Just now';
            if (timeDiff > 86400000) {
                timeStr = Math.floor(timeDiff / 86400000) + 'd ago';
            } else if (timeDiff > 3600000) {
                timeStr = Math.floor(timeDiff / 3600000) + 'h ago';
            } else if (timeDiff > 60000) {
                timeStr = Math.floor(timeDiff / 60000) + 'm ago';
            }

            return {
                id: post._id.toString(),
                author: post.author.name,
                authorId: post.author._id.toString(),
                role: post.author.role === 'admin' ? 'Founder / Admin' : `${post.author.branch}, ${post.author.year}`,
                avatar: post.author.avatar,
                content: post.content,
                time: timeStr,
                createdAt: post.createdAt,
                likes: post.likes.map(id => id.toString()),
                comments: post.comments.map(c => ({
                    id: c._id.toString(),
                    author: c.author.name,
                    avatar: c.author.avatar,
                    text: c.text,
                    createdAt: c.createdAt
                }))
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
};

// @desc    Like or Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const index = post.likes.indexOf(req.user._id);
        if (index > -1) {
            post.likes.splice(index, 1);
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ likes: post.likes.map(id => id.toString()) });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error toggling like' });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Admin or Author)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is author or admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error deleting post' });
    }
};

module.exports = {
    createPost,
    getPosts,
    toggleLike,
    deletePost
};

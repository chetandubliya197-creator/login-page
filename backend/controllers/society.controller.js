const Society = require('../models/Society.model');
const Announcement = require('../models/Announcement.model');

// @desc    Get all societies with member count and joined status
// @route   GET /api/societies
// @access  Private
const getSocieties = async (req, res) => {
    try {
        const societies = await Society.find({});
        
        const formatted = societies.map(soc => {
            return {
                id: soc._id.toString(),
                name: soc.name,
                description: soc.description,
                icon: soc.icon,
                membersCount: soc.members.length,
                joined: soc.members.includes(req.user._id)
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching societies' });
    }
};

// @desc    Toggle join/leave a society
// @route   POST /api/societies/:id/toggle-join
// @access  Private
const toggleJoinSociety = async (req, res) => {
    try {
        const society = await Society.findById(req.params.id);
        if (!society) {
            return res.status(404).json({ message: 'Society not found' });
        }

        const memberIndex = society.members.indexOf(req.user._id);
        let joined = false;

        if (memberIndex > -1) {
            // Leave
            society.members.splice(memberIndex, 1);
        } else {
            // Join
            society.members.push(req.user._id);
            joined = true;
        }

        await society.save();

        res.json({ message: joined ? 'Joined society' : 'Left society', joined, membersCount: society.members.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error toggling society membership' });
    }
};

// @desc    Get all announcements
// @route   GET /api/societies/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        
        const formatted = announcements.map(ann => {
            const timeDiff = Date.now() - new Date(ann.createdAt).getTime();
            let dateStr = 'Today';
            if (timeDiff > 86400000 * 2) {
                dateStr = '2 days ago';
            } else if (timeDiff > 86400000) {
                dateStr = 'Yesterday';
            }

            return {
                id: ann._id.toString(),
                societyId: ann.societyId.toString(),
                title: ann.title,
                text: ann.text,
                date: dateStr,
                isPinned: ann.isPinned
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching announcements' });
    }
};

// @desc    Create an announcement (Admin/President only)
// @route   POST /api/societies/:id/announcements
// @access  Private
const createAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can post society announcements currently' });
        }

        const { title, text, isPinned } = req.body;
        if (!title || !text) {
            return res.status(400).json({ message: 'Title and text are required' });
        }

        const society = await Society.findById(req.params.id);
        if (!society) {
            return res.status(404).json({ message: 'Society not found' });
        }

        const ann = await Announcement.create({
            societyId: society._id,
            title,
            text,
            isPinned: isPinned || false
        });

        res.status(201).json({
            id: ann._id.toString(),
            societyId: ann.societyId.toString(),
            title: ann.title,
            text: ann.text,
            date: 'Just now',
            isPinned: ann.isPinned
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating announcement' });
    }
};

// @desc    Create a new society (Admin only)
// @route   POST /api/societies
// @access  Private
const createSociety = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can create societies' });
        }

        const { name, description, icon } = req.body;
        if (!name || !description || !icon) {
            return res.status(400).json({ message: 'Name, description, and icon are required' });
        }

        const society = await Society.create({
            name,
            description,
            icon,
            members: []
        });

        res.status(201).json({
            id: society._id.toString(),
            name: society.name,
            description: society.description,
            icon: society.icon,
            membersCount: 0,
            joined: false
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating society' });
    }
};

module.exports = {
    getSocieties,
    toggleJoinSociety,
    getAnnouncements,
    createAnnouncement,
    createSociety
};

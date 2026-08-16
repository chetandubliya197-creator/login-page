const GroupChat = require('../models/GroupChat.model');
const GroupMessage = require('../models/GroupMessage.model');
const User = require('../models/User.model');

exports.createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        
        if (!name || !members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ message: 'Name and members are required' });
        }

        // Add creator to members if not already included
        const groupMembers = [...new Set([...members, req.user._id.toString()])];

        const newGroup = await GroupChat.create({
            name,
            createdBy: req.user._id,
            admins: [req.user._id],
            members: groupMembers
        });

        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({ message: 'Error creating group' });
    }
};

exports.getGroups = async (req, res) => {
    try {
        const groups = await GroupChat.find({
            members: req.user._id
        }).sort({ updatedAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.error('Fetch groups error:', error);
        res.status(500).json({ message: 'Error fetching groups' });
    }
};

exports.getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const group = await GroupChat.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not a member of this group' });
        }

        const messages = await GroupMessage.find({ groupId })
            .sort({ createdAt: 1 })
            .limit(100);

        res.status(200).json(messages);
    } catch (error) {
        console.error('Fetch group messages error:', error);
        res.status(500).json({ message: 'Error fetching group messages' });
    }
};

exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await GroupChat.findById(groupId);
        
        if (!group) return res.status(404).json({ message: 'Group not found' });
        
        // Remove user from members
        group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
        
        if (group.members.length === 0) {
            // Delete group if no members left
            await GroupChat.findByIdAndDelete(groupId);
            await GroupMessage.deleteMany({ groupId });
            return res.status(200).json({ message: 'Group deleted as it has no members left', deleted: true });
        }
        
        await group.save();
        res.status(200).json({ message: 'Successfully left group', group });
    } catch (error) {
        console.error('Leave group error:', error);
        res.status(500).json({ message: 'Error leaving group' });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await GroupChat.findById(groupId);
        
        if (!group) return res.status(404).json({ message: 'Group not found' });
        
        if (group.createdBy.toString() !== req.user._id.toString() && !group.admins.includes(req.user._id)) {
            return res.status(403).json({ message: 'Only admins can delete the group' });
        }
        
        await GroupChat.findByIdAndDelete(groupId);
        await GroupMessage.deleteMany({ groupId });
        
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Delete group error:', error);
        res.status(500).json({ message: 'Error deleting group' });
    }
};

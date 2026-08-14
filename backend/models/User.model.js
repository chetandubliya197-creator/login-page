const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z]+\.[a-zA-Z]+[a-zA-Z]+[0-9]+@indoreinstitute\.com$/, 'Please use a valid @indoreinstitute.com email address']
    },
    collegeId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    anonUsername: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String,
        default: function() {
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name}`;
        }
    },
    branch: {
        type: String,
        default: 'Not specified'
    },
    year: {
        type: String,
        default: 'Not specified'
    },
    bio: {
        type: String,
        maxlength: 160,
        default: ''
    },
    interests: {
        type: [String],
        default: []
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    connectionStatus: {
        type: String,
        enum: ['not_connected', 'pending', 'connected'],
        default: 'not_connected'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    reportCount: {
        type: Number,
        default: 0
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate random anon username
userSchema.methods.generateAnonUsername = function() {
    const adjectives = ['Silent', 'Neon', 'Cyber', 'Quantum', 'Shadow', 'Cosmic', 'Stealth', 'Turbo'];
    const nouns = ['Runner', 'Dev', 'Rider', 'Sage', 'Byte', 'Hacker', 'Coder', 'Mind'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 99) + 1;
    return `${randomAdjective}${randomNoun}_${randomNumber}`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

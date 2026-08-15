const mongoose = require('mongoose');
require('dotenv').config();
const Society = require('./models/Society.model');
const Announcement = require('./models/Announcement.model');

const INITIAL_SOCIETIES = [
  { name: 'Coding Society', description: 'Algorithms, Hackathons, Open Source', icon: '💻' },
  { name: 'Robotics Club', description: 'Arduino, Drone design, Hardware fabrication', icon: '🤖' },
  { name: 'Cultural Society', description: 'Music, Drama, Event organisation', icon: '🎭' },
  { name: 'AI & ML Club', description: 'Machine Learning, Data Science, Deep Learning', icon: '🧠' },
  { name: 'CyberSec Club', description: 'Ethical Hacking, CTF, Network Security', icon: '🔐' },
  { name: 'Photography Club', description: 'Campus shoots, Editing, Reels & Shorts', icon: '📸' }
];

const INITIAL_ANNOUNCEMENTS = [
  { title: 'Internal Hackathon Next Week', text: 'Registrations close this Sunday. Prizes up to ₹10K!', isPinned: true },
  { title: 'RoboWars Workshop', text: 'Learn to build line follower bots. Venue: Labs 3, Friday.', isPinned: false },
  { title: 'Guest Lecture — Google Engineer', text: 'Join us this Thursday at 4 PM in Seminar Hall 2. Topic: LLMs in Production.', isPinned: true },
  { title: 'CTF Competition — Register Now', text: 'College inter-CTF starts Friday midnight. Teams of 2-3. Prizes: ₹5K + goodies.', isPinned: false }
];

const seedSocieties = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB for seeding...');
        
        // Check if societies exist
        const count = await Society.countDocuments();
        if (count > 0) {
            console.log('Societies already exist in DB. Skipping seed.');
            process.exit(0);
        }

        const insertedSocieties = await Society.insertMany(INITIAL_SOCIETIES);
        console.log(`Inserted ${insertedSocieties.length} societies.`);

        // Find specific societies for announcements
        const coding = insertedSocieties.find(s => s.name === 'Coding Society');
        const robotics = insertedSocieties.find(s => s.name === 'Robotics Club');
        const ml = insertedSocieties.find(s => s.name === 'AI & ML Club');
        const cyber = insertedSocieties.find(s => s.name === 'CyberSec Club');

        const announcementsToInsert = [
            { societyId: coding._id, ...INITIAL_ANNOUNCEMENTS[0] },
            { societyId: robotics._id, ...INITIAL_ANNOUNCEMENTS[1] },
            { societyId: ml._id, ...INITIAL_ANNOUNCEMENTS[2] },
            { societyId: cyber._id, ...INITIAL_ANNOUNCEMENTS[3] }
        ];

        await Announcement.insertMany(announcementsToInsert);
        console.log('Inserted announcements.');

        console.log('Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedSocieties();

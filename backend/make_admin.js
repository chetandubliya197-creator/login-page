const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.model');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        // Find the first user or change this email to yours
        const user = await User.findOne(); 
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`Successfully made ${user.email} an admin!`);
        } else {
            console.log('No users found in database.');
        }
        
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        mongoose.connection.close();
    }
};

makeAdmin();

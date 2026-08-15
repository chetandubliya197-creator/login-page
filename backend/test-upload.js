const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'chetan@indoreinstitute.com' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Create dummy image
    fs.writeFileSync('dummy.jpg', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));

    const formData = new FormData();
    formData.append('image', fs.createReadStream('dummy.jpg'));

    try {
        const res = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Upload success:', res.data);
    } catch (e) {
        console.error('Upload failed:', e.response ? e.response.data : e.message);
    } finally {
        fs.unlinkSync('dummy.jpg');
        process.exit(0);
    }
}
test();

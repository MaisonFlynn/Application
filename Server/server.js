const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const User = require('./Models/User');

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.CONNECTION)
    .then(async () => {
        console.log('MongoDB Connected');

        // Invalidate Session(s)
        try {
            const result = await User.updateMany({}, { $set: { sessionToken: null, session: null } });
            if (result.modifiedCount > 0) {
                console.log(`Nullified ${result.modifiedCount} Session(s)`);
            } else {
                console.log('NO Session(s)');
            }
        } catch (error) {
            console.error('Nullification Error', error);
        }
    })
    .catch((err) => {
        console.error('MongoDB Disconnected, Error:', err);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve Static File(s) FROM Client Directory
app.use(express.static(path.join(__dirname, '../Client')));

// Import Route(s)
const auth = require('./Routes/auth');
const shop = require('./Routes/shop');

// Use Route(s)
app.use('/auth', auth);
app.use('/shop', shop);

// Load Schedule
require('./Utils/schedule');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ON Port ${PORT}`);
});
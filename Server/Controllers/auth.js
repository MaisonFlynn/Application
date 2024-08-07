const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Config Email Transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Register NEW User
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Validate Input(s)
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'ALL Field(s) Required' });
        }

        // Check IF User Exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: 'Email Exists' });
        }

        // Generate Verification Token
        const token = crypto.randomBytes(32).toString('hex');

        // Create & Save User w/ Verification Token
        const user = new User({
            username,
            email,
            password,
            verificationToken: token,
            registered: new Date()
        });

        // Send Verification Email
        const verificationLink = `http://localhost:3000/index.html?token=${token}`;
        transporter.sendMail({
            to: email,
            subject: 'Email Verification',
            text: `${verificationLink}`
        }, async (err, info) => {
            if (err) {
                console.error('Email Error!', err);
                // TRY TO Resend Email
                try {
                    await transporter.sendMail({
                        to: email,
                        subject: 'Email Verification',
                        text: `${verificationLink}`
                    });
                } catch (error) {
                    console.error('Resend Email Error:', error);
                    return res.status(500).json({ error: 'Email NOT Sent' });
                }
            } else {
                await user.save(); // Save User IF Email Sent
                console.log('Email Sent!', info.response);
            }
        });

        res.status(201).json({ message: 'Registration Successful! Check YOUR Email FOR Verification.' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registraion Error, Please TRY Again' });
    }
};

// Verification
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        // Find User BY Verification Token
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).json({ error: 'Invalid Token' });

        // Update User TO Verified & Remove Verification Token
        user.verified = true;
        user.verificationToken = null;
        await user.save();

        console.log(`${user.email} Verified!`); // Debug

        res.status(200).json({ message: 'Verification Successful! Please Login' });
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ error: 'Verification Error, Please TRY Again' });
    }
};

// Login User
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find User BY Email
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User NOT Found' });

        // Check IF User IS Verified
        console.log('Verified?', user.verified); // Debug
        if (!user.verified) {
            return res.status(403).json({ error: 'Please Verify YOUR Email FIRST' });
        }

        // Validate Password
        const match = await bcrypt.compare(password, user.password);
        console.log('Password(s) Match?', match); // Debug
        if (!match) return res.status(401).json({ error: 'Invalid Credentials' });

        // Check FOR Existing Session Token
        if (user.sessionToken) {
            return res.status(400).json({ error: 'User Logged IN' });
        }

        // Generate & Save Session Token
        user.sessionToken = crypto.randomBytes(64).toString('hex');
        user.session = new Date(); // SET Session Start Date
        await user.save();

        // Generate JWT Token (1 DAY)
        const token = jwt.sign({ userId: user._id }, process.env.KEY, { expiresIn: '1d' });

        // Send Token(s)
        res.json({ token, sessionToken: user.sessionToken });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login Error, Please TRY Again' });
    }
};

// Check IF User Exists (Client)
const checkUserExists = async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error Checking User' });
    }
};

// Logout User
const logout = async (req, res) => {
    const { sessionToken } = req.body;
    try {
        const user = await User.findOne({ sessionToken });
        if (!user) return res.status(403).json({ error: 'Invalid Session Token' });

        // Invalidate Session Token
        user.sessionToken = null;
        user.session = null;
        await user.save();

        res.status(200).json({ message: 'Logged Out Successfully' });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({ error: 'Logout Error, Please TRY Again' });
    }
};

const verifyToken = async (req, res) => {
    const { sessionToken } = req.body;
    try {
        const user = await User.findOne({ sessionToken });
        if (!user) return res.status(403).json({ error: 'Invalid Session Token' });
        res.status(200).json({ message: 'Token Valid' });
    } catch (error) {
        console.error('Token Verification Error:', error);
        res.status(500).json({ error: 'Token Verification Error' });
    }
};

const profile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findById(decoded.userId).select('username coins');
        if (!user) return res.status(404).json({ error: 'User NOT Found' });
        res.status(200).json({ user });
    } catch (error) {
        console.error('Profile Error', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { register, verifyEmail, login, logout, checkUserExists, verifyToken, profile };
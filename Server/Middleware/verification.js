const User = require('../Models/User');

const verification = async (req, res, next) => {
    const sessionToken = req.headers['sessiontoken']; // Ensure this matches the header name used in the client

    if (!sessionToken) {
        return res.status(401).json({ error: 'NO Session Token(s)' });
    }

    try {
        const user = await User.findOne({ sessionToken });
        if (!user) return res.status(403).json({ error: 'Invalid Session Token' });

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error('Session Verification Error:', error);
        res.status(500).json({ error: 'Session Verification Error' });
    }
};

module.exports = verification;

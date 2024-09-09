const User = require('../Models/User');

const verification = async (req, res, next) => {
    const sessionToken = req.headers['sessiontoken'];

    if (!sessionToken) {
        return res.status(401).json({ error: 'NO Session Token(s)' });
    }

    try {
        const user = await User.findOne({ sessionToken });
        if (!user) return res.status(403).json({ error: 'Invalid Session Token' });

        req.user = user;
        next();
    } catch (error) {
        console.error('Session Verification Error:', error);
        res.status(500).json({ error: 'Session Verification Error' });
    }
};

module.exports = verification;

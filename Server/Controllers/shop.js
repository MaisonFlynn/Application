const User = require('../Models/User');

const cost = {
    red: 5,
    green: 5,
    blue: 5,
    bronze: 10,
    silver: 15,
    gold: 20,
    default: 0
};

const color = {
    red: '#FFB3B3',
    green: '#C4E1CC',
    blue: '#B8DBF2',
    bronze: '#D8B8A0',
    silver: '#E0E0E0',
    gold: '#E6BE8A',
    default: '#FFFFFF'
};

const buy = async (req, res) => {
    const { username, item } = req.body;

    if (!cost.hasOwnProperty(item)) {
        return res.status(400).json({ error: 'Invalid Item' });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User NOT Found' });
        }

        if (user.coins < cost[item]) {
            return res.status(400).json({ error: 'Brokie' });
        }

        user.coins -= cost[item];
        user.theme = color[item];
        await user.save();

        res.status(200).json({ coins: user.coins, theme: user.theme });
    } catch (error) {
        console.error('Purchase Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const theme = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User NOT Found' });
        }

        res.status(200).json({ theme: user.theme });
    } catch (error) {
        console.error('Theme Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { buy, theme };
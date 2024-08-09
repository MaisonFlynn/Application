const Wordle = require('../Models/Wordle');

// Get Word
exports.snag = async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        let word = await Wordle.findOne({ date: today });

        if (!word) {
            return res.status(404).json({ error: 'NO Word Today (╥﹏╥)' });
        }

        res.json({ word: word.word });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Gander UPON Guess
exports.gander = async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const word = await Wordle.findOne({ date: today });

        if (!word) {
            return res.status(404).json({ error: 'NO Word Today (╥﹏╥)' });
        }

        const guess = req.body.guess.toLowerCase();

        if (guess.length !== 5) {
            return res.status(400).json({ error: 'NOT Big Enough ಠ‿↼' });
        }

        let result = [];

        for (let i = 0; i < 5; i++) {
            if (guess[i] === word.word[i]) {
                result.push({ letter: guess[i], status: 'correct' }); // Correct Letter & Position
            } else if (word.word.includes(guess[i])) {
                result.push({ letter: guess[i], status: 'present' }); // Correct Letter, Wrong Position
            } else {
                result.push({ letter: guess[i], status: 'abscent' }); // Incorrect Letter
            }
        }

        res.json({ result });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

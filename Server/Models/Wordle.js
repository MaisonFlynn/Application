const mongoose = require('mongoose');

const wordleSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { versionKey: 'version' });

const Wordle = mongoose.model('Wordle', wordleSchema, 'Word');

module.exports = Wordle;
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const User = require('./Models/User');
const Wordle = require('./Models/Wordle');

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.CONNECT)
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

        // Word O' THE Day
        try {
            const today = new Date().setHours(0, 0, 0, 0);
            let word = await Wordle.findOne({ date: today });

            if (!word) {
                // NO Word, NO Worries
                const rando = nab();
                const crisp = new Wordle({ word: rando, date: today });
                await crisp.save();
                word = crisp;

                // Reset Wordle Related User Field(s)
                await User.updateMany({}, { $set: { guesses: [], attempts: null, solved: null, played: null } });

                const chop = word.word;
                const cap = chop.charAt(0).toUpperCase() + chop.slice(1);
                console.log(`Word O' THE Day IS "${cap}"`);
            } else {
                // Word Exists
                const chopped = word.word;
                const capped = chopped.charAt(0).toUpperCase() + chopped.slice(1);
                console.log(`Word O' THE Day IS "${capped}"`);
            }
        } catch (error) {
            console.error('Wordle Hurdle XD', error);
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
const wordle = require('./Routes/wordle');

// Use Route(s)
app.use('/auth', auth);
app.use('/shop', shop);
app.use('/wordle', wordle);

// Load Schedule
require('./Utils/schedule');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ON Port ${PORT}`);
});

// GET Random Word
function nab() {
    const words = [
        "apple", "brave", "chair", "dance", "eagle", "flame", "grape", "heart", "ideal", "joker",
        "knock", "lemon", "melon", "noble", "ocean", "pearl", "quick", "robot", "shark", "tiger",
        "uncle", "vivid", "whale", "xenon", "yacht", "zebra", "adore", "baker", "candy", "dodge",
        "elite", "flock", "globe", "house", "image", "jolly", "kites", "lions", "moose", "ninja",
        "onion", "piano", "queen", "rusty", "smile", "teeth", "unity", "viper", "wings", "xylos",
        "yeast", "zippy", "amber", "blush", "creek", "drake", "event", "frost", "grove", "honey",
        "input", "jelly", "knots", "lunar", "mango", "niche", "opera", "panda", "quack", "razor",
        "salad", "taste", "ultra", "vocal", "woven", "xerox", "yummy", "zones", "argon", "beach",
        "crisp", "drift", "error", "fable", "grasp", "heron", "inbox", "jumpy", "karma", "leech",
        "mirth", "noble", "orbit", "petal", "quilt", "raven", "sable", "trout", "umbra", "viola",
        "witty", "xenon", "youth", "zesty", "acorn", "blaze", "crane", "diver", "ethos", "flick",
        "giant", "hinge", "ideal", "joker", "knack", "latch", "mimic", "noisy", "ovary", "pixel",
        "quilt", "robin", "spear", "tiger", "usher", "vapor", "wrath", "xylem", "yawns", "zebra",
        "arrow", "bison", "cedar", "drill", "eject", "flare", "glint", "humor", "index", "juror",
        "knife", "lever", "molar", "nasty", "olive", "pluck", "quest", "ridge", "sloop", "trope",
        "unity", "vivid", "woven", "xenon", "yield", "zonal", "agent", "bliss", "cider", "dolly",
        "excel", "fable", "grill", "hinge", "ivory", "joker", "kiosk", "lever", "melon", "naive",
        "ocean", "plume", "quail", "ridge", "solar", "trump", "upset", "vixen", "wooly", "xenon",
        "yacht", "zebra", "alter", "brisk", "clash", "delta", "emote", "fancy", "glide", "hover",
        "image", "joust", "knelt", "layer", "magic", "noble", "opera", "point", "quake", "razor",
        "sleek", "torch", "usher", "viper", "wrung", "xylem", "youth", "zesty", "amber", "blaze",
        "crave", "dream", "exult", "frost", "grape", "hatch", "ivory", "joker", "knock", "lemon",
        "mirth", "niche", "ocean", "piano", "quest", "razor", "stork", "trout", "usher", "vocal",
        "wrath", "xenon", "yacht", "zebra", "abode", "blink", "clown", "ditch", "evoke", "flint",
        "globe", "honey", "index", "jolly", "knife", "latch", "mango", "ninja", "onion", "plush",
        "quill", "roast", "slice", "thorn", "upend", "vowel", "wrist", "xerox", "yummy", "zones",
        "axial", "baker", "clerk", "dodge", "exile", "frown", "grail", "haste", "inbox", "jumpy",
        "kudos", "lunar", "mimic", "noisy", "ovoid", "pinto", "quilt", "raven", "smirk", "title",
        "ulcer", "valve", "wince", "xenon", "young", "zippy", "amuse", "bride", "crane", "drone",
        "exact", "flame", "grasp", "hinge", "input", "jelly", "kites", "lions", "mirth", "noble",
        "onset", "piano", "quail", "rebel", "sheer", "torch", "usher", "vocal", "wrath", "xylem",
        "youth", "zesty", "apple", "brisk", "close", "drift", "elite", "flock", "glove", "hoist",
        "ideal", "joust", "knack", "leech", "molar", "niche", "opera", "pearl", "quilt", "round",
        "slick", "thumb", "vivid", "weave", "xerox", "yeast", "zonal"
    ];
    
    return words[Math.floor(Math.random() * words.length)];
}
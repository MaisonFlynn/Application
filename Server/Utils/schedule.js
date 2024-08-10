const cron = require('node-cron');
const User = require('../Models/User');
const Wordle = require('../Models/Wordle');

// Delete NON Verified User(s) IF NOT Verified AFTER 7 DAYS
// Check EVERY Night @ 12AM
cron.schedule('0 0 * * *', async () => {
    console.log('Deleting NON Verified User(s)');
    const expiration = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);  // 7 Day(s)
    try {
        const result = await User.deleteMany({
            verified: false,
            registered: { $lt: expiration }
        });
        console.log(`Deleted ${result.deletedCount} NON Verified User(s)`);
    } catch (error) {
        console.error('Schedule Error', error);
    }
});

// Delete EXPIRED Session(s) IF Older THAN 1 DAY
// Check EVERY Night @ 12AM
cron.schedule('0 0 * * *', async () => {
    console.log('Deleting Expired Session(s)');
    const expiration = new Date(Date.now() - 24 * 60 * 60 * 1000);  // 1 Day
    try {
        const result = await User.updateMany(
            { session: { $lt: expiration } },
            { $unset: { sessionToken: "", session: "" } }
        );
        console.log(`Deleted ${result.nModified} Session(s)`);
    } catch (error) {
        console.error('Schedule Error', error);
    }
});

// SET Random Word
cron.schedule('0 0 * * *', async () => {
    console.log("Plonkin' NEW Word O' THE Day");
    const today = new Date().setHours(0, 0, 0, 0);
    try {
        const rando = nab();
        const crisp = new Wordle({ word: rando, date: today });
        await crisp.save();
        console.log(`New Word of the Day is "${crisp}"`);
    } catch (error) {
        console.error('Wordle Hurdle XD', error);
    }
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
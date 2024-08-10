const express = require('express');
const router = express.Router();
const { snag, gander, bag } = require('../Controllers/wordle');
const verification = require('../Middleware/verification');

router.get('/word', snag);
router.get('/guesses', verification, bag);
router.post('/guess', verification, gander);

module.exports = router;

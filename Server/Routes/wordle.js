const express = require('express');
const router = express.Router();
const { snag, gander } = require('../Controllers/wordle');
const verification = require('../Middleware/verification');

router.get('/word', snag);
router.post('/guess', verification, gander);

module.exports = router;

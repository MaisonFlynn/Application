const express = require('express');
const router = express.Router();
const { snag, gander } = require('../Controllers/wordle');

router.get('/word', snag);
router.post('/guess', gander);

module.exports = router;

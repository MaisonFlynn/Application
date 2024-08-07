const express = require('express');
const { buy, theme } = require('../Controllers/shop');

const router = express.Router();

router.post('/buy', buy);
router.post('/theme', theme);

module.exports = router;
const express = require('express');
const { register, verifyEmail, login, checkUserExists, logout, verifyToken, profile } = require('../Controllers/auth');

const router = express.Router();

router.post('/register', register);
router.get('/verify', verifyEmail);
router.post('/login', login);
router.post('/exists', checkUserExists);
router.post('/logout', logout);
router.post('/token', verifyToken);
router.get('/profile', profile);

module.exports = router;

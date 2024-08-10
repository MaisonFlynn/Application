const express = require('express');
const { register, verifyEmail, login, existence, logout, verifyToken, profile, forgotPassword, resetPassword } = require('../Controllers/auth');

const router = express.Router();

router.post('/register', register);
router.get('/verify', verifyEmail);
router.post('/login', login);
router.post('/exists', existence);
router.post('/logout', logout);
router.post('/token', verifyToken);
router.get('/profile', profile);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

module.exports = router;
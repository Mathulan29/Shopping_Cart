const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    registerPasskeyChallenge,
    registerPasskeyVerify,
    loginPasskeyChallenge,
    loginPasskeyVerify
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // will create next

// Local Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home with token or set cookie
        // For simplicity, we redirect to frontend with a token query param (not most secure but common for simple connect)
        // Better: Render a temporary page that posts message to opener, or set httpOnly cookie.

        // We need to generate token here if not handled by passport callback completely.
        // Let's assume req.user is populated by passport strategy.
        const token = require('jsonwebtoken').sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.redirect(`http://localhost:5173/auth/success?token=${token}`); // Adjust frontend URL
    }
);

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const token = require('jsonwebtoken').sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.redirect(`http://localhost:5173/auth/success?token=${token}`);
    }
);

// Passkey Auth
router.post('/passkey/register-challenge', protect, registerPasskeyChallenge);
router.post('/passkey/register-verify', protect, registerPasskeyVerify);
router.post('/passkey/login-challenge', loginPasskeyChallenge);
router.post('/passkey/login-verify', loginPasskeyVerify);

module.exports = router;

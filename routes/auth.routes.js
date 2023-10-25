const express = require('express');
const passport = require('passport');
const router = express.Router();

// POST login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/cities',
    failureRedirect: '/login',
    failureFlash: true 
}));

// POST register (If you have a registration feature)
router.post('/register', (req, res) => {
    // Handle user registration here
    // Save user to database, handle password hashing, etc.
});

// GET logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// TODO: Add other routes for social logins like Facebook, Google, etc. if needed

module.exports = router;

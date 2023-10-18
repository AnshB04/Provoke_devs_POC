// /routes/auth.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    user.save(err => {
        if (err) return res.render('register', { error: 'User already exists.' });
        res.redirect('/login');
    });
});

module.exports = router;
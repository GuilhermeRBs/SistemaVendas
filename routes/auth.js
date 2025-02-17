const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation/authValidation');

// Register
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).render('register', { error: error.details[0].message });

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('register', { error: 'Email já está em uso.' });
        }
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).render('register', { error: 'Username já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).render('register', { error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).render('login', { error: error.details[0].message });

    const { email, password } = req.body;

    try {
        console.log('Email:', email);
        console.log('Password:', password);

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found');
            return res.status(400).render('login', { error: 'Email ou senha incorreta' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).render('login', { error: 'Email ou senha incorreta' });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).render('login', { error: 'Server error' });
    }
});

module.exports = router;

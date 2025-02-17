const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyToken, verifyAdmin, registerValidation } = require('../validation/authValidation');


// Registra novo usuário (somente Admin)
router.post('/register', verifyToken, verifyAdmin,   async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password, isAdmin } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

        user = new User({ username, email, password: hashedPassword, isAdmin });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
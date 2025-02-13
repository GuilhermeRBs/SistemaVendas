const express = require('express');
const router = express.Router();
const Ingresso = require('../models/Ingresso');
const Compra = require('../models/Compra');
const { verifyToken } = require('../validation/authValidation');

// Purchase ingressos
router.post('/', verifyToken, async (req, res) => {
    const { ingressoId, quantity } = req.body; // Recebe ingressoId e quantity do corpo da requisição
    try {
        const user = req.user;
        const ingresso = await Ingresso.findById(ingressoId);
        if (!ingresso || ingresso.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        ingresso.quantity -= quantity;
        await ingresso.save();
        const compra = new Compra({
            user: user.id,
            ingresso: ingresso.id,
            quantity: quantity,
            date: new Date()
        });
        await compra.save();
        res.status(201).json(compra);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Compra = require('../models/Compra');
const Ingresso = require('../models/Ingresso');
const { verifyToken } = require('../validation/authValidation');

// Comprar Ingresso
router.post('/', verifyToken, async (req, res) => {
    const { ingressoId, quantity } = req.body;
    try {
        const ingresso = await Ingresso.findById(ingressoId);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });

        if (ingresso.quantity < quantity) {
            return res.redirect(`/home?error=Quantidade solicitada excede o estoque disponível`);
        }

        ingresso.quantity -= quantity;
        await ingresso.save();

        const compra = new Compra({
            user: req.user.id,
            ingresso: ingressoId,
            quantity,
            date: new Date()
        });

        await compra.save();
        res.redirect('/home');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
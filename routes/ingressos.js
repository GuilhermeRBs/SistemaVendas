const express = require('express');
const router = express.Router();
const Ingresso = require('../models/Ingresso');
const { verifyToken, verifyAdmin } = require('../validation/authValidation');

// Get all ingressos
router.get('/', async (req, res) => {
    try {
        const ingressos = await Ingresso.find();
        res.render('ingressos', { ingressos: ingressos.map(ingresso => ingresso.toObject()) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) {
            return res.status(404).send('Ingresso not found');
        }
        res.render('ingresso', { ingresso: ingresso.toObject() });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a new ingresso (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const ingresso = new Ingresso({
        nome: req.body.nome,
        preco: req.body.preco,
        data: req.body.data
    });
    try {
        const newIngresso = await ingresso.save();
        res.status(201).json(newIngresso);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an ingresso (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) {
            return res.status(404).json({ message: 'Ingresso not found' });
        }
        ingresso.name = req.body.name;
        ingresso.price = req.body.price;
        ingresso.quantity = req.body.quantity;
        await ingresso.save();
        res.json(ingresso);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an ingresso (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) {
            return res.status(404).json({ message: 'Ingresso not found' });
        }
        await ingresso.remove();
        res.json({ message: 'Ingresso deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
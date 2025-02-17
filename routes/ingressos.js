const express = require('express');
const router = express.Router();
const Ingresso = require('../models/Ingresso');
const { verifyToken, verifyAdmin } = require('../validation/authValidation');


// Read All Ingressos
router.get('/', async (req, res) => {
    try {
        const ingressos = await Ingresso.find();
        res.json(ingressos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Renderizar página de edição de ingresso
router.get('/admin/ingresso/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });
        res.render('edit-ingresso', { ingresso: ingresso.toObject() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Visualizar um ingresso
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });
        res.render('ingresso', { ingresso: ingresso.toObject() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Criar Ingresso
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const { nome, preco, data, quantity } = req.body;
    try {
        const ingresso = new Ingresso({ nome, preco, data, quantity });
        await ingresso.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Atualizar Ingresso
router.post('/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { nome, preco, data, quantity } = req.body;
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });

        ingresso.nome = nome;
        ingresso.preco = preco;
        ingresso.data = data;
        ingresso.quantity = quantity;
        await ingresso.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Ingresso
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });

        await ingresso.remove();
        res.json({ message: 'Ingresso deletado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ingresso: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingresso', required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compra', compraSchema);
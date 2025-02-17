const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const comprasRoutes = require('./routes/compras');
const ingressosRoutes = require('./routes/ingressos');
const Ingresso = require('./models/Ingresso');
const Compra = require('./models/Compra');
const { verifyToken, verifyAdmin } = require('./validation/authValidation');
const moment = require('moment');

const app = express();
const { engine } = require('express-handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dotenv.config();

app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: function (date, format) {
            if (!format || typeof format !== 'string') {
                format = 'YYYY-MM-DD';
            }
            return moment(date).format(format);
        }
    }
}));
app.set('view engine', 'handlebars');

mongoose.connect(process.env.database)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ingressos', ingressosRoutes);
app.use('/api/compras', comprasRoutes);

// Rota para renderizar a página de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para renderizar a página de registro
app.get('/register', (req, res) => {
    res.render('register');
});

// Rota para renderizar a página inicial
app.get('/home', verifyToken, async (req, res) => {
    try {
        const ingressos = await Ingresso.find();
        const totalIngressos = ingressos.reduce((total, ingresso) => total + ingresso.quantity, 0);
        const error = req.query.error;
        res.render('home', { ingressos: ingressos.map(ingresso => ingresso.toObject()), totalIngressos, error });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para renderizar o histórico de compras
app.get('/historico', verifyToken, async (req, res) => {
    try {
        const compras = await Compra.find({ user: req.user.id }).populate('ingresso');
        res.render('historico', { compras: compras.map(compra => compra.toObject()) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para renderizar a visualização de um ingresso
app.get('/ingresso/:id', verifyToken, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });
        res.render('ingresso', { ingresso: ingresso.toObject() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para renderizar a página de administração
app.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ingressos = await Ingresso.find();
        res.render('admin', { ingressos: ingressos.map(ingresso => ingresso.toObject()) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para renderizar a página de edição de ingresso
app.get('/admin/ingresso/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ingresso = await Ingresso.findById(req.params.id);
        if (!ingresso) return res.status(404).json({ message: 'Ingresso não encontrado' });
        res.render('edit-ingresso', { ingresso: ingresso.toObject() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Rota para a página inicial que redireciona para a tela de login se não autenticado
app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
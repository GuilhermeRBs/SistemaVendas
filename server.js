const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const comprasRoutes = require('./routes/compras');
const ingressosRoutes = require('./routes/ingressos');
const Ingresso = require('./models/Ingresso');

const app = express();
const { engine } = require('express-handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

dotenv.config();

app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: function (date) {
            return new Date(date).toLocaleDateString('pt-BR');
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

// Rota para renderizar a página inicial
app.get('/home', async (req, res) => {
    try {
        const ingressos = await Ingresso.find();
        res.render('home', { ingressos: ingressos.map(ingresso => ingresso.toObject()) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
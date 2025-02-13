const Joi = require('joi');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.token; // Obter o token dos cookies
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

function verifyAdmin(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
    next();
}

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        isAdmin: Joi.boolean()
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports = { verifyToken, verifyAdmin, registerValidation, loginValidation };
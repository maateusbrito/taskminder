const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // Importa o middleware de autenticação

const router = express.Router();

// Rota de registro de usuário
router.post('/register', async (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).send({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nome, email, senha: hashedPassword });

        await newUser.save();
        res.status(201).send({ message: 'Usuário registrado com sucesso' });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).send({ message: 'Erro interno do servidor' });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email e senha são obrigatórios' });
    }

    try {
        // Buscar usuário no banco de dados
        console.log('Buscando usuário com email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        // Comparar senhas
        const passwordIsValid = await bcrypt.compare(password, user.senha);
        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: 'Senha inválida' });
        }

        // Gerar token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({
            id: user._id,
            email: user.email,
            accessToken: token
        });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).send({ message: 'Erro interno do servidor' });
    }
});

// Rota para solicitação de redefinição de senha
router.post('/forgot-password', userController.forgotPassword);

// Rota para redefinir senha usando token
router.post('/reset-password/:token', userController.resetPassword);

// Middleware de autenticação para as rotas seguintes
router.use(authMiddleware);

// Rota para obter perfil do usuário
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Ajustado para req.user._id
        if (user) {
            res.json({
                nome: user.nome,
                sobrenome: user.sobrenome,
                email: user.email,
                dataNascimento: user.dataNascimento
            });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Certifique-se de que o caminho está correto
const User = require('../models/User'); // Modelo de usuário

// Middleware de autenticação
router.use(authMiddleware);

// Rota para obter perfil do usuário
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.userId);
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

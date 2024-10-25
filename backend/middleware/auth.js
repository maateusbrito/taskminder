const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Extrai o token do cabeçalho Authorization (Bearer <token>)
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        
        if (!token) {
            console.error('Token não fornecido');
            return res.status(401).json({ message: 'Token não fornecido' });
        }
        
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        // Busca o usuário no banco de dados usando o ID do token
        const user = await User.findById(decoded.userId);
        console.log('User from DB:', user);

        if (!user) {
            console.error('Usuário não encontrado');
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Anexa os dados do usuário ao request
        req.user = user;
        req.userId = decoded.userId; // Configura req.userId para uso nas rotas

        next();
    } catch (error) {
        // Diferencia os erros
        if (error.name === 'TokenExpiredError') {
            console.error('Token expirado:', error.message);
            return res.status(401).json({ message: 'Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Token inválido:', error.message);
            return res.status(401).json({ message: 'Token inválido' });
        } else {
            console.error('Erro na autenticação:', error.message);
            return res.status(401).json({ message: 'Erro ao autenticar o usuário', error: error.message });
        }
    }
};

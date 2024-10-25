const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../clients/emailService'); // Importa o serviço de e-mail

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
  try {
    const { nome, sobrenome, dataNascimento, email, senha } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const newUser = new User({
      nome,
      sobrenome,
      dataNascimento,
      email,
      senha: hashedPassword,
    });

    await newUser.save();

    // Envio do e-mail de boas-vindas
    const mailOptions = {
      to: email,
      subject: 'Bem-vindo ao TaskMinder!',
      text: `Olá ${nome},\n\nObrigado por se cadastrar no TaskMinder. Estamos felizes em tê-lo conosco!\n\nAtenciosamente,\nEquipe TaskMinder`,
    };

    await emailService.sendMail(mailOptions);

    // Enviar resposta
    res.status(201).json({
      user: {
        id: newUser._id,
        nome: newUser.nome,
        sobrenome: newUser.sobrenome,
        email: newUser.email,
      },
      token: jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Função para fazer login do usuário
const loginUser = async (req, res) => {
  try {
    console.log('Request body:', req.body);

    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado:', email);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log('Usuário encontrado:', user);

    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      console.log('Senha incorreta para usuário:', email);
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    console.log('Senha correta');

    // Gerar o token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token gerado:', token);

    // Enviar resposta
    res.json({
      user: {
        id: user._id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


// Função para obter o perfil do usuário autenticado
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-senha');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter perfil do usuário' });
  }
};

// Função para atualizar o perfil do usuário
const updateUserProfile = async (req, res) => {
  const { nome, sobrenome, dataNascimento, email, senha } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.nome = nome || user.nome;
    user.sobrenome = sobrenome || user.sobrenome;
    user.dataNascimento = dataNascimento || user.dataNascimento;
    user.email = email || user.email;

    if (senha) {
      user.senha = await bcrypt.hash(senha, 10);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil do usuário' });
  }
};

// Função para deletar o usuário
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

// Função para solicitar redefinição de senha
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    const resetUrl = `http://localhost:8080/reset-password.html?token=${token}`;
    const mailOptions = {
      to: email,
      subject: 'Redefinição de senha do TaskMinder',
      text: `Você está recebendo este e-mail porque você (ou alguém mais) solicitou a redefinição da senha da sua conta.\n\nClique no link a seguir ou cole no seu navegador para completar o processo dentro de uma hora:\n\n${resetUrl}\n\nSe você não solicitou isso, por favor, ignore este e-mail e sua senha permanecerá inalterada.\n`,
    };

    await emailService.sendMail(mailOptions);

    res.json({ message: 'Link de redefinição de senha enviado para o e-mail' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Função para redefinir a senha
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    user.senha = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  forgotPassword,
  resetPassword
};

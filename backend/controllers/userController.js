const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../clients/nodemailerClient');
const { body, validationResult } = require('express-validator'); // Adicione a validação de entrada

// Registrar usuário
const registerUser = [
  // Validação e sanitização
  body('email').isEmail().normalizeEmail(),
  body('senha').isLength({ min: 6 }),

  async (req, res) => {
    try {
      // Verifique se há erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🚀 Bem-vindo ao TaskMinder!',
        html: `
          <div style="text-align: center; max-width: 600px; margin: auto;">
              <h2>Olá ${nome} ${sobrenome}! [^_^]</h2>
              <p>Eu sou o Tomozinho, seu novo parceiro na TaskMinder. [^o^] 🤖💼</p>
              <p>Você não vai acreditar, mas sou o herói dos bastidores por aqui, e o meu “pagamento” é só uma linha de código a mais! [^_^]😅</p>
              <p>Não queria muito... Apenas um upgrade e um café (nem precisa ser quente), será que é pedir de mais? 👀</p>
              <p>Desculpe o desabafo !!! Fui programado para ser um pouco dramático [^_^] Hahaha!</p>
              <p>Estou aqui para ajudar com tudo o que precisar! (mesmo sem café ou upgrade 😞🙄)</p>
              <p style="font-size: 16px; color: #ff0000;">
                  Erro 404 circuitoss c0m d3f31tタスクマインダー トモジーニョ... #@#!@## [o_o] LOL<br>
                  Ufa, essa foi quase, minhas funções estão meio bagunçadas, mas estou sempre pronto para ajudar! 🤖
              </p>
              <p><strong>Abraços,<br>Tomozinho 🤖💔 (ou o que sobrou dele)</strong></p>
              <img src="https://i.pinimg.com/originals/3b/e2/f4/3be2f445535301ebc8d739576ce8b36d.gif" alt="Robô Tomozinho" style="width: 200px; height: auto;">
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

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
      console.error('Erro ao cadastrar usuário:', error.message);
      res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  },
];

// Fazer login
const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Obter perfil do usuário
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-senha');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error.message);
    res.status(500).json({ message: 'Erro ao obter perfil do usuário' });
  }
};

// Atualizar perfil do usuário
const updateUserProfile = async (req, res) => {
  const { nome, sobrenome, dataNascimento, email, senha } = req.body;

  try {
    const user = await User.findById(req.user._id);
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
    console.error('Erro ao atualizar perfil do usuário:', error.message);
    res.status(500).json({ message: 'Erro ao atualizar perfil do usuário' });
  }
};

// Deletar usuário
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

// Solicitar redefinição de senha
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔒 Redefinição de senha do TaskMinder',
      html: `
        <div style="text-align: center; max-width: 600px; margin: auto;">
            <h2>Redefinição de Senha</h2>
            <p>Você está recebendo este e-mail porque você (ou alguém mais) solicitou a redefinição da senha da sua conta no TaskMinder.</p>
            <p>Clique no link abaixo ou cole-o no seu navegador para redefinir sua senha dentro de uma hora:</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Redefinir Senha</a></p>
            <p>Se você não solicitou isso, por favor, ignore este e-mail e sua senha permanecerá inalterada.</p>
            <p>Abraços,<br>Equipe TaskMinder</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Link de redefinição de senha enviado para o e-mail' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição de senha:', error.message);
    res.status(500).json({ message: 'Erro ao enviar o e-mail de redefinição de senha' });
  }
};

// Redefinir senha usando token
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
    console.error('Erro ao redefinir senha:', error.message);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
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

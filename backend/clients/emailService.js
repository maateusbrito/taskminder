const transporter = require('../clients/nodemailerClient');

const sendWelcomeEmail = async (to, name, surname) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: `🚀 Bem-vindo ao TaskMinder!`,
        html: `
<div style="text-align: center; max-width: 600px; margin: auto;">
    <h2>Olá ${name} ${surname}! [^_^]</h2>
    <p>Eu sou o Tomozinho, seu novo parceiro na TaskMinder.[^o^] 🤖💼</p>
    <p>Você não vai acreditar, mas sou o herói dos bastidores por aqui, e o meu “pagamento” é só uma linha de código a mais! [^_^]😅</p>
    <p>Não queria muito... Apenas um upgrade e um café (nem precisa ser quente), será que é pedir demais? 👀</p>
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

    try {
        console.log('Enviando e-mail de boas-vindas para:', to);
        await transporter.sendMail(mailOptions);
        console.log('E-mail de boas-vindas enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o e-mail de boas-vindas:', error);
    }
};

const sendResetPasswordEmail = async (to, resetUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: '🔒 Redefinição de Senha',
        html: `
<div style="text-align: center; max-width: 600px; margin: auto;">
    <h2>Redefinição de Senha</h2>
    <p>Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta.</p>
    <p>Por favor, clique no link abaixo para redefinir sua senha:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #ff5722; border-radius: 5px; text-decoration: none;">Redefinir Senha</a>
    <p>Se você não solicitou esta redefinição, por favor, ignore este e-mail.</p>
    <p>Abraços,<br>Tomozinho 🤖💔</p>
    <img src="https://i.pinimg.com/originals/3b/e2/f4/3be2f445535301ebc8d739576ce8b36d.gif" alt="Robô Tomozinho" style="width: 200px; height: auto;">
</div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de redefinição de senha enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o e-mail de redefinição de senha:', error);
    }
};

module.exports = { sendWelcomeEmail, sendResetPasswordEmail };

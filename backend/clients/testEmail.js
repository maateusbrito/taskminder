const transporter = require('./clients/nodemailerClient');

const testEmail = async () => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'test@example.com', // Certifique-se de usar um e-mail válido
            subject: 'Test Email',
            text: 'This is a test email from Nodemailer.',
        });
        console.log('E-mail de teste enviado com sucesso!');
        console.log('Informações do e-mail:', info); // Exibe detalhes do e-mail enviado
    } catch (error) {
        console.error('Erro ao enviar o e-mail de teste:', error);
    }
};

testEmail();

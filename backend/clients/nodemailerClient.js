const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // smtp.office365.com
  port: process.env.EMAIL_PORT, // 587
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER, // seu email
    pass: process.env.EMAIL_PASS  // senha de aplicativo gerada
},
});

// Teste a conexão
transporter.verify((error, success) => {
  if (error) {
    console.error('Erro ao configurar o Nodemailer:', error);
  } else {
    console.log('Nodemailer configurado com sucesso');
  }
});

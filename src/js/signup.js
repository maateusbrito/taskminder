import { registerUser } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    // Validar senhas
    if (senha !== confirmarSenha) {
      document.getElementById('error-message').textContent = 'Senhas não coincidem.';
      return;
    }

    try {
      const response = await registerUser(nome, sobrenome, dataNascimento, email, senha);
      if (response.user) {
        // Redirecione para a página de login ou faça outra ação
        window.location.href = 'login.html';
      } else {
        alert('Erro ao se cadastrar: ' + response.message);
      }
    } catch (error) {
      console.error('Erro ao se cadastrar', error);
      alert('Erro ao se cadastrar');
    }
  });
});

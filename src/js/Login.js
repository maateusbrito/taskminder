// src/js/login.js

import { loginUser } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById('username').value; // email
    const password = document.getElementById('password').value;

    try {
      const response = await loginUser(username, password);
      if (response.token) {
        // Salve o token e redirecione para a página principal ou dashboard
        localStorage.setItem('authToken', response.token);
        window.location.href = 'dashboard.html'; // Substitua pelo seu dashboard
      } else {
        alert('Erro ao fazer login: ' + response.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login', error);
      alert('Erro ao fazer login: ' + error.message); // Mensagem de erro detalhada
    }
  });
});

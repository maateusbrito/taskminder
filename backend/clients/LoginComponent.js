import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para carregamento
  const navigate = useNavigate(); // Hook de navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia carregamento

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password
      });

      console.log('Login bem-sucedido', response.data);
      // Salvar o token ou informações do usuário no localStorage ou contexto
      localStorage.setItem('token', response.data.token); // Exemplo de salvamento de token
      navigate('/dashboard'); // Redireciona para a página principal
    } catch (error) {
      console.error('Erro ao fazer login', error.response ? error.response.data : error.message);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>Acessar</button>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;

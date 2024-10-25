const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { getChatCompletion } = require('./openaiClient'); // Verifique o caminho
const financeRoutes = require('./routes/financeRoutes'); // Rotas de finanças
const userRoutes = require('./routes/userRoutes'); // Rotas de usuário
const taskRoutes = require('./routes/taskRoutes'); // Rotas de tarefas
const lembreteRoutes = require('./routes/lembretesRoutes'); // Certifique-se de que o nome do arquivo está correto

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o corpo da requisição
app.use(express.json());

// Configurar o CORS
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Usar as rotas de finanças
app.use('/api/finances', financeRoutes);

// Usar as rotas de autenticação e perfil de usuário
app.use('/api/users', userRoutes);

// Usar as rotas de tarefas
app.use('/api/tasks', taskRoutes);

// Usar as rotas de lembretes
app.use('/api/lembretes', lembreteRoutes);  // Certifique-se de que essa rota esteja acessível corretamente

// Configuração da API da OpenAI
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const reply = await getChatCompletion(message);
    res.json({ reply });
  } catch (error) {
    console.error('Erro ao se comunicar com a OpenAI:', error);
    res.status(500).json({ error: 'Erro ao obter resposta do chat' });
  }
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

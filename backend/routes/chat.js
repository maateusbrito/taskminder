const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User'); // Adicionei a importação do modelo User
const jwt = require('jsonwebtoken'); // Adicionei a importação do jwt
const authMiddleware = require('../middleware/auth');

// Middleware de autenticação
router.use(authMiddleware);

// Criar uma nova conversa
router.post('/', async (req, res) => {
  const { messages } = req.body;
  const userId = req.user._id;

  try {
    const chat = new Chat({ userId, messages });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Erro ao criar chat:', error);
    res.status(500).json({ error: 'Erro ao criar chat' });
  }
});

// Obter conversas do usuário
router.get('/', async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await Chat.find({ userId });
    res.json(chats);
  } catch (error) {
    console.error('Erro ao obter chats:', error);
    res.status(500).json({ error: 'Erro ao obter chats' });
  }
});

// Obter uma conversa específica
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }
    res.json(chat);
  } catch (error) {
    console.error('Erro ao obter chat:', error);
    res.status(500).json({ error: 'Erro ao obter chat' });
  }
});

// Atualizar uma conversa
router.put('/:id', async (req, res) => {
  const { messages } = req.body;

  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }

    chat.messages = messages;
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Erro ao atualizar chat:', error);
    res.status(500).json({ error: 'Erro ao atualizar chat' });
  }
});

// Deletar uma conversa
router.delete('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }

    await chat.remove();
    res.json({ message: 'Chat deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar chat:', error);
    res.status(500).json({ error: 'Erro ao deletar chat' });
  }
});

module.exports = router;
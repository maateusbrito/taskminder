const express = require('express');
const router = express.Router();
const Writer = require('../models/Writer'); // Certifique-se de que o modelo está correto
const authMiddleware = require('../middleware/auth'); // Importa o middleware de autenticação

// Criar um novo texto
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  try {
    const writer = new Writer({ userId, text });
    await writer.save();
    res.status(201).json(writer);
  } catch (error) {
    console.error('Erro ao criar texto:', error);
    res.status(500).json({ error: 'Erro ao criar texto' });
  }
});

// Obter textos do usuário
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user._id;

  try {
    const texts = await Writer.find({ userId });
    res.json(texts);
  } catch (error) {
    console.error('Erro ao obter textos:', error);
    res.status(500).json({ error: 'Erro ao obter textos' });
  }
});

// Obter um texto específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const text = await Writer.findById(req.params.id);
    if (!text || text.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Texto não encontrado' });
    }
    res.json(text);
  } catch (error) {
    console.error('Erro ao obter texto:', error);
    res.status(500).json({ error: 'Erro ao obter texto' });
  }
});

// Atualizar um texto
router.put('/:id', authMiddleware, async (req, res) => {
  const { text } = req.body;

  try {
    const writer = await Writer.findById(req.params.id);
    if (!writer || writer.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Texto não encontrado' });
    }

    writer.text = text;
    await writer.save();
    res.json(writer);
  } catch (error) {
    console.error('Erro ao atualizar texto:', error);
    res.status(500).json({ error: 'Erro ao atualizar texto' });
  }
});

// Deletar um texto
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const writer = await Writer.findById(req.params.id);
    if (!writer || writer.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Texto não encontrado' });
    }

    await writer.remove();
    res.json({ message: 'Texto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar texto:', error);
    res.status(500).json({ error: 'Erro ao deletar texto' });
  }
});

module.exports = router;
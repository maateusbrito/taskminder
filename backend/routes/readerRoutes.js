const express = require('express');
const router = express.Router();
const Reader = require('../models/Reader'); // Assumindo um modelo similar ao padrão
const authMiddleware = require('../middleware/auth'); // Middleware importado corretamente

// Criar um novo documento
router.post('/', authMiddleware, async (req, res) => {
  const { document } = req.body;
  const userId = req.user._id;

  try {
    const reader = new Reader({ userId, document });
    await reader.save();
    res.status(201).json(reader);
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    res.status(500).json({ error: 'Erro ao criar documento' });
  }
});

// Obter documentos do usuário
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user._id;

  try {
    const documents = await Reader.find({ userId });
    res.json(documents);
  } catch (error) {
    console.error('Erro ao obter documentos:', error);
    res.status(500).json({ error: 'Erro ao obter documentos' });
  }
});

// Obter um documento específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Reader.findById(req.params.id);
    if (!document || document.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }
    res.json(document);
  } catch (error) {
    console.error('Erro ao obter documento:', error);
    res.status(500).json({ error: 'Erro ao obter documento' });
  }
});

// Atualizar um documento
router.put('/:id', authMiddleware, async (req, res) => {
  const { document } = req.body;

  try {
    const reader = await Reader.findById(req.params.id);
    if (!reader || reader.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    reader.document = document;
    await reader.save();
    res.json(reader);
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    res.status(500).json({ error: 'Erro ao atualizar documento' });
  }
});

// Deletar um documento
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const reader = await Reader.findById(req.params.id);
    if (!reader || reader.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    await reader.remove();
    res.json({ message: 'Documento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    res.status(500).json({ error: 'Erro ao deletar documento' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Criar uma nova compra
router.post('/', authMiddleware, async (req, res) => {
  const { items, totalAmount } = req.body;
  const userId = req.userId;

  try {
    const purchase = new Purchase({ userId, items, totalAmount });
    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    console.error('Erro ao criar compra:', error);
    res.status(500).json({ error: 'Erro ao criar compra' });
  }
});

// Obter compras do usuário
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await Purchase.find({ userId });
    res.json(purchases);
  } catch (error) {
    console.error('Erro ao obter compras:', error);
    res.status(500).json({ error: 'Erro ao obter compras' });
  }
});

// Obter uma compra específica
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const purchase = await Purchase.findById(id);
    if (!purchase || purchase.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    res.json(purchase);
  } catch (error) {
    console.error('Erro ao obter compra:', error);
    res.status(500).json({ error: 'Erro ao obter compra' });
  }
});

// Atualizar uma compra
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { items, totalAmount } = req.body;
  const userId = req.userId;

  try {
    const purchase = await Purchase.findById(id);
    if (!purchase || purchase.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }

    purchase.items = items;
    purchase.totalAmount = totalAmount;
    await purchase.save();
    res.json(purchase);
  } catch (error) {
    console.error('Erro ao atualizar compra:', error);
    res.status(500).json({ error: 'Erro ao atualizar compra' });
  }
});

// Deletar uma compra
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const purchase = await Purchase.findById(id);
    if (!purchase || purchase.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }

    await purchase.remove();
    res.json({ message: 'Compra deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar compra:', error);
    res.status(500).json({ error: 'Erro ao deletar compra' });
  }
});

module.exports = router;

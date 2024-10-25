const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');
const authMiddleware = require('../middleware/auth');

// Função para calcular juros (exemplo)
function calculateInterest(amount, interestRate, time) {
  return amount + (amount * (interestRate / 100) * time);
}

// Rota POST para criar transações
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/finances called');
  const { transactions } = req.body;
  const userId = req.userId;

  if (!userId || !transactions || !Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  try {
    let finance = await Finance.findOne({ userId });

    if (!finance) {
      finance = new Finance({ userId, transactions });
    } else {
      transactions.forEach(transaction => {
        const existingTransaction = finance.transactions.id(transaction._id);
        if (existingTransaction) {
          // Atualizar a transação existente
          Object.assign(existingTransaction, transaction);
        } else {
          // Adicionar nova transação
          finance.transactions.push(transaction);
        }
      });
    }

    // Calcular juros, se necessário
    transactions.forEach(transaction => {
      if (transaction.type === 'investment' || transaction.type === 'expense') {
        transaction.amount = calculateInterest(transaction.amount, transaction.interestRate || 0, transaction.time || 1);
      }

      // Adicionar lógica para transações parceladas
      if (transaction.installmentsCount > 1) {
        transaction.installments = [];
        for (let i = 0; i < transaction.installmentsCount; i++) {
          transaction.installments.push({
            amount: transaction.amount / transaction.installmentsCount,
            dueDate: new Date(new Date(transaction.date).setMonth(new Date(transaction.date).getMonth() + i))
          });
        }
      }
    });

    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Rota GET para obter todas as transações do usuário autenticado
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const finance = await Finance.findOne({ userId });
    if (!finance) {
      return res.status(404).json({ error: 'Nenhuma transação encontrada para o usuário' });
    }
    res.json(finance.transactions); // Retorna apenas as transações
  } catch (error) {
    console.error('Erro ao obter transações:', error);
    res.status(500).json({ error: 'Erro ao obter transações' });
  }
});

// Rota GET para obter todas as transações de um usuário específico pelo userId
router.get('/user/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const finance = await Finance.findOne({ userId });
    if (!finance) {
      return res.status(404).json({ error: 'Nenhuma finança encontrada para este usuário' });
    }

    res.json(finance.transactions); // Retorna todas as transações do usuário
  } catch (error) {
    console.error('Erro ao obter transações pelo userId:', error);
    res.status(500).json({ error: 'Erro ao obter transações pelo userId' });
  }
});

// Rota PUT para atualizar uma transação específica
router.put('/:transactionId', authMiddleware, async (req, res) => {
  const { transactionId } = req.params;
  const { description, amount, type, date, installmentsCount } = req.body;
  const userId = req.userId;

  try {
    const finance = await Finance.findOne({ userId });
    if (!finance) {
      return res.status(404).json({ error: 'Nenhuma transação encontrada para o usuário' });
    }

    const transaction = finance.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Atualizar os campos da transação
    transaction.description = description || transaction.description;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.date = date || transaction.date;
    transaction.installmentsCount = installmentsCount || transaction.installmentsCount;

    // Atualizar parcelas se necessário
    if (installmentsCount) {
      transaction.installments = [];
      for (let i = 0; i < installmentsCount; i++) {
        transaction.installments.push({
          amount: transaction.amount / installmentsCount,
          dueDate: new Date(new Date(date).setMonth(new Date(date).getMonth() + i))
        });
      }
    } else {
      transaction.installments = [];
    }

    await finance.save();
    res.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
});

// Rota DELETE para remover uma transação específica
router.delete('/:transactionId', authMiddleware, async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.userId;

  try {
    const finance = await Finance.findOne({ userId });
    if (!finance) {
      return res.status(404).json({ error: 'Nenhuma transação encontrada para o usuário' });
    }

    const transaction = finance.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    transaction.remove();
    await finance.save();
    res.json({ message: 'Transação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover transação:', error);
    res.status(500).json({ error: 'Erro ao remover transação' });
  }
});

module.exports = router;

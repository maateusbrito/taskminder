const Finance = require('../models/Finance');

// Função para adicionar transações financeiras
exports.addTransaction = async (req, res) => {
  const { transactions } = req.body; // userId será extraído do token
  const userId = req.userId;

  if (!transactions || !Array.isArray(transactions)) {
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

    // Processar parcelas
    transactions.forEach(transaction => {
      if (transaction.installmentsCount > 1) {
        transaction.installments = [{
          amount: transaction.amount / transaction.installmentsCount,
          dueDate: new Date(transaction.date)
        }];
        
        for (let i = 1; i < transaction.installmentsCount; i++) {
          transaction.installments.push({
            amount: transaction.amount / transaction.installmentsCount,
            dueDate: new Date(new Date(transaction.date).setMonth(new Date(transaction.date).getMonth() + i))
          });
        }
      } else {
        transaction.installments = []; // Limpar parcelas se não houver
      }
    });

    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
};

// Função para atualizar uma transação financeira
exports.updateTransaction = async (req, res) => {
  const { transactionId, description, amount, type, date, installmentsCount } = req.body;
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
      transaction.installments = []; // Limpar parcelas se não houver
    }

    await finance.save();
    res.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
};

// Função para obter uma transação específica
exports.getTransaction = async (req, res) => {
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

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao obter transação:', error);
    res.status(500).json({ error: 'Erro ao obter transação' });
  }
};

// Função para remover uma transação financeira
exports.deleteTransaction = async (req, res) => {
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
};

// Função para obter finanças pelo userId
exports.getFinancesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const finance = await Finance.findOne({ userId });
    if (!finance) {
      return res.status(404).json({ error: 'Nenhuma finança encontrada para este usuário' });
    }

    res.json(finance);
  } catch (error) {
    console.error('Erro ao obter finanças:', error);
    res.status(500).json({ error: 'Erro ao obter finanças' });
  }
};

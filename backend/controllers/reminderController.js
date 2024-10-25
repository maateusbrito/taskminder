const Reminder = require('../models/reminderModel'); // Modelo de Lembrete
const jwt = require('jsonwebtoken');

// Função para extrair o userId do token JWT
const getUserIdFromToken = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'seuSegredoJWT'); // Substitua pelo seu segredo JWT
  return decodedToken.userId;
};

// Criar um lembrete
exports.createReminder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req); // Obtém o userId a partir do token
    const { date, text, time } = req.body; // Dados do lembrete

    const newReminder = new Reminder({
      userId,
      date,
      text,
      time
    });

    const savedReminder = await newReminder.save();
    res.status(201).json({ message: 'Lembrete criado com sucesso', reminder: savedReminder });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar lembrete', error });
  }
};

// Buscar lembretes por usuário
exports.getRemindersByUser = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req); // Obtém o userId do token

    const reminders = await Reminder.find({ userId });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar lembretes', error });
  }
};

// Atualizar lembrete
exports.updateReminder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { reminderId, text, time } = req.body;

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId }, // Certifica-se de que o lembrete pertence ao usuário
      { text, time },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ message: 'Lembrete não encontrado' });
    }

    res.status(200).json({ message: 'Lembrete atualizado com sucesso', reminder: updatedReminder });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar lembrete', error });
  }
};

// Excluir lembrete
exports.deleteReminder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { reminderId } = req.body;

    const deletedReminder = await Reminder.findOneAndDelete({ _id: reminderId, userId });

    if (!deletedReminder) {
      return res.status(404).json({ message: 'Lembrete não encontrado' });
    }

    res.status(200).json({ message: 'Lembrete excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir lembrete', error });
  }
};

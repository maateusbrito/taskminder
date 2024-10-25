const express = require('express');
const router = express.Router();
const Lembrete = require('../models/Lembrete'); // Importar o modelo do Lembrete
const authMiddleware = require('../middleware/auth'); // Middleware importado corretamente
const { v4: uuidv4 } = require('uuid');  // Importar a função v4 do uuid

// Rota para salvar um novo lembrete
router.post('/', authMiddleware, async (req, res) => {
  const { descricao, horario, dia } = req.body;
  const userId = req.user._id;

  // Validação dos dados
  if (!descricao || !horario || !dia) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Converter 'dia' para o tipo Date
    const dataFormatada = new Date(dia);

    const novoLembrete = new Lembrete({
      userId,
      descricao,
      horario,
      dia: dataFormatada,
      lembreteId: uuidv4(),  // Gerar um ID único
    });

    const lembreteSalvo = await novoLembrete.save();
    res.status(201).json(lembreteSalvo);
  } catch (error) {
    console.error('Erro ao salvar o lembrete:', error);
    res.status(500).json({ error: 'Erro ao salvar o lembrete' });
  }
});

// Rota para atualizar um lembrete
router.put('/:lembreteId', authMiddleware, async (req, res) => {
  const { lembreteId } = req.params;
  const { descricao, horario, dia } = req.body;
  const userId = req.user._id;

  try {
    const lembreteAtualizado = await Lembrete.findOneAndUpdate(
      { userId, lembreteId },  // Condição de busca
      { descricao, horario, dia },  // Dados a serem atualizados
      { new: true }  // Retorna o documento atualizado
    );

    if (!lembreteAtualizado) {
      return res.status(404).json({ error: 'Lembrete não encontrado' });
    }

    res.status(200).json(lembreteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar o lembrete:', error);
    res.status(500).json({ error: 'Erro ao atualizar o lembrete' });
  }
});

// Rota para excluir um lembrete
router.delete('/:lembreteId', authMiddleware, async (req, res) => {
  const { lembreteId } = req.params;
  const userId = req.user._id;

  try {
    const lembreteExcluido = await Lembrete.findOneAndDelete({ userId, lembreteId });

    if (!lembreteExcluido) {
      return res.status(404).json({ error: 'Lembrete não encontrado' });
    }

    res.status(200).json({ message: 'Lembrete excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o lembrete:', error);
    res.status(500).json({ error: 'Erro ao excluir o lembrete' });
  }
});

module.exports = router;

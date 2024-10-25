const Task = require('../models/Task');
const openai = require('../openaiClient'); // Importa o cliente OpenAI

// Criar uma nova tarefa com título gerado pela OpenAI
const createTask = async (req, res) => {
  try {
    const { title, description, time } = req.body;

    // Gerar um título usando a OpenAI se não for fornecido
    let generatedTitle = title;
    if (!title) {
      const response = await openai.completions.create({
        model: 'text-davinci-003',
        prompt: 'Generate a title for a new task',
        max_tokens: 10,
      });

      generatedTitle = response.data.choices[0].text.trim();
    }

    // Criar a tarefa com o título gerado ou fornecido
    const task = new Task({
      title: generatedTitle,
      description,
      time,
      userId: req.userId, // Use req.userId
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
  }
};

// Obter todas as tarefas do usuário
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }); // Use req.userId
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao obter tarefas:', error);
    res.status(500).json({ message: 'Erro ao obter tarefas', error: error.message });
  }
};

// Atualizar uma tarefa
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar se a tarefa pertence ao usuário autenticado antes de atualizar
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId }, // Use req.userId
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário' });
    }

    res.json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error: error.message });
  }
};

// Deletar uma tarefa
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a tarefa pertence ao usuário autenticado antes de deletar
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId }); // Use req.userId

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário' });
    }

    res.json({ message: 'Tarefa deletada' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ message: 'Erro ao deletar tarefa', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};

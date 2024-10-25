const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  time: {
    type: Date, // Use 'Number' se armazenar intervalo de tempo
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Adicionar índice para userId para melhorar a performance das consultas
taskSchema.index({ userId: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

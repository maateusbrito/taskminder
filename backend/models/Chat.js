const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
    {
      sender: {
        type: String, // 'user' ou 'system'
        required: true,
        enum: ['user', 'system'], // Validação opcional para garantir que apenas valores permitidos sejam usados
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],
}, { timestamps: true });

// Adicionar índice no campo userId para melhorar a performance das consultas
chatSchema.index({ userId: 1 });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

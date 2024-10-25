const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat', // Assumindo que você tem um modelo 'Chat'
    required: true,
  },
  sender: {
    type: String,
    required: true,
    enum: ['user', 'system'], // Enum para garantir valores válidos
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Adicionar índice para chatId e timestamp para melhorar a performance
messageSchema.index({ chatId: 1 });
messageSchema.index({ timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

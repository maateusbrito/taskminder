// models/Purchase.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    // Não há uma validação direta aqui, mas deve ser validado na aplicação
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Adicionar índice para userId e date para melhorar a performance
purchaseSchema.index({ userId: 1 });
purchaseSchema.index({ date: 1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;

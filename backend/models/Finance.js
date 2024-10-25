const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  transactions: [
    {
      type: {
        type: String,
        required: true,
        enum: ['income', 'expense', 'investment'], // Tipos de transações
      },
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: { // Data da transação
        type: Date,
        required: true,
      },
      installmentsCount: {
        type: Number,
        default: 1,
        min: 1, // Número mínimo de parcelas
      },
      installments: [
        {
          amount: {
            type: Number,
            required: true,
          },
          dueDate: {
            type: Date,
            required: true,
          },
        },
      ],
    },
  ],
}, { timestamps: true }); // Adiciona createdAt e updatedAt

// Adicionar índices
financeSchema.index({ userId: 1 });
financeSchema.index({ 'transactions.type': 1 });

module.exports = mongoose.model('Finance', financeSchema);

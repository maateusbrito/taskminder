const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documents: [
    {
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^(http|https):\/\/[^ "]+$/.test(v); // Validação simples para URLs
          },
          message: props => `${props.value} não é uma URL válida!`
        }
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      }
    }
  ],
}, { timestamps: true });

// Adicionar índice para userId e dateAdded para melhorar a performance
readerSchema.index({ userId: 1 });
readerSchema.index({ 'documents.dateAdded': 1 });

const Reader = mongoose.model('Reader', readerSchema);
module.exports = Reader;

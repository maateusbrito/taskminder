// models/Writer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const writerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, { timestamps: true });

// Adicionando índices para melhorar a performance
writerSchema.index({ userId: 1 });

const Writer = mongoose.model('Writer', writerSchema);
module.exports = Writer;

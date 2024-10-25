const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LembreteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Relaciona com o usuário
  lembreteId: { type: String, required: true },  // ID do lembrete
  descricao: { type: String, required: true },   // Descrição do lembrete
  horario: { type: String, required: true },     // Horário do lembrete (formato: HH:mm)
  dia: { type: Date, required: true }            // Dia do lembrete
});

module.exports = mongoose.model('Lembrete', LembreteSchema);

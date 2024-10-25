// models/Note.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

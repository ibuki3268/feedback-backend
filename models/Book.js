const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Book', BookSchema);
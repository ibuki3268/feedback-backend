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
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId, // ユーザーのIDを保存する型
    ref: 'User', // Userモデルを参照する
    required: true // 必須項目にする
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);
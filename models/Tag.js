const mongoose = require('mongoose');

// タグの設計図
const TagSchema = new mongoose.Schema({
  // タグの名前（例: "C#", "Unity"）。重複を許さず、前後の空白は自動で削除する。
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model('Tag', TagSchema);
const mongoose = require('mongoose');

const TitleSchema = new mongoose.Schema({
  // 称号名 (例: "読書好き")
  name: { type: String, required: true, unique: true },
  // 称号の説明 (例: "本を10冊以上読んだ証")
  description: { type: String, required: true },
  // 称号の獲得条件
  condition: {
    type: {
      type: String,
      // "TOTAL_BOOKS" (総読書数) "TAG_BOOKS" (特定タグの読書数)
      enum: ['TOTAL_BOOKS', 'GENRE_BOOKS', 'MULTI_LANGUAGE', 'SPECIFIC_TAG'],
      required: true
    },
    // TAG_BOOKSの場合、対象のタグ名 (例: "Unity")
    tag: { type: String },
    // 条件となる冊数 (例: 10)
    count: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Title', TitleSchema);
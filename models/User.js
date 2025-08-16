const mongoose = require('mongoose');

// ユーザー情報の「設計図」を定義
const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true, // 必須項目
  },
  email: {
    type: String,
    required: true,
    unique: true, // 同じメールアドレスは登録できない
  },
  password: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now, // 登録日時（デフォルトで現在時刻）
  },
  achievedTitles: [{
    type: mongoose.Schema.Types.ObjectId, // 獲得した称号のIDを保存
    ref: 'Title' // Titleモデルを参照
  }]
});

// 設計図を元に「モデル」を作成し、外部から使えるようにする
module.exports = mongoose.model('User', UserSchema);
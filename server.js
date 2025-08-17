const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // .envファイルを読み込む

const app = express();

// データベースに接続
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDBに接続しました'))
  .catch(err => console.error('MongoDBへの接続に失敗しました:', err));

  // CORSを有効にする
// これにより、全てのオリジンからのリクエストが許可される（開発中はこれでOK）
app.use(cors());

// JSON形式のリクエストを扱えるようにする
app.use(express.json());

// APIルートの設定
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/borrowings', require('./routes/borrowings'));
app.use('/api/users', require('./routes/users'));

// サーバーを起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`サーバーがポート ${PORT} で起動しました`));
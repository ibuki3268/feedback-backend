const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. リクエストのヘッダーからトークンを取得
  const token = req.header('x-auth-token');

  // 2. トークンがなければ、エラーを返す
  if (!token) {
    return res.status(401).json({ msg: '認証トークンがなく、アクセスが拒否されました' });
  }

  // 3. トークンを検証する
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // デコードされたユーザー情報をリクエストオブジェクトに格納
    next(); // 次の処理（本の登録など）に進む
  } catch (err) {
    res.status(401).json({ msg: 'トークンが無効です' });
  }
};
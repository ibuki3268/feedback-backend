const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // さっき作ったUserモデルをインポート
const jwt = require('jsonwebtoken');

// [POST] /api/auth/register
// 新規ユーザー登録のためのAPI
router.post('/register', async (req, res) => {
  try {
    // 1. リクエストのbodyから情報を受け取る
    const { nickname, email, password } = req.body;

    // 2. 同じメールアドレスのユーザーが既にいないかチェック
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: 'このメールアドレスは既に使用されています' });
    }

    // 3. 新しいユーザーオブジェクトを作成
    user = new User({
      nickname,
      email,
      password,
    });

    // 4. パスワードをハッシュ化する
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. データベースに保存
    await user.save();

    res.status(201).json({ msg: 'ユーザー登録が完了しました' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// [POST] /api/auth/login
// ログインのためのAPI
router.post('/login', async (req, res) => {
  try {
    // 1. リクエストのbodyから情報を受け取る
    const { email, password } = req.body;

    // 2. メールアドレスを元にユーザーを検索
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // 3. 入力されたパスワードと、DBのハッシュ化されたパスワードを比較
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // 4. ログイン成功！JWT（ログイン証明書）を発行する
    const payload = {
      user: {
        id: user.id, // ユーザーのIDを証明書に含める
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // 秘密鍵（後で設定）
      { expiresIn: '1h' },    // 有効期限（例: 1時間）
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // トークンをクライアントに返す
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;
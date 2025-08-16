const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // 認証ミドルウェア
const BorrowingHistory = require('../models/BorrowingHistory');
// ★ 後で作成する称号判定サービスをインポート
const { checkAndAwardTitles } = require('../services/achievementService');

// POST /api/borrowings/borrow/:bookId - 本を借りる
router.post('/borrow/:bookId', auth, async (req, res) => {
  try {
    // ここに「既に借りられていないか」などのチェック処理を後で追加できます
    const newBorrowing = new BorrowingHistory({
      user: req.user.id,
      book: req.params.bookId
    });
    await newBorrowing.save();
    res.status(201).json(newBorrowing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// POST /api/borrowings/return/:bookId - 本を返却する
router.post('/return/:bookId', auth, async (req, res) => {
  try {
    const history = await BorrowingHistory.findOneAndUpdate(
      { user: req.user.id, book: req.params.bookId, returnedDate: null },
      { returnedDate: new Date() },
      { new: true }
    );

    if (!history) {
      return res.status(404).json({ msg: '貸し出し記録が見つかりません' });
    }

    // ★★★ 本が返却されたので、称号の条件をチェックする ★★★
    await checkAndAwardTitles(req.user.id);

    res.json({ msg: '本が返却されました' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;
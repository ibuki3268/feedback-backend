// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/me/titles - 自分の所持している称号一覧を取得
router.get('/me/titles', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('achievedTitles');
    if (!user) {
      return res.status(404).json({ msg: 'ユーザーが見つかりません' });
    }
    res.json(user.achievedTitles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;
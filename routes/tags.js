const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// GET /api/tags - 全てのタグを取得
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }); // アルファベット順でソート
    res.json(tags.map(tag => tag.name)); // タグの名前の配列だけを返す
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// POST /api/tags - 新しいタグを作成
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    // 既に同じ名前のタグがないかチェック
    let tag = await Tag.findOne({ name });
    if (tag) {
      return res.status(400).json({ msg: '既に存在するタグです' });
    }

    tag = new Tag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;
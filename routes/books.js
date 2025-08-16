const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Tag = require('../models/Tag');

// POST /api/books - 新しい本を登録
router.post('/', async (req, res) => {
  const { isbn, title, tags } = req.body;

  try {
    // 同じISBNの本が既に登録されていないかチェック
    let book = await Book.findOne({ isbn });
    if (book) {
      return res.status(400).json({ msg: 'この本は既に登録されています' });
    }

    // タグの処理：受け取ったタグが存在しなければ、Tagコレクションに新規作成する
    if (tags && tags.length > 0) {
      const tagPromises = tags.map(tagName => 
        Tag.findOneAndUpdate(
          { name: tagName.trim() }, // この名前のタグを探す
          { $setOnInsert: { name: tagName.trim() } }, // なければ、この名前で作成
          { upsert: true, new: true } // upsert: trueが「なければ作成」のオプション
        )
      );
      await Promise.all(tagPromises);
    }
    
    // 新しい本を作成
    book = new Book({
      isbn,
      title,
      tags
    });

    await book.save();
    res.status(201).json(book);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;
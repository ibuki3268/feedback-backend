const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('../models/Book');
const Tag = require('../models/Tag');

const populateTags = async () => {
  try {
    // データベースに接続
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDBに接続しました。tagsコレクションの作成を開始します...');

    // 1. 全ての本のデータを取得
    const allBooks = await Book.find({}, 'tags'); // tagsフィールドだけを取得

    // 2. 全てのタグを一つの配列にまとめ、重複を削除する
    const allTags = new Set();
    allBooks.forEach(book => {
      book.tags.forEach(tag => allTags.add(tag));
    });
    const uniqueTags = [...allTags]; // Setを配列に変換
    console.log(`${uniqueTags.length}件のユニークなタグが見つかりました。`);

    // 3. 既存のTagコレクションを一度クリア（任意）
    await Tag.deleteMany({});
    console.log('既存のTagコレクションをクリアしました。');

    // 4. Tagコレクションに保存するための形式に変換
    const tagsToSave = uniqueTags.map(tagName => ({ name: tagName }));

    // 5. Tagコレクションに一括で保存
    await Tag.insertMany(tagsToSave);
    console.log(`✅ ${tagsToSave.length}件のタグをTagコレクションに正常に保存しました！`);

  } catch (error) {
    console.error('❌ 処理中にエラーが発生しました:', error);
  } finally {
    // 処理が完了したら接続を切断
    await mongoose.connection.close();
    console.log('MongoDBとの接続を切断しました。');
  }
};

// スクリプトを実行
populateTags();
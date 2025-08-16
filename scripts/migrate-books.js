const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Book = require('../models/Book');

const jsonFilePath = path.join(__dirname, 'books.json');

const migrateData = async () => {
  try {
    // データベースに接続
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDBに接続しました。データ移行を開始します...');

    // JSONファイルを読み込む
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    const booksFromJson = JSON.parse(data);

    // 移行用にデータを整形
    const booksToSave = booksFromJson.map(book => ({
      isbn: book.isbn,
      title: book.title,
      author: "", // 著者は後で追加するため空欄
      tags: []      // タグも後で追加するため空の配列
    }));
    
    // 既存のデータを一度クリア（必要なければこの行はコメントアウト）
    await Book.deleteMany({});
    console.log('既存の書籍データをクリアしました。');
    
    // 整形したデータをデータベースに一括で保存
    await Book.insertMany(booksToSave);
    console.log(`✅ ${booksToSave.length}件の書籍データをMongoDBに正常に移行しました！`);

  } catch (error) {
    console.error('❌ 移行中にエラーが発生しました:', error);
  } finally {
    // 処理が完了したら接続を切断
    await mongoose.connection.close();
    console.log('MongoDBとの接続を切断しました。');
  }
};

// スクリプトを実行
migrateData();
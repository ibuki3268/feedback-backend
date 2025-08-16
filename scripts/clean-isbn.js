const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('../models/Book');

const cleanIsbnWhitespace = async () => {
  try {
    // データベースに接続
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDBに接続しました。ISBNのクリーンアップを開始します...');

    // データベースから全ての本を取得
    const allBooks = await Book.find({});

    let cleanedCount = 0;
    // 1冊ずつチェックして、空白があれば削除して更新
    for (const book of allBooks) {
      const trimmedIsbn = book.isbn.trim();
      
      // もし空白があった場合のみ更新処理を行う
      if (book.isbn !== trimmedIsbn) {
        await Book.updateOne(
          { _id: book._id },
          { $set: { isbn: trimmedIsbn } }
        );
        console.log(`- ${book.title} のISBNをクリーンアップしました。`);
        cleanedCount++;
      }
    }

    console.log(`✅ クリーンアップが完了しました。${cleanedCount}件のISBNが修正されました。`);

  } catch (error) {
    console.error('❌ クリーンアップ中にエラーが発生しました:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDBとの接続を切断しました。');
  }
};

// スクリプトを実行
cleanIsbnWhitespace();
// scripts/seed-titles.js
const mongoose = require('mongoose');
require('dotenv').config();
const Title = require('../models/Title');

// 登録したい称号のリスト
const titlesToSeed = [
  // 総読書数
  { name: 'ひよっこプログラマー🐣', description: '記念すべき最初の一歩！', condition: { type: 'TOTAL_BOOKS', count: 1 } },
  { name: '一人前の証', description: '多くの知識を吸収し、成長を遂げた証。', condition: { type: 'TOTAL_BOOKS', count: 10 } },
  { name: '知の探求者', description: '探求心は留まることを知らない。', condition: { type: 'TOTAL_BOOKS', count: 30 } },
  { name: '歩く図書館📚', description: '生ける伝説がここにいる。', condition: { type: 'TOTAL_BOOKS', count: 50 } },
  
  // ジャンル・タグ別
  { name: 'ゲームクリエイター🎮', description: '遊びを創造する者。', condition: { type: 'GENRE_BOOKS', genre: 'ゲーム開発', count: 5 } },
  { name: 'デジタルアーティスト🎨', description: '想像を形にする魔法使い。', condition: { type: 'GENRE_BOOKS', genre: 'デザイン・CG', count: 5 } },
  { name: 'AIエンジニア🤖', description: '未来を創る知性の開拓者。', condition: { type: 'GENRE_BOOKS', genre: 'AI', count: 3 } },
  { name: 'Webデベロッパー🕸️', description: '仮想世界を繋ぐ建築家。', condition: { type: 'GENRE_BOOKS', genre: 'Web開発', count: 3 } },
  
  // 特別条件
  { name: '多言語使い', description: '多くの言語を操る知識の達人。', condition: { type: 'MULTI_LANGUAGE', count: 3 } },
  { name: 'アーキテクトの卵', description: 'システムの骨格を学ぶ者。', condition: { type: 'SPECIFIC_TAG', tags: ['設計', '理論'], count: 1 } },
];

const seedTitles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB接続完了');
    await Title.deleteMany({}); // 既存の称号を一度クリア
    console.log('既存の称号を削除しました');
    await Title.insertMany(titlesToSeed);
    console.log('✅ 新しい称号の登録が完了しました！');
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedTitles();
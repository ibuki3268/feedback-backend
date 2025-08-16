// services/achievementService.js
const User = require('../models/User');
const Title = require('../models/Title');
const BorrowingHistory = require('../models/BorrowingHistory');

// ★ タグとジャンルの対応表を定義
const TAG_GENRE_MAP = {
  'ゲーム開発': ['Unity', 'Unreal Engine', 'C#', 'C++', 'ゲーム開発', 'アルゴリズム', '物理シミュレーション', 'ティラノスクリプト', 'PlayFab'],
  'デザイン・CG': ['アート', '3DCG', '作画', 'デザイン', 'Maya', 'Blender', 'Photoshop', 'Illustrator', 'Live2D', 'アニメーション', 'リギング', 'モデリング'],
  'AI': ['AI', '機械学習', '自然言語処理', '統計学'],
  'Web開発': ['Webフロントエンド', 'Webフレームワーク', 'HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'Ruby', 'Ruby on Rails', 'Laravel', 'Go', 'Web技術', 'API'],
  'プログラミング言語': ['C#', 'C++', 'Java', 'Ruby', 'Go', 'PHP', 'C言語', 'JavaScript']
};

async function checkAndAwardTitles(userId) {
  const user = await User.findById(userId);
  const allTitles = await Title.find({});
  const titlesToCheck = allTitles.filter(title => !user.achievedTitles.some(t => t.equals(title._id)));

  if (titlesToCheck.length === 0) return;

  const userHistory = await BorrowingHistory.find({ user: userId, returnedDate: { $ne: null } })
    .populate('book', 'tags');

  for (const title of titlesToCheck) {
    let isAchieved = false;
    const condition = title.condition;

    if (condition.type === 'TOTAL_BOOKS') {
      if (userHistory.length >= condition.count) isAchieved = true;
    
    } else if (condition.type === 'GENRE_BOOKS') {
      const genreTags = TAG_GENRE_MAP[condition.genre] || [];
      const count = userHistory.filter(h => h.book.tags.some(tag => genreTags.includes(tag))).length;
      if (count >= condition.count) isAchieved = true;

    } else if (condition.type === 'MULTI_LANGUAGE') {
      const languageTags = new Set();
      const languageGenre = TAG_GENRE_MAP['プログラミング言語'];
      userHistory.forEach(h => {
        h.book.tags.forEach(tag => {
          if (languageGenre.includes(tag)) languageTags.add(tag);
        });
      });
      if (languageTags.size >= condition.count) isAchieved = true;
      
    } else if (condition.type === 'SPECIFIC_TAG') {
      const count = userHistory.filter(h => h.book.tags.some(tag => condition.tags.includes(tag))).length;
      if (count >= condition.count) isAchieved = true;
    }

    if (isAchieved) {
      user.achievedTitles.push(title._id);
    }
  }

  await user.save();
  console.log(`ユーザー(${userId})の称号チェック完了`);
}

module.exports = { checkAndAwardTitles };
// services/achievementService.js
const User = require('../models/User');
const Title = require('../models/Title');
const BorrowingHistory = require('../models/BorrowingHistory');
const Book = require('../models/Book');

async function checkAndAwardTitles(userId) {
  // 1. ユーザー情報と、全ての称号定義を取得
  const user = await User.findById(userId);
  const allTitles = await Title.find({});
  
  // 2. ユーザーがまだ獲得していない称号のみをチェック対象にする
  const titlesToCheck = allTitles.filter(title => 
    !user.achievedTitles.includes(title._id)
  );

  if (titlesToCheck.length === 0) return; // チェックする新しい称号がなければ終了

  // 3. ユーザーの返却済みの貸し出し履歴を取得
  const userHistory = await BorrowingHistory.find({ user: userId, returnedDate: { $ne: null } })
    .populate('book', 'tags'); // Bookモデルからtagsの情報も持ってくる

  // 4. 各称号の条件をループでチェック
  for (const title of titlesToCheck) {
    let isAchieved = false;
    const condition = title.condition;

    if (condition.type === 'TOTAL_BOOKS') {
      // 総読書数の条件チェック
      if (userHistory.length >= condition.count) {
        isAchieved = true;
      }
    } else if (condition.type === 'TAG_BOOKS') {
      // 特定タグの読書数の条件チェック
      const tagCount = userHistory.filter(h => h.book.tags.includes(condition.tag)).length;
      if (tagCount >= condition.count) {
        isAchieved = true;
      }
    }

    // 5. 条件を満たしていれば、ユーザーに称号を付与
    if (isAchieved) {
      user.achievedTitles.push(title._id);
    }
  }

  // 6. 変更をデータベースに保存
  await user.save();
}

module.exports = { checkAndAwardTitles };
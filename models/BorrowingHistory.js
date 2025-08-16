const mongoose = require('mongoose');

const BorrowingHistorySchema = new mongoose.Schema({
  // 誰が借りたか (Userモデルを参照)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  // どの本を借りたか (Bookモデルを参照)
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  // 借りた日
  borrowedDate: { type: Date, default: Date.now },
  // 返却した日 (返却されるまでは空)
  returnedDate: { type: Date }
});

module.exports = mongoose.model('BorrowingHistory', BorrowingHistorySchema);
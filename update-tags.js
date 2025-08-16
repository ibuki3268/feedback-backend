const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');

// 先ほど作成したISBNとタグの対応リスト
const tagData = [
    { isbn: "9784798058702", tags: ["Unity", "ゲーム開発"] },
    { isbn: "9784815606657", tags: ["Unity", "ゲーム開発", "C#"] },
    { isbn: "9784797386790", tags: ["Unity", "ゲーム開発", "C#"] },
    { isbn: "9784815617158", tags: ["Unity", "ゲーム開発", "C#"] },
    { isbn: "9784797327038", tags: ["Java", "デザインパターン", "設計"] },
    { isbn: "9784815622664", tags: ["After Effects", "映像制作"] },
    { isbn: "9784774136288", tags: ["プログラミング", "理論", "設計"] },
    { isbn: "9784777520398", tags: ["ティラノスクリプト", "ゲーム開発"] },
    { isbn: "9784046044082", tags: ["アルゴリズム", "競技プログラミング"] },
    { isbn: "9784877832759", tags: ["Unity", "ゲーム開発"] },
    { isbn: "9784877832858", tags: ["Unity", "ゲーム開発", "ライブラリ"] },
    { isbn: "9784862465535", tags: ["Unreal Engine", "ゲーム開発"] },
    { isbn: "9784797346282", tags: ["アルゴリズム", "ゲーム開発"] },
    { isbn: "9784797337211", tags: ["アルゴリズム", "ゲーム開発"] },
    { isbn: "9784797329070", tags: ["数学", "物理", "ゲーム開発"] },
    { isbn: "9784797328462", tags: ["ネットワーク", "サーバー", "ゲーム開発"] },
    { isbn: "9784797335958", tags: ["アルゴリズム", "物理シミュレーション", "ゲーム開発"] },
    { isbn: "9784797338959", tags: ["アルゴリズム", "ゲーム開発"] },
    { isbn: "9784873116501", tags: ["C#"] },
    { isbn: "9784798114613", tags: ["C#"] },
    { isbn: "9784407308280", tags: ["C言語"] },
    { isbn: "9784798119762", tags: ["C++"] },
    { isbn: "9784798157610", tags: ["C++", "ゲーム開発"] },
    { isbn: "9784797370980", tags: ["C言語"] },
    { isbn: "9784320027978", tags: ["C言語", "C++", "リファレンス"] },
    { isbn: "9784798119595", tags: ["C++"] },
    { isbn: "9784781909561", tags: ["自然言語処理", "AI"] },
    { isbn: "9784815618469", tags: ["HTML", "CSS", "Webデザイン"] },
    { isbn: "9784815615758", tags: ["JavaScript", "Webフロントエンド"] },
    { isbn: "9784815610722", tags: ["JavaScript", "React", "Webフロントエンド"] },
    { isbn: "9784798141572", tags: ["HTML", "CSS", "Webフロントエンド"] },
    { isbn: "9784627852112", tags: ["機械学習", "AI"] },
    { isbn: "9784873112169", tags: ["AI", "ゲーム開発"] },
    { isbn: "9784274066641", tags: ["AI", "C言語"] },
    { isbn: "9784863543430", tags: ["Git", "バージョン管理"] },
    { isbn: "9784839973766", tags: ["API", "LINE"] },
    { isbn: "9784802614085", tags: ["PHP", "Laravel", "Webフレームワーク"] },
    { isbn: "9784798059068", tags: ["Ruby", "Ruby on Rails", "Webフレームワーク"] },
    { isbn: "9784774142043", tags: ["Web技術", "HTTP", "REST"] },
    { isbn: "9784815601577", tags: ["JavaScript", "Webフロントエンド"] },
    { isbn: "9784297134198", tags: ["Go"] },
    { isbn: "9784839933142", tags: ["PHP"] },
    { isbn: "9784797399844", tags: ["Ruby"] },
    { isbn: "9784798064079", tags: ["PlayFab", "ゲーム開発", "バックエンド"] },
    { isbn: "9784049146189", tags: ["小説"] },
    { isbn: "9784862462879", tags: ["CG", "アート"] },
    { isbn: "9780486202419", tags: ["アート", "解剖学", "作画"] },
    { isbn: "9784862462442", tags: ["Maya", "3DCG", "アニメーション"] },
    { isbn: "9784862462633", tags: ["Maya", "3DCG", "モデリング"] },
    { isbn: "9784862462169", tags: ["Maya", "3DCG", "リギング"] },
    { isbn: "9784862463333", tags: ["Maya", "3DCG", "モデリング"] },
    { isbn: "9784862462602", tags: ["CG", "ワークフロー"] },
    { isbn: "9784815624293", tags: ["Photoshop", "デザイン"] },
    { isbn: "9784798061955", tags: ["Blender", "3DCG", "モデリング"] },
    { isbn: "9784297108632", tags: ["Blender", "3DCG", "アニメーション"] },
    { isbn: "9784297138417", tags: ["Live2D", "作画"] },
    { isbn: "9784802614016", tags: ["Blender", "3DCG", "モデリング"] },
    { isbn: "9784861766640", tags: ["資料集", "作画"] },
    { isbn: "9784797361162", tags: ["アート", "資料集"] },
    { isbn: "9784048679732", tags: ["資料集", "アート"] },
    { isbn: "9784797397253", tags: ["Illustrator", "デザイン"] },
    { isbn: "9784862671400", tags: ["アニメーション", "アート"] },
    { isbn: "9784758010849", tags: ["資料集", "作画"] },
    { isbn: "9784758011020", tags: ["資料集", "作画"] },
    { isbn: "9784766119886", tags: ["作画", "解剖学", "アート"] },
    { isbn: "9784295013617", tags: ["Git", "GitHub", "バージョン管理"] },
    { isbn: "9784797364217", tags: ["シナリオ", "資料集"] },
    { isbn: "9784798032474", tags: ["シナリオ", "資料集"] },
    { isbn: "9784822247812", tags: ["思考法", "アイデア"] },
    { isbn: "9784799802052", tags: ["DTM", "音楽"] },
    { isbn: "9784522460146", tags: ["就職活動", "SPI"] },
    { isbn: "9784785310752", tags: ["統計学"] },
    { isbn: "9784842912639", tags: ["統計学", "確率"] },
    { isbn: "9784621076835", tags: ["数学", "線形代数"] },
    { isbn: "9784799110072", tags: ["就職活動"] },
    { isbn: "9784781901275", tags: ["数学", "ベクトル解析"] },
    { isbn: "9784873619309", tags: ["物理"] },
    { isbn: "9784780601169", tags: ["物理"] },
    { isbn: "9784627792012", tags: ["ハードウェア", "デジタル回路"] },
    { isbn: "9784873612805", tags: ["数学"] },
    { isbn: "9784764903678", tags: ["IT基礎"] },
    { isbn: "9784048677837", tags: ["キャリア", "ゲーム業界"] },
    { isbn: "9784569806679", tags: ["ビジネス", "自己啓発"] },
    { isbn: "9784405106659", tags: ["ネットワーク", "IT基礎"] },
    { isbn: "9784339077742", tags: ["英語", "論文"] },
    { isbn: "9784532111625", tags: ["法律", "知的財産"] },
    { isbn: "9784844358589", tags: ["デザイン", "理論"] },
    { isbn: "9784274066573", tags: ["統計学"] },
    { isbn: "9784883840175", tags: ["統計学"] },
    { isbn: "9784780600735", tags: ["物理", "数学"] },
    { isbn: "9784815607388", tags: ["AWS", "インフラ", "資格"] }
];

const updateBookTags = async () => {
  try {
    // データベースに接続
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDBに接続しました。タグの更新を開始します...');

    let updatedCount = 0;
    // ループ処理で1冊ずつ更新
    for (const bookData of tagData) {
      // ISBNの末尾にある可能性のある空白を削除
      const cleanIsbn = bookData.isbn.trim();

      const result = await Book.updateOne(
        { isbn: cleanIsbn }, // このISBNの本を探す
        { $set: { tags: bookData.tags } } // tagsフィールドを新しい配列で上書き
      );

      if (result.modifiedCount > 0) {
        console.log(`- ${cleanIsbn} のタグを更新しました。`);
        updatedCount++;
      } else {
        console.log(`- ${cleanIsbn} は見つからないか、既に更新済みです。`);
      }
    }

    console.log(`✅ タグ付け処理が完了しました。${updatedCount}件の書籍データが更新されました。`);

  } catch (error) {
    console.error('❌ 更新中にエラーが発生しました:', error);
  } finally {
    // 処理が完了したら接続を切断
    await mongoose.connection.close();
    console.log('MongoDBとの接続を切断しました。');
  }
};

// スクリプトを実行
updateBookTags();
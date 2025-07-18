# わんわんマルシェ写真販売サイト

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://takasaito-dev.github.io/wanwan_marche_photos/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

わんわんマルシェで開催されるイベントの写真を販売するための静的Webサイトです。バックエンドを必要とせず、GitHub Pagesで簡単にホスティングできます。

## 🌟 特徴

- **シンプルでモダンなデザイン** - レスポンシブデザインで全デバイスに対応
- **イベント管理** - JSONファイルによる簡単なイベント情報管理
- **写真販売機能** - 選択・プレビュー・カート機能
- **メール注文** - mailtoリンクによる注文システム
- **静的サイト** - サーバー不要、GitHub Pagesで完全動作
- **画像保護** - 右クリック・ドラッグ禁止機能

## 🔗 デモサイト

[**https://takasaito-dev.github.io/wanwan_marche_photos/**](https://takasaito-dev.github.io/wanwan_marche_photos/)

## 📁 プロジェクト構成

```
wanwan_marche_photos/
├── index.html              # トップページ（イベント一覧）
├── event.html              # イベント写真ページ
├── cart.html               # ショッピングカート
├── purchase-guide.html     # 購入ガイド
├── events.json             # イベント情報
├── [eventId].json          # 各イベントの写真リスト
├── styles/
│   └── main.css           # メインスタイルシート
├── scripts/
│   ├── index.js           # トップページ機能
│   ├── event.js           # イベントページ機能
│   ├── cart.js            # カート機能
│   ├── cart-utils.js      # カート管理ユーティリティ
│   ├── theme.js           # テーマ管理
│   ├── purchase-guide.js  # 購入ガイド機能
│   └── image-protection.js # 画像保護機能
├── photos/
│   └── [eventId]/         # イベントごとの写真フォルダ
│       └── *.jpg         # 写真ファイル
└── flyers/
    └── *.jpg             # イベントフライヤー画像
```

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/takasaito-dev/wanwan_marche_photos.git
cd wanwan_marche_photos
```

### 2. ローカル開発環境

**VS Code + Live Server拡張機能を使用：**

1. VS Codeでプロジェクトフォルダを開く
2. `index.html`を右クリック → "Open with Live Server"
3. ブラウザで自動的に開きます

**または、他のローカルサーバーを使用：**

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

### 3. GitHub Pagesでのデプロイ

1. GitHubでリポジトリを作成
2. リポジトリの Settings → Pages
3. Source を "Deploy from a branch" に設定
4. Branch を "main" に設定し、folder を "/ (root)" に設定

## 📸 イベント・写真の管理

### 新しいイベントの追加

1. **events.jsonに情報を追加：**
```json
{
  "id": "20250801-summer-festival",
  "name": "2025-08-01 夏祭り",
  "date": "2025-08-01",
  "description": "夏の思い出を写真に残しました。",
  "flyerImage": "flyers/20250801-summer-festival.jpg"
}
```

2. **写真リストファイルを作成：**
`20250801-summer-festival.json`
```json
[
  "DSC_001.jpg",
  "DSC_002.jpg",
  "DSC_003.jpg"
]
```

3. **写真とフライヤーをアップロード：**
- `photos/20250801-summer-festival/` に写真を配置
- `flyers/` にフライヤー画像を配置

### 販売終了イベントの設定

イベントの写真販売を終了する場合：

```json
{
  "id": "20250323-tsuruta-labo",
  "name": "わんわんマルシェ in TSURUTA LABO",
  "date": "2025-03-23",
  "description": "TSURUTA LABOで開催されたわんわんマルシェの写真です。",
  "flyerImage": "flyers/20250323wanwanmarche.jpg",
  "salesEnded": true
}
```

## 🛠️ 技術仕様

### 技術スタック
- **HTML5 + CSS3 + Vanilla JavaScript**
- **ES6+ モジュール**
- **CSS Grid + Flexbox**
- **localStorage**（カート機能）
- **WAI-ARIA**（アクセシビリティ）

### 対応ブラウザ
- Chrome 80+
- Firefox 78+
- Safari 13.1+
- Edge 80+

### 主要機能
- **レスポンシブデザイン** - モバイルファースト設計
- **ライトボックス** - 写真の拡大表示
- **ショッピングカート** - localStorage使用
- **メール注文** - mailtoリンク
- **画像保護** - 右クリック・ドラッグ禁止
- **テーマ管理** - ダークモード対応

## 🎨 カスタマイズ

### スタイルの変更
```css
/* styles/main.css の :root セクションを編集 */
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
}
```

### 注文先メールアドレスの変更
```javascript
// scripts/cart.js の該当部分を編集
const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
```

## 🐛 トラブルシューティング

### よくある問題

1. **写真が表示されない**
   - ファイルパスが正しいか確認
   - 画像ファイルが存在するか確認
   - ブラウザの開発者ツールでエラーを確認

2. **モジュールが読み込まれない**
   - `type="module"`が設定されているか確認
   - CORS エラーの場合は Live Server を使用

3. **カートが動作しない**
   - localStorage が有効になっているか確認
   - プライベートモードを無効にする

### デバッグ方法
- ブラウザの開発者ツールでコンソールを確認
- Network タブで読み込みエラーを確認
- Application タブで localStorage を確認

## 📝 更新履歴

- **2025-07-18**: 初回リリース
- **2025-07-20**: TSURUTA LABOイベント追加
- 画像保護機能追加
- 購入ガイドページ追加

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🤝 コントリビューション

プルリクエストやIssueを歓迎します。大きな変更を行う場合は、事前にIssueで相談してください。

## 📞 お問い合わせ

- **GitHub Issues**: [プロジェクトのIssue](https://github.com/takasaito-dev/wanwan_marche_photos/issues)
- **デモサイト**: [https://takasaito-dev.github.io/wanwan_marche_photos/](https://takasaito-dev.github.io/wanwan_marche_photos/)

---

**わんわんマルシェの素敵な思い出を写真でお届けします！** 🐕📸
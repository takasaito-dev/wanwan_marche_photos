# わんマル写真販売 - 静的フォトセールサイト

## 概要
わんマル写真販売は、イベント写真を販売するための静的Webサイトです。バックエンドを必要とせず、VS Code + Live Serverで簡単に動作します。

## 機能

### 📱 主要機能
- **イベント一覧ページ** - `events.json`からイベントを読み込み表示
- **イベント写真ページ** - サムネイル表示、ライトボックス、複数選択機能
- **ショッピングカート** - localStorage使用、注文フォーム、mailto送信
- **レスポンシブデザイン** - CSS Grid/Flexboxによる現代的なレイアウト
- **ダークモード** - ライト/ダークテーマ切り替え
- **アクセシビリティ対応** - WAI-ARIAサポート、キーボードナビゲーション

### 🎨 UI/UX特徴
- モダンなデザイン（CSS変数、カスタムプロパティ）
- タッチフレンドリーなインターフェース
- 直感的なナビゲーション
- カート数量バッジ
- エラーハンドリング

## ファイル構成

```
わんマル写真販売/
├── index.html              # トップページ
├── event.html              # イベント写真ページ
├── cart.html               # カートページ
├── events.json             # イベント情報
├── [eventId].json          # 各イベントの写真リスト
├── styles/
│   └── main.css           # メインスタイルシート
├── scripts/
│   ├── index.js           # トップページスクリプト
│   ├── event.js           # イベントページスクリプト
│   ├── cart.js            # カートページスクリプト
│   ├── cart-utils.js      # カート管理ユーティリティ
│   └── theme.js           # テーマ管理
└── photos/
    └── [eventId]/
        └── medium/        # 中画質画像（グリッドとライトボックスで使用）
```

## セットアップ

1. **必要なツール**
   - VS Code
   - Live Server拡張機能

2. **起動方法**
   ```
   1. VS Codeでプロジェクトフォルダを開く
   2. index.htmlを右クリック → "Open with Live Server"
   3. ブラウザで自動的に開きます
   ```

3. **写真の追加**
   - 新しいイベントの場合：
     - `events.json`にイベント情報を追加
     - `[eventId].json`に写真ファイル名リストを作成
     - `photos/[eventId]/`に写真を配置

## 使用方法

### 👥 訪問者の操作フロー
1. **トップページ** でイベントを選択
2. **イベントページ** で写真を選択・プレビュー
3. **カートページ** で注文情報を入力
4. 注文確定でメールクライアントが起動

### 🔧 管理者の操作
1. **新しいイベントの追加**
   ```json
   // events.jsonに追加
   {
     "id": "20250801-summer-festival",
     "name": "2025-08-01 夏祭り",
     "date": "2025-08-01",
     "description": "夏の思い出を写真に残しました。"
   }
   ```

2. **写真の管理**
   ```json
   // 20250801-summer-festival.jsonを作成
   [
     "SUMMER_001.jpg",
     "SUMMER_002.jpg",
     "SUMMER_003.jpg"
   ]
   ```

3. **写真ファイルの配置**
   ```
   photos/20250801-summer-festival/
   └── medium/
       ├── SUMMER_001.jpg  # 中画質 (推奨: 800x600px)
       ├── SUMMER_002.jpg
       └── SUMMER_003.jpg
   ```

## 技術仕様

### 🛠️ 技術スタック
- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **モジュール**: ES Modules (`import`/`export`)
- **ストレージ**: localStorage
- **レスポンシブ**: CSS Grid, Flexbox
- **アクセシビリティ**: WAI-ARIA, キーボードナビゲーション

### 📱 対応ブラウザ
- Chrome 80+
- Firefox 78+
- Safari 13.1+
- Edge 80+

### 🎨 デザインシステム
- **カラーパレット**: CSS変数によるテーマ管理
- **タイポグラフィ**: システムフォント使用
- **アイコン**: Unicode絵文字
- **レスポンシブ**: Mobile-first設計

## カスタマイズ

### 🎨 スタイルの変更
```css
/* styles/main.css の :root セクションを編集 */
:root {
    --primary-color: #2563eb;  /* メインカラー */
    --secondary-color: #64748b; /* セカンダリカラー */
    /* ... */
}
```

### 📧 メール設定
```javascript
// scripts/cart.js の mailtoLink を編集
const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
```

### 🌐 多言語対応
- HTML の `lang` 属性を変更
- UI テキストを該当言語に翻訳
- 日付フォーマットを地域に合わせて調整

## トラブルシューティング

### 🔍 よくある問題

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

### 🐛 デバッグ方法
- ブラウザの開発者ツールでコンソールを確認
- Network タブで読み込みエラーを確認
- Application タブで localStorage を確認

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

## 連絡先

質問やサポートが必要な場合は、プロジェクトの Issue トラッカーまでお問い合わせください。
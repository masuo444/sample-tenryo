# 天領酒造 GPT API連携チャットボット セットアップガイド

## 概要
このガイドでは、天領酒造のWebサイトにGPT APIを使用した多言語対応チャットボットを設定する方法を説明します。

## 機能
- 🌐 **多言語自動対応**: 質問された言語を自動検出し、同じ言語で回答
- 🤖 **GPT-4/GPT-3.5対応**: OpenAI APIを使用した高度な対話
- 🔄 **フォールバック機能**: API接続失敗時はローカル応答を使用
- 💬 **セッション管理**: 会話の文脈を保持
- 🍶 **天領酒造専門知識**: 銘柄、歴史、見学案内に特化

## 対応言語
- 日本語 (ja)
- English (en)
- 中文 (zh)
- 한국어 (ko)
- Français (fr)
- Español (es)

## セットアップ手順

### 1. 必要なもの
- Node.js (v14以上)
- OpenAI APIキー（[OpenAI Platform](https://platform.openai.com/api-keys)から取得）
- テキストエディタ

### 2. 依存パッケージのインストール

```bash
# プロジェクトディレクトリに移動
cd /Users/masuo/Desktop/クラバトラー/

# パッケージをインストール
npm install
```

### 3. 環境変数の設定

1. `.env.example`を`.env`にコピー:
```bash
cp .env.example .env
```

2. `.env`ファイルを編集してAPIキーを設定:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### 4. サーバーの起動

```bash
# 本番モード
npm start

# 開発モード（自動リロード付き）
npm run dev
```

サーバーが起動すると以下のメッセージが表示されます：
```
Server running on http://localhost:3000
Make sure to set OPENAI_API_KEY in .env file
```

### 5. Webサイトの起動

1. 別のターミナルを開く
2. `index.html`をブラウザで開く、または簡易サーバーを起動:

```bash
# Python 3を使用する場合
python3 -m http.server 8080

# Node.jsの場合
npx http-server -p 8080
```

3. ブラウザで `http://localhost:8080` にアクセス

## 使い方

### チャットボットの利用

1. **チャットボタンをクリック**: 画面右下の💬ボタンをクリック
2. **言語を自動検出**: 日本語、英語、中国語など、お好きな言語で質問
3. **音声入力も可能**: 🎤ボタンで音声入力（対応ブラウザのみ）

### 質問例

**日本語:**
- 「おすすめの日本酒を教えて」
- 「純米大吟醸について詳しく知りたい」
- 「酒蔵見学の予約方法は？」

**English:**
- "What sake do you recommend?"
- "Tell me about your brewery history"
- "How can I book a brewery tour?"

**中文:**
- "推荐什么清酒？"
- "介绍一下纯米大吟酿"
- "如何预约参观酒窖？"

## 設定のカスタマイズ

### GPTモデルの変更

`chatbot-server.js`の以下の部分を編集:

```javascript
// GPT-4を使用（高性能・高コスト）
model: "gpt-4-turbo-preview"

// GPT-3.5を使用（バランス型）
model: "gpt-3.5-turbo"

// GPT-3.5の16kトークン版（長文対応）
model: "gpt-3.5-turbo-16k"
```

### ローカル応答のみモード

GPT APIを使用せず、ローカル応答のみ使用する場合:

```javascript
// index.htmlのchatbot初期化部分
chatbot = new TenryoChatbot({
    useGPT: false, // GPTを無効化
    fallbackToLocal: true
});
```

### CORS設定（本番環境）

異なるドメインから利用する場合、`chatbot-server.js`を編集:

```javascript
app.use(cors({
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
}));
```

## トラブルシューティング

### APIキーエラー
- `.env`ファイルにAPIキーが正しく設定されているか確認
- APIキーが有効で、クレジットがあるか確認

### CORS エラー
- サーバーとクライアントが同じポートで動作していないか確認
- 本番環境では適切なCORS設定を行う

### 日本語が文字化けする
- ファイルのエンコーディングがUTF-8であることを確認
- ブラウザの文字エンコーディング設定を確認

## 本番環境へのデプロイ

### 推奨構成

1. **バックエンド**: 
   - Heroku, AWS Lambda, Google Cloud Functions
   - PM2でのプロセス管理

2. **フロントエンド**:
   - Netlify, Vercel, AWS S3 + CloudFront
   - GitHub Pages（静的ホスティング）

3. **セキュリティ**:
   - HTTPS必須
   - APIキーは環境変数で管理
   - Rate Limiting実装
   - CORS適切に設定

### 環境変数（本番）

```env
OPENAI_API_KEY=sk-xxxx
PORT=443
NODE_ENV=production
ALLOWED_ORIGINS=https://tenryo-brewery.com
```

## コスト管理

### OpenAI API料金目安（2024年時点）

- **GPT-3.5-turbo**: $0.001 / 1Kトークン
- **GPT-4-turbo**: $0.01 / 1Kトークン

### コスト削減Tips

1. キャッシュの実装
2. 頻出質問はローカル応答を優先
3. トークン数の制限（max_tokens設定）
4. GPT-3.5を基本とし、必要時のみGPT-4

## サポート

質問や問題がある場合：
- GitHub Issues: [プロジェクトリポジトリ]
- メール: support@tenryo-brewery.com
- 電話: 0576-52-1515

## ライセンス

MIT License

---

Created by 天領酒造 Digital Team
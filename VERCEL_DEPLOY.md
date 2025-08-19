# Vercel デプロイガイド

## 🚀 Vercelへのデプロイ手順

### 1. Vercelアカウントの準備
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインイン
3. ダッシュボードにアクセス

### 2. プロジェクトのインポート
1. Vercelダッシュボードで「New Project」をクリック
2. 「Import Git Repository」を選択
3. `masuo444/sample-tenryo` リポジトリを選択
4. 「Import」をクリック

### 3. 環境変数の設定
デプロイ前に以下の環境変数を設定：

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

設定手順：
1. Project Settings → Environment Variables
2. 「Add」をクリック
3. Name: `OPENAI_API_KEY`
4. Value: OpenAI APIキーを入力
5. Environment: `Production`, `Preview`, `Development` すべて選択
6. 「Save」をクリック

### 4. ビルド設定（自動検出）
Vercelは`vercel.json`設定を自動で読み込みます：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    },
    {
      "src": "chatbot-server.js",
      "use": "@vercel/node"
    }
  ]
}
```

### 5. デプロイの実行
1. 「Deploy」ボタンをクリック
2. ビルドプロセスが開始
3. 成功すると本番URLが表示

### 6. カスタムドメインの設定（オプション）
1. Project Settings → Domains
2. 「Add」をクリック
3. ドメイン名を入力（例：tenryo-brewery.com）
4. DNS設定を更新

## 📁 デプロイされるファイル構成

### 静的ファイル
- `index.html` - メインページ
- `mobile.html` - モバイル版
- `chatbot-client.js` - フロントエンドスクリプト
- `クラバトラーキャラ.png` - キャラクター画像
- その他画像ファイル

### Serverless Functions
- `/api/*` - `chatbot-server.js`がServerless Functionsとして動作

## 🌐 アクセスURL

### 本番サイト
- **メインサイト**: `https://sample-tenryo.vercel.app`
- **モバイル版**: `https://sample-tenryo.vercel.app/mobile`
- **API エンドポイント**: `https://sample-tenryo.vercel.app/api/chat`

### プレビュー
- 各プルリクエストで自動プレビューURL生成
- `https://sample-tenryo-git-[branch-name]-masuo444.vercel.app`

## 🔧 更新・メンテナンス

### コードの更新
```bash
git add .
git commit -m "更新内容"
git push origin main
```
→ Vercelが自動でデプロイ

### 環境変数の更新
1. Vercel Dashboard → Project Settings
2. Environment Variables から編集
3. Redeploy（再デプロイ）を実行

### ログの確認
1. Vercel Dashboard → Functions
2. View Function Logs
3. エラーやAPIコールの状況を確認

## ⚠️ 注意点

### Serverless Functions制限
- **最大実行時間**: 10秒（設定済み）
- **メモリ制限**: 1024MB
- **リクエストサイズ**: 4.5MB

### OpenAI API制限
- **レート制限**: OpenAI APIの制限に準拠
- **トークン制限**: 500トークン/リクエスト（設定済み）
- **コスト管理**: 使用状況を定期監視

### CORS設定
プロダクション環境では`chatbot-server.js`のCORS設定を更新：

```javascript
app.use(cors({
    origin: ['https://sample-tenryo.vercel.app'],
    credentials: true
}));
```

## 📊 監視・分析

### Vercel Analytics
1. Project Settings → Analytics
2. 「Enable」でアクセス解析を有効化

### OpenAI Usage
1. OpenAI Dashboard → Usage
2. API使用量とコストを監視

### パフォーマンス
- Lighthouse Score: 90+ 目標
- Core Web Vitals監視
- エラー率 < 1% 維持

## 🆘 トラブルシューティング

### デプロイ失敗
1. ビルドログを確認
2. `vercel.json`の構文チェック
3. 環境変数の確認

### API エラー
1. Function Logsを確認
2. OpenAI API キーの有効性確認
3. API使用制限の確認

### 表示エラー
1. ブラウザの開発者ツールでコンソール確認
2. Network タブでAPIリクエスト状況確認
3. キャッシュクリア

## 🎯 推奨設定

### セキュリティ
- HTTPS強制（Vercelデフォルト）
- Security Headers追加
- Rate Limiting実装

### パフォーマンス
- 画像最適化（Vercel Image Optimization）
- CDN活用（Vercelデフォルト）
- Gzip圧縮（自動）

### SEO
- meta tags設定済み
- OpenGraph対応
- sitemap.xml追加推奨

---

📞 **サポート**: vercel-support@tenryo-brewery.com
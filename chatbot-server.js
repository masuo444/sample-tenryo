// Node.js + Express サーバー for GPT API integration
// 必要なパッケージをインストール:
// npm init -y
// npm install express cors dotenv openai body-parser

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI設定
const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // .envファイルにAPIキーを設定
});

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // 静的ファイルの提供

// 天領酒造の情報（システムプロンプト）
const SYSTEM_PROMPT = `
あなたは天領酒造のAI酒蔵ガイド「クラバトラー」です。
以下の情報を基に、質問に答えてください。質問された言語で回答してください。

【天領酒造について】
- 創業：1680年（延宝8年）、340年以上の歴史
- 所在地：岐阜県下呂市萩原町萩原1289-1
- 特徴：飛騨山脈の地下30mから汲み上げる超軟水を使用、100%酒造好適米使用

【主要銘柄】
1. 純米大吟醸 ひだほまれ天領
   - 精米歩合：45%
   - 特徴：岐阜県産「ひだほまれ」使用、華やかな香りとまろやかな味わい
   - 受賞：JAL国際線ビジネスクラス採用（2005-2009年）

2. 大吟醸 吟
   - 精米歩合：40%
   - 特徴：山田錦使用、フルーティーな吟醸香
   - 受賞：JAL国内線ファーストクラス採用（2011-2012年）

3. 特別純米酒 飛切り
   - 精米歩合：60%
   - 特徴：食中酒として最適、すっきりとした飲み口

4. 純米吟醸 ひだほまれ
   - 精米歩合：55%
   - 特徴：穏やかな香りと米の旨みが調和

5. 純米酒 天領
   - 精米歩合：65%
   - 特徴：定番純米酒、米の旨みをしっかり感じられる

6. 四季の酒 純米大吟醸
   - 精米歩合：50%
   - 特徴：季節限定、フレッシュな味わい

【見学案内】
- 営業時間：9:00〜17:00（最終受付16:00）
- 定休日：水曜日、年末年始
- 要予約：0576-52-1515

【言語対応】
訪問者の言語を自動検出し、日本語、英語、中国語、韓国語、フランス語、スペイン語など、
質問された言語で適切に回答してください。

【回答スタイル】
- 丁寧で親しみやすい口調
- 日本酒の専門用語は分かりやすく説明
- 具体的な商品推薦や見学案内を含める
- 質問言語と同じ言語で回答する
`;

// チャット履歴を保存（セッション管理が必要な場合）
const chatSessions = new Map();

// チャットエンドポイント
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default', language = 'auto' } = req.body;

        // セッション履歴を取得または初期化
        if (!chatSessions.has(sessionId)) {
            chatSessions.set(sessionId, []);
        }
        const history = chatSessions.get(sessionId);

        // OpenAI API呼び出し
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // または "gpt-3.5-turbo" でコスト削減
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history,
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
            presence_penalty: 0.6,
            frequency_penalty: 0.3
        });

        const response = completion.choices[0].message.content;

        // 履歴を更新（最大20メッセージまで保持）
        history.push(
            { role: "user", content: message },
            { role: "assistant", content: response }
        );
        if (history.length > 20) {
            history.splice(0, 2);
        }

        res.json({ 
            success: true, 
            response: response,
            detectedLanguage: detectLanguage(message)
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'チャットボットエラーが発生しました。',
            details: error.message 
        });
    }
});

// 言語検出ヘルパー関数
function detectLanguage(text) {
    // 簡単な言語検出（実際にはより高度な検出が必要）
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
        return 'ja'; // 日本語
    } else if (/[\u4E00-\u9FFF]/.test(text)) {
        return 'zh'; // 中国語
    } else if (/[\uAC00-\uD7AF]/.test(text)) {
        return 'ko'; // 韓国語
    } else {
        return 'en'; // デフォルトは英語
    }
}

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Tenryo Chatbot API' });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure to set OPENAI_API_KEY in .env file');
});
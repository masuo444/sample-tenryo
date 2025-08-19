// Vercel Serverless Function - ヘルスチェック

module.exports = async (req, res) => {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS リクエスト（プリフライト）への対応
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // ヘルスチェック情報を返す
    res.status(200).json({
        status: 'ok',
        service: 'Tenryo Brewery Chatbot API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || 'development',
        openai_configured: !!process.env.OPENAI_API_KEY
    });
};
// Netlify Serverless Function - ヘルスチェック

exports.handler = async (event, context) => {
    // CORS設定のためのヘッダー
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // OPTIONS リクエスト（プリフライト）への対応
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // ヘルスチェック情報を返す
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            status: 'ok',
            service: 'Tenryo Brewery Chatbot API (Netlify)',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            environment: process.env.NETLIFY ? 'production' : 'development',
            openai_configured: !!process.env.OPENAI_API_KEY
        })
    };
};
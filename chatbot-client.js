// GPT API連携用のチャットボットクライアント
class TenryoChatbot {
    constructor(config = {}) {
        this.apiEndpoint = config.apiEndpoint || 'http://localhost:3000/api/chat';
        this.sessionId = this.generateSessionId();
        this.useGPT = config.useGPT !== false; // デフォルトはGPT使用
        this.fallbackToLocal = config.fallbackToLocal !== false; // API失敗時のフォールバック
    }

    // セッションID生成
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // メッセージ送信
    async sendMessage(message) {
        // GPT APIを使用する場合
        if (this.useGPT) {
            try {
                const response = await this.sendToGPT(message);
                return response;
            } catch (error) {
                console.error('GPT API Error:', error);
                
                // フォールバック設定がある場合はローカル応答を使用
                if (this.fallbackToLocal) {
                    console.log('Falling back to local response...');
                    return this.generateLocalResponse(message);
                }
                
                throw error;
            }
        }
        
        // GPTを使用しない場合はローカル応答
        return this.generateLocalResponse(message);
    }

    // GPT APIへの送信
    async sendToGPT(message) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId,
                    language: this.detectLanguage(message)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }

            return data.response;
        } catch (error) {
            console.error('GPT API request failed:', error);
            throw error;
        }
    }

    // 言語検出
    detectLanguage(text) {
        // 日本語検出
        if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
            return 'ja';
        }
        // 中国語検出
        if (/[\u4E00-\u9FFF]/.test(text)) {
            return 'zh';
        }
        // 韓国語検出
        if (/[\uAC00-\uD7AF]/.test(text)) {
            return 'ko';
        }
        // フランス語の特徴的な文字
        if (/[àâäçèéêëîïôùûü]/i.test(text)) {
            return 'fr';
        }
        // スペイン語の特徴的な文字
        if (/[áéíóúñü¿¡]/i.test(text)) {
            return 'es';
        }
        // デフォルトは英語
        return 'en';
    }

    // ローカルフォールバック応答（多言語対応）
    generateLocalResponse(message) {
        const language = this.detectLanguage(message);
        const lowerMessage = message.toLowerCase();
        
        // 言語別の応答データ
        const responses = {
            ja: this.getJapaneseResponses(lowerMessage),
            en: this.getEnglishResponses(lowerMessage),
            zh: this.getChineseResponses(lowerMessage),
            ko: this.getKoreanResponses(lowerMessage),
            fr: this.getFrenchResponses(lowerMessage),
            es: this.getSpanishResponses(lowerMessage)
        };

        return responses[language] || responses['en'];
    }

    // 日本語応答
    getJapaneseResponses(message) {
        if (message.includes('おすすめ') || message.includes('どれ')) {
            return '初めての方には「特別純米酒 飛切り」がおすすめです。食中酒として最適で、どんな料理にも合います。<br><br>特別な日には「純米大吟醸 ひだほまれ天領」をどうぞ。JAL国際線でも採用された逸品です。';
        }
        if (message.includes('純米大吟醸')) {
            return '純米大吟醸「ひだほまれ天領」は、岐阜県産「ひだほまれ」を45%まで磨き上げた当蔵の最高峰です。<br><br>華やかな香りとまろやかな味わいが特徴で、JAL国際線ビジネスクラスでも採用されました。';
        }
        if (message.includes('見学')) {
            return '酒蔵見学は事前予約制で承っております。<br><br>【見学時間】9:00〜17:00（最終受付16:00）<br>【定休日】水曜日、年末年始<br>【予約】0576-52-1515<br><br>実際の酒造りの工程をご覧いただけます。';
        }
        if (message.includes('歴史')) {
            return '天領酒造は1680年（延宝8年）に創業した、340年以上の歴史を持つ酒蔵です。<br><br>創業者の日野屋佐兵衛は、近江国から飛騨に移り住み、この地の美しい自然と温かい人情に魅了されて酒造りを始めました。';
        }
        return '申し訳ございません。もう少し詳しくお聞かせいただけますか？<br><br>銘柄のご案内、酒蔵見学、歴史などについてお答えできます。';
    }

    // 英語応答
    getEnglishResponses(message) {
        if (message.includes('recommend') || message.includes('which')) {
            return 'For first-timers, I recommend "Tokubetsu Junmai Tobikiri" - perfect as a food sake that pairs well with any cuisine.<br><br>For special occasions, try "Junmai Daiginjo Hidahomare Tenryo" - served on JAL international flights.';
        }
        if (message.includes('visit') || message.includes('tour')) {
            return 'Brewery tours are available by reservation.<br><br>【Hours】9:00-17:00 (last entry 16:00)<br>【Closed】Wednesdays, Year-end/New Year<br>【Reservation】+81-576-52-1515<br><br>Experience the traditional sake brewing process.';
        }
        if (message.includes('history')) {
            return 'Tenryo Brewery was founded in 1680 (Enpō 8), with over 340 years of history.<br><br>Our founder moved from Omi Province to Hida, captivated by the beautiful nature and warm hospitality of this region.';
        }
        return 'I apologize, could you please provide more details?<br><br>I can help with product recommendations, brewery tours, and our history.';
    }

    // 中国語応答
    getChineseResponses(message) {
        if (message.includes('推荐') || message.includes('哪个')) {
            return '初次品尝推荐"特别纯米酒 飞切"，适合配餐，与任何料理都很搭配。<br><br>特别场合推荐"纯米大吟酿 飞驒誉天领"，曾被JAL国际航线采用。';
        }
        if (message.includes('参观') || message.includes('预约')) {
            return '酒窖参观需提前预约。<br><br>【营业时间】9:00-17:00（最后入场16:00）<br>【休息日】周三、年末年初<br>【预约电话】0576-52-1515<br><br>可以参观实际的酿酒过程。';
        }
        if (message.includes('历史')) {
            return '天领酒造创立于1680年（延宝8年），拥有340多年的历史。<br><br>创始人从近江国迁居到飞驒，被这里美丽的自然和温暖的人情所吸引，开始了酿酒事业。';
        }
        return '抱歉，请您详细说明一下。<br><br>我可以为您介绍产品、酒窖参观、历史等信息。';
    }

    // 韓国語応答
    getKoreanResponses(message) {
        if (message.includes('추천') || message.includes('어떤')) {
            return '처음 드시는 분께는 "특별 준마이슈 토비키리"를 추천합니다. 어떤 요리와도 잘 어울립니다.<br><br>특별한 날에는 "준마이 다이긴조 히다호마레 텐료"를 추천합니다. JAL 국제선에서도 채택된 명품입니다.';
        }
        if (message.includes('견학') || message.includes('예약')) {
            return '양조장 견학은 사전 예약제입니다.<br><br>【견학시간】9:00-17:00 (마지막 입장 16:00)<br>【휴무일】수요일, 연말연시<br>【예약】0576-52-1515<br><br>실제 술 제조 과정을 보실 수 있습니다.';
        }
        return '죄송합니다. 좀 더 자세히 말씀해 주시겠습니까?<br><br>제품 안내, 양조장 견학, 역사 등에 대해 답변드릴 수 있습니다.';
    }

    // フランス語応答
    getFrenchResponses(message) {
        if (message.includes('recommand') || message.includes('quel')) {
            return 'Pour les débutants, je recommande le "Tokubetsu Junmai Tobikiri" - parfait pour accompagner tous les plats.<br><br>Pour les occasions spéciales, essayez le "Junmai Daiginjo Hidahomare Tenryo" - servi sur les vols internationaux JAL.';
        }
        if (message.includes('visite')) {
            return 'Les visites de la brasserie sont sur réservation.<br><br>【Horaires】9h00-17h00<br>【Fermé】Mercredi, fin d\'année<br>【Réservation】+81-576-52-1515';
        }
        return 'Désolé, pourriez-vous donner plus de détails?<br><br>Je peux vous aider avec nos produits, les visites et notre histoire.';
    }

    // スペイン語応答
    getSpanishResponses(message) {
        if (message.includes('recomiend') || message.includes('cuál')) {
            return 'Para principiantes, recomiendo "Tokubetsu Junmai Tobikiri" - perfecto para acompañar cualquier comida.<br><br>Para ocasiones especiales, pruebe "Junmai Daiginjo Hidahomare Tenryo" - servido en vuelos internacionales de JAL.';
        }
        if (message.includes('visita')) {
            return 'Las visitas a la bodega requieren reserva.<br><br>【Horario】9:00-17:00<br>【Cerrado】Miércoles, fin de año<br>【Reserva】+81-576-52-1515';
        }
        return 'Lo siento, ¿podría proporcionar más detalles?<br><br>Puedo ayudar con productos, visitas y nuestra historia.';
    }
}

// グローバルに公開
window.TenryoChatbot = TenryoChatbot;
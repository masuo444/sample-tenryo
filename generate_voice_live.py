#!/usr/bin/env python3
"""
天領酒造クラバトラー音声生成スクリプト（本番版）
ElevenLabs APIで4分間のデモ音声を生成
"""

import requests
import json
import os
import time

# ElevenLabs設定
API_KEY = "sk_9f8320f53fac267ccbe7bcdd7aa36b691e993c13ad2f2f1e"
# 日本語対応の男性ボイス（執事風）
VOICE_ID = "pqHfZKP75CvOlQylNhV4"  # Bill - 落ち着いた男性声

# 音声設定（執事風・落ち着いた声質）
VOICE_SETTINGS = {
    "stability": 0.5,           # 声質の一貫性
    "similarity_boost": 0.75,    # ベース声との近さ
    "style": 0.3,               # 感情の抑揚（控えめ）
    "use_speaker_boost": True    # スピーカーブーストON
}

# 4分間デモ用スクリプト
DEMO_SCRIPTS = [
    {
        "id": "intro_1",
        "section": "クラバトラー自己紹介",
        "duration": 15,
        "text": """ようこそ、天領酒造へお越しくださいました。
        わたくしは「クラバトラー」と申します。"""
    },
    {
        "id": "intro_2", 
        "section": "クラバトラー自己紹介",
        "duration": 20,
        "text": """最新のAI技術により、この歴史ある蔵の物語を、
        皆様にお伝えする案内役として生まれました。
        クラバトラーという名前は、「蔵」と「バトラー」を組み合わせたもの。"""
    },
    {
        "id": "intro_3",
        "section": "クラバトラー自己紹介",
        "duration": 25,
        "text": """340年以上の歴史を持つこの蔵で、
        代々受け継がれてきた知恵と技、そして想いを、
        現代の技術でわかりやすくお伝えすることが、わたくしの使命でございます。"""
    },
    {
        "id": "history_1",
        "section": "天領酒造の歴史",
        "duration": 30,
        "text": """天領酒造の歴史は、延宝8年、西暦1680年まで遡ります。
        江戸時代前期、徳川4代将軍家綱の時代に、
        ここ飛騨国益田郡萩原村で産声を上げました。"""
    },
    {
        "id": "history_2",
        "section": "天領酒造の歴史",
        "duration": 30,
        "text": """「天領」という名は、江戸幕府の直轄地「天領飛騨」に由来します。
        幕府に納める年貢米の品質は極めて高く、
        その米と、飛騨山脈から湧き出る清冽な水が出会いました。"""
    },
    {
        "id": "terroir_1",
        "section": "飛騨のテロワール",
        "duration": 30,
        "text": """日本酒造りにおいて、最も重要な要素は「米」「水」「気候」、そして「人」です。
        天領酒造の仕込み水は、飛騨山脈の地下深くを流れる伏流水です。"""
    },
    {
        "id": "terroir_2",
        "section": "飛騨のテロワール",
        "duration": 30,
        "text": """標高3000メートル級の山々に降った雪が、
        長い年月をかけて地層を通り抜け、
        蔵の地下55メートルから汲み上げられます。"""
    },
    {
        "id": "philosophy_1",
        "section": "酒造り哲学",
        "duration": 30,
        "text": """天領酒造が340年以上守り続けてきたのは、「手造りの心」です。
        機械化が進む現代でも、麹造りは職人の手によって行われます。"""
    },
    {
        "id": "philosophy_2",
        "section": "酒造り哲学",
        "duration": 30,
        "text": """「酒は生き物」—これが私たちの信念です。
        職人は、泡の立ち方、香り、音、そして舌で感じる味の変化から、
        酒の声を聴き取ります。"""
    },
    {
        "id": "closing",
        "section": "締めの言葉",
        "duration": 20,
        "text": """さて、これから皆様には、実際の酒造りの工程をご覧いただきます。
        340年の時を超えて受け継がれる、職人たちの技と想いを、
        どうぞごゆっくりとお楽しみください。"""
    }
]

def generate_voice(text: str, output_filename: str) -> bool:
    """ElevenLabs APIで音声を生成"""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": VOICE_SETTINGS
    }
    
    try:
        print(f"🎙️ 生成中: {output_filename}")
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            os.makedirs("audio/jp", exist_ok=True)
            filepath = f"audio/jp/{output_filename}"
            
            with open(filepath, "wb") as f:
                f.write(response.content)
            
            print(f"✅ 保存完了: {filepath}")
            return True
        else:
            print(f"❌ エラー: {response.status_code}")
            print(f"詳細: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 例外エラー: {e}")
        return False

def test_voice():
    """テスト音声を生成"""
    test_text = "こんにちは。わたくしはクラバトラーです。テスト音声です。"
    return generate_voice(test_text, "test.mp3")

def generate_demo_voices():
    """4分間デモの全音声を生成"""
    print("=" * 60)
    print("🍶 天領酒造クラバトラー デモ音声生成")
    print("=" * 60)
    
    success_count = 0
    total_duration = 0
    
    for script in DEMO_SCRIPTS:
        filename = f"{script['id']}.mp3"
        print(f"\n[{script['section']}] {script['duration']}秒")
        
        if generate_voice(script['text'], filename):
            success_count += 1
            total_duration += script['duration']
        
        # API制限対策
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"✅ 完了: {success_count}/{len(DEMO_SCRIPTS)} ファイル生成")
    print(f"📱 合計時間: {total_duration}秒 ({total_duration/60:.1f}分)")
    print("=" * 60)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        print("🔊 テスト音声を生成します...")
        if test_voice():
            print("✅ テスト成功！audio/jp/test.mp3 を確認してください")
    else:
        print("🎬 4分間デモ音声を生成します...")
        print("⚠️  料金が発生します。続行しますか？ (y/n): ", end="")
        if input().lower() == 'y':
            generate_demo_voices()
        else:
            print("キャンセルしました")
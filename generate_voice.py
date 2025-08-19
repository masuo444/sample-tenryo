#!/usr/bin/env python3
"""
天領酒造クラバトラー音声生成スクリプト
ElevenLabs APIを使用して執事風の落ち着いた男性音声を生成
"""

import requests
import json
import os
from typing import Dict, List

# ElevenLabs設定
API_KEY = "YOUR_ELEVENLABS_API_KEY"  # 実際のAPIキーに置換
VOICE_ID = "YOUR_VOICE_ID"  # 日本語対応の男性ボイスID

# 音声設定（執事風・落ち着いた声質）
VOICE_SETTINGS = {
    "stability": 0.4,           # 声質の一貫性（落ち着いた声）
    "similarity_boost": 0.7,     # ベース声との近さ
    "style": 0.4,               # 感情の抑揚（控えめ）
    "use_speaker_boost": True    # スピーカーブーストON
}

# スライドごとのナレーション台本
SCRIPTS = [
    {
        "id": "S0_0",
        "text": """ようこそ、天領酒造へ。
        まずは、お席にお掛けになって、正面のタブレットをご覧ください。"""
    },
    {
        "id": "S0_1",
        "text": """本ガイドは、約四十五分。
        前半は、座ったまま。後半は、各自のスマホに切り替わります。"""
    },
    {
        "id": "S0_2",
        "text": """未成年の方、または、運転予定の方の、試飲はできません。
        撮影は、スタッフの指示に従い、通路では、足元にご注意ください。"""
    },
    {
        "id": "S0_3",
        "text": """それでは、ご挨拶を。
        わたくしは、クラバトラー。本日の、ご案内役でございます。
        本日は、米・水・麹の物語から、発酵・品質、そして試飲へ。
        できるだけ歩かず、座って、じっくりお楽しみいただけるよう、構成しております。"""
    },
    {
        "id": "S1_1",
        "text": """天領酒造は、延宝八年、千六百八十年の創業。
        飛騨街道の宿場町、下呂市萩原に根ざし、
        飛騨の伏流水とともに、酒を醸してきました。"""
    },
    {
        "id": "S1_2",
        "text": """仕込みに使うのは、飛騨山脈を源流とする、地下水。
        蔵の敷地で、地下深くから汲み上げた、天然水です。"""
    }
]

def generate_voice(text: str, output_filename: str) -> bool:
    """
    ElevenLabs APIで音声を生成
    
    Args:
        text: 読み上げテキスト
        output_filename: 出力ファイル名
    
    Returns:
        成功時True、失敗時False
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",  # 日本語対応モデル
        "voice_settings": VOICE_SETTINGS
    }
    
    try:
        print(f"生成中: {output_filename}")
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            # 音声ファイルを保存
            os.makedirs("audio/jp", exist_ok=True)
            filepath = f"audio/jp/{output_filename}"
            
            with open(filepath, "wb") as f:
                f.write(response.content)
            
            print(f"✅ 保存完了: {filepath}")
            return True
        else:
            print(f"❌ エラー: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 例外エラー: {e}")
        return False

def generate_all_voices():
    """全スライドの音声を一括生成"""
    print("=" * 50)
    print("天領酒造クラバトラー音声生成開始")
    print("=" * 50)
    
    success_count = 0
    
    for script in SCRIPTS:
        filename = f"{script['id']}.mp3"
        if generate_voice(script['text'], filename):
            success_count += 1
        
        # API制限対策（1秒待機）
        import time
        time.sleep(1)
    
    print("=" * 50)
    print(f"完了: {success_count}/{len(SCRIPTS)} ファイル生成")
    print("=" * 50)

def test_connection():
    """API接続テスト"""
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": API_KEY}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            voices = response.json()["voices"]
            print("利用可能な日本語対応ボイス:")
            print("-" * 30)
            for voice in voices:
                if "ja" in voice.get("languages", []):
                    print(f"ID: {voice['voice_id']}")
                    print(f"名前: {voice['name']}")
                    print(f"説明: {voice.get('description', 'N/A')}")
                    print("-" * 30)
            return True
        else:
            print(f"接続エラー: {response.status_code}")
            return False
    except Exception as e:
        print(f"接続失敗: {e}")
        return False

if __name__ == "__main__":
    import sys
    
    # コマンドライン引数で動作を選択
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        # 接続テスト
        print("API接続テスト実行中...")
        test_connection()
    else:
        # 音声生成
        print("注意: API_KEYとVOICE_IDを設定してください")
        print("設定後、以下のコマンドで実行:")
        print("  python generate_voice.py")
        print("")
        print("接続テストを行う場合:")
        print("  python generate_voice.py test")
        
        # 実際の生成（APIキーが設定されている場合のみ）
        if API_KEY != "YOUR_ELEVENLABS_API_KEY":
            generate_all_voices()
        else:
            print("\n⚠️  APIキーが未設定です")
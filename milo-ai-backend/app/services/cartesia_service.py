import requests
import io

class CartesiaService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.tts_endpoint = "https://api.cartesia.ai/tts/bytes"
        self.stt_endpoint = "https://api.cartesia.ai/stt"
        self.version = "2025-04-16"

    def synthesize(self, text: str) -> bytes:
        payload = {
            "model_id": "sonic-2",
            "transcript": text,
            "voice": {
                "mode": "id",
                "id": "694f9389-aac1-45b6-b726-9d9369183238"
            },
            "output_format": {
                "container": "mp3",
                "bit_rate": 128000,
                "sample_rate": 44100
            },
            "language": "en"
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Cartesia-Version": self.version,
            "Content-Type": "application/json"
        }

        response = requests.post(self.tts_endpoint, json=payload, headers=headers)
        response.raise_for_status()
        return response.content

    def transcribe(self, audio_bytes: bytes, language: str = "en") -> str:
        """
        Transcribes a complete audio file using Cartesia's STT API.
        """
        files = {
            "file": ("audio.wav", io.BytesIO(audio_bytes), "audio/wav")
        }

        payload = {
            "model": "ink-whisper",
            "language": language,
            "timestamp_granularities[]": ["word"]
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Cartesia-Version": self.version
        }

        response = requests.post(self.stt_endpoint, headers=headers, files=files, data=payload)
        response.raise_for_status()

        transcription = response.json()
        return transcription.get("text", "")

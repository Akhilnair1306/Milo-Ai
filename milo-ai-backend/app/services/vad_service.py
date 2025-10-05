from silero_vad import load_silero_vad, get_speech_timestamps
import torch
import base64
import numpy as np

# Load model once
vad_model = load_silero_vad()

def detect(audio_chunk_base64: str) -> bool:
    # Decode base64 audio chunk
    audio_bytes = base64.b64decode(audio_chunk_base64)

    # Convert bytes to a NumPy array of floats (assuming PCM16 WAV)
    audio_tensor = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0

    # Get speech timestamps
    speech_timestamps = get_speech_timestamps(audio_tensor, vad_model, sampling_rate=16000, return_seconds=True)

    # Return True if any speech detected
    return len(speech_timestamps) > 0

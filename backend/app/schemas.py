from typing import Dict, Optional
from pydantic import BaseModel


class AudioTrackResult(BaseModel):
    best_sentiment: str
    confidence: float
    scores: Dict[str, float]


class SarcasmResult(BaseModel):
    label: str
    confidence: float


class SentimentResponse(BaseModel):
    modality: str
    best_sentiment: str                # always one of Negative / Neutral / Positive
    confidence: float
    scores: Dict[str, float]           # Negative/Neutral/Positive probabilities, used for the main charts
    transcript: Optional[str] = None   # populated for audio/video: transcript in the ORIGINAL spoken language
    detected_language: Optional[str] = None   # e.g. "en", "hi" -- from Whisper's language detection
    translated_text: Optional[str] = None     # English text actually fed into the model, if translation occurred
    emotion_detail: Optional[Dict[str, float]] = None  # audio endpoint: raw 5-class emotion breakdown before mapping
    raw_output: Optional[float] = None
    sarcasm: Optional[SarcasmResult] = None       # audio endpoint: sarcasm read on the (English) transcript
    audio_track: Optional[AudioTrackResult] = None  # video endpoint: emotion read on the video's audio track

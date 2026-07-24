"""
Central configuration for the multimodal sentiment analysis backend.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
WEIGHTS_DIR = BASE_DIR / "weights"

TEXT_MODEL_PATH = os.getenv("TEXT_MODEL_PATH", str(WEIGHTS_DIR / "distilbert_model.pth"))
AUDIO_MODEL_PATH = os.getenv("AUDIO_MODEL_PATH", str(WEIGHTS_DIR / "audio_emotion_model.pth"))
VIDEO_MODEL_PATH = os.getenv("VIDEO_MODEL_PATH", str(WEIGHTS_DIR / "video_sentiment_model.pth"))

# Base transformer backbone used by the text model and the video model's frozen text branch
# (confirmed from the checkpoints: bert-base-uncased, 12 layers, 768 hidden size, 30522 vocab).
BERT_BACKBONE = "bert-base-uncased"
MAX_TEXT_LEN = 128

DEVICE = os.getenv("DEVICE", "cpu")

# ---- Label mappings (confirmed with the project owner) ----

# distilbert_model.pth -> BertForSequenceClassification, 2 RAW classes (Negative/Positive).
# The site displays 3 classes. Since this model was never trained with a "Neutral" class,
# Neutral is a DERIVED HEURISTIC: when the gap between Positive/Negative confidence is small,
# probability mass is reassigned to Neutral instead of forcing a coin-flip call. See
# app/utils/ternary_heuristic.py. NEUTRAL_MARGIN (0-1) controls how wide that zone is.
TEXT_LABELS = ["Negative", "Neutral", "Positive"]
NEUTRAL_MARGIN = 0.3

# audio_emotion_model.pth -> a pure CNN over mel-spectrograms (no text involved at all --
# reads acoustic tone/speaking style directly), 8 GENUINE trained emotion classes. Order
# follows the standard RAVDESS convention (01=neutral ... 08=surprised). If your training
# label order differs, reorder this list.
AUDIO_LABELS = ["Neutral", "Calm", "Happy", "Sad", "Angry", "Fearful", "Disgust", "Surprised"]

# The site's headline result is Negative/Neutral/Positive everywhere, so these 8 emotion
# classes are aggregated down to that 3-way bucket for the main result (the full 8-class
# breakdown is still shown separately as a detail panel). Adjust if you'd map any of these
# differently -- valence judgment calls are noted below.
AUDIO_EMOTION_TO_SENTIMENT = {
    "neutral": "Neutral",
    "calm": "Positive",       # calm = pleasant, low-arousal -> mildly positive
    "happy": "Positive",
    "sad": "Negative",
    "angry": "Negative",
    "fearful": "Negative",
    "disgust": "Negative",
    "surprised": "Neutral",   # ambiguous valence on its own
}

# video_sentiment_model.pth -> single logit -> sigmoid -> binary RAW output (Negative/Positive).
# No text branch, no "Neutral" class trained -- Neutral here is the same derived heuristic
# treatment as the text model (see app/utils/ternary_heuristic.py).
VIDEO_LABELS = ["Negative", "Neutral", "Positive"]

# Audio feature extraction (mel-spectrogram, for the emotion CNN)
AUDIO_SAMPLE_RATE = 22050
N_MELS = 128
N_FFT = 2048
HOP_LENGTH = 512
AUDIO_TIME_FRAMES = 100  # fixed width the Linear layer was trained on; clips are padded/truncated to match

# Video feature extraction
VIDEO_NUM_FRAMES = 16
VIDEO_FRAME_SIZE = 224

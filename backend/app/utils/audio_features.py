"""
Audio preprocessing for the emotion CNN: load any common audio format and
convert it into a fixed-size (128 mel bins x 100 time frames) log-mel
spectrogram, matching what audio_emotion_model.pth was trained on.
"""
import io
import librosa
import numpy as np
import torch

from app.config import AUDIO_SAMPLE_RATE, N_MELS, N_FFT, HOP_LENGTH, AUDIO_TIME_FRAMES


def extract_melspec(audio_bytes: bytes) -> torch.Tensor:
    y, sr = librosa.load(io.BytesIO(audio_bytes), sr=AUDIO_SAMPLE_RATE, mono=True)

    if y.size == 0:
        y = np.zeros(AUDIO_SAMPLE_RATE, dtype=np.float32)

    mel = librosa.feature.melspectrogram(
        y=y, sr=sr, n_mels=N_MELS, n_fft=N_FFT, hop_length=HOP_LENGTH
    )
    mel_db = librosa.power_to_db(mel, ref=np.max)  # shape (128, T)

    # Pad or truncate the time axis to exactly AUDIO_TIME_FRAMES so the fixed-size
    # Linear layer always receives the shape it was trained on, regardless of clip length.
    t = mel_db.shape[1]
    if t < AUDIO_TIME_FRAMES:
        pad_width = AUDIO_TIME_FRAMES - t
        mel_db = np.pad(mel_db, ((0, 0), (0, pad_width)), mode="constant", constant_values=mel_db.min())
    else:
        mel_db = mel_db[:, :AUDIO_TIME_FRAMES]

    # Fixed-range [0, 1] scaling based on librosa's dB reference, rather than per-sample
    # zero-mean/unit-variance normalization (more common in RAVDESS-style CNN pipelines).
    mel_db = (mel_db + 80.0) / 80.0
    mel_db = np.clip(mel_db, 0.0, 1.0)

    tensor = torch.from_numpy(mel_db).float().unsqueeze(0).unsqueeze(0)  # (1, 1, 128, 100)
    return tensor

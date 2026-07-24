"""
Audio emotion model.

`audio_emotion_model.pth` is a pure CNN over mel-spectrograms -- no text/BERT
involved at all, it reads acoustic tone and speaking style directly from the
audio signal. This is a plain state_dict (unlike sentiment_model.pth, which
was a wrapper dict).

Reconstructed architecture from the checkpoint's tensor shapes:
  conv.0  Conv2d(1  -> 16, kernel=3, padding=1)   conv.1  BatchNorm2d(16)   conv.2 ReLU  conv.3 MaxPool2d(2)
  conv.4  Conv2d(16 -> 32, kernel=3, padding=1)   conv.5  BatchNorm2d(32)  conv.6 ReLU  conv.7 MaxPool2d(2)
  conv.8  Conv2d(32 -> 64, kernel=3, padding=1)   conv.9  BatchNorm2d(64)  conv.10 ReLU conv.11 Flatten
  fc.0    Linear(51200 -> 256)   fc.1 ReLU   fc.2 Dropout   fc.3 Linear(256 -> 8)

51200 = 64 channels x 32 x 25, which only lines up with a 128-mel-bin x 100-frame
input spectrogram pooled twice (2x) -- so that's the fixed input shape this model
expects. See app/utils/audio_features.py for the matching extraction pipeline.

8 output classes -> genuine trained emotion classes, using the standard RAVDESS
label ordering. The site's headline result is Negative/Neutral/Positive, so these
8 classes are also aggregated into that 3-way bucket (see AUDIO_EMOTION_TO_SENTIMENT
in app/config.py) -- the full 8-class breakdown is returned separately as
emotion_detail for a secondary display panel.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F

from app.config import AUDIO_MODEL_PATH, AUDIO_LABELS, AUDIO_EMOTION_TO_SENTIMENT, DEVICE

DEBUG = True  # set to False once the audio page is behaving correctly

SENTIMENT_BUCKETS = ["Negative", "Neutral", "Positive"]


class AudioEmotionCNN(nn.Module):
    def __init__(self, num_classes: int = 8):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.Flatten(),
        )
        self.fc = nn.Sequential(
            nn.Linear(51200, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        return self.fc(self.conv(x))


class AudioSentimentModel:
    def __init__(self):
        self.device = torch.device(DEVICE)
        self.model = AudioEmotionCNN(num_classes=len(AUDIO_LABELS))
        state_dict = torch.load(AUDIO_MODEL_PATH, map_location=self.device)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

    @torch.no_grad()
    def predict(self, melspec: torch.Tensor):
        """
        melspec: FloatTensor of shape (1, 1, 128, 100)
        """
        melspec = melspec.to(self.device)
        logits = self.model(melspec)
        probs = F.softmax(logits, dim=-1).squeeze(0).cpu().tolist()

        if DEBUG:
            print("=" * 60)
            print("[AUDIO DEBUG] input melspec stats:")
            print(
                f"  shape={tuple(melspec.shape)} "
                f"min={melspec.min().item():.4f} max={melspec.max().item():.4f} "
                f"mean={melspec.mean().item():.4f} std={melspec.std().item():.4f}"
            )
            print(f"[AUDIO DEBUG] raw logits: {[round(x, 4) for x in logits.squeeze(0).cpu().tolist()]}")
            print(f"[AUDIO DEBUG] probs: {[round(p, 4) for p in probs]}")

        emotion_scores = {label: float(p) for label, p in zip(AUDIO_LABELS, probs)}

        # Aggregate the 8 raw emotion probabilities into the 3-way Negative/Neutral/Positive
        # bucket shown as the headline result. IMPORTANT: average within each bucket rather
        # than summing -- Negative has 4 member classes (Sad/Angry/Fearful/Disgust) while
        # Positive and Neutral each have only 2, so summing would give Negative an automatic
        # ~2x advantage regardless of the actual input, especially when the raw distribution
        # is fairly flat/uninformative. Averaging removes that structural bias.
        bucket_probs = {bucket: [] for bucket in SENTIMENT_BUCKETS}
        for label, prob in zip(AUDIO_LABELS, probs):
            bucket = AUDIO_EMOTION_TO_SENTIMENT.get(label.lower(), "Neutral")
            bucket_probs[bucket].append(prob)

        bucket_means = {b: (sum(v) / len(v) if v else 0.0) for b, v in bucket_probs.items()}
        total = sum(bucket_means.values()) or 1.0
        sentiment_scores = {b: bucket_means[b] / total for b in SENTIMENT_BUCKETS}

        best_sentiment = max(sentiment_scores, key=sentiment_scores.get)
        confidence = sentiment_scores[best_sentiment]

        if DEBUG:
            print(f"[AUDIO DEBUG] aggregated sentiment: {sentiment_scores}")
            print("=" * 60)

        return {
            "best_sentiment": best_sentiment,
            "confidence": float(confidence),
            "scores": sentiment_scores,
            "emotion_detail": emotion_scores,
        }


_audio_model_singleton = None


def get_audio_model() -> AudioSentimentModel:
    global _audio_model_singleton
    if _audio_model_singleton is None:
        _audio_model_singleton = AudioSentimentModel()
    return _audio_model_singleton

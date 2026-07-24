"""
Video sentiment model.

This `video_sentiment_model.pth` is the simple single-head version (confirmed
via its exact weight shapes): `Linear(512->128)->ReLU->Dropout->Linear(128->1)`.
It takes ONLY the 512-dim ResNet-18 visual feature -- no text/BERT branch at
all -- and outputs a single logit -> sigmoid -> binary Negative/Positive.

Since it's binary (never trained with a "Neutral" class), Neutral is a
DERIVED HEURISTIC here too, same treatment as the text model: see
app/utils/ternary_heuristic.py.
"""
import torch
import torch.nn as nn

from app.config import VIDEO_MODEL_PATH, DEVICE
from app.utils.ternary_heuristic import to_ternary

DEBUG = True  # set to False once the video page is behaving correctly


class VideoSentimentHead(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 1),
        )

    def forward(self, x):
        return self.fc(x)


class VideoSentimentModel:
    def __init__(self):
        self.device = torch.device(DEVICE)
        self.model = VideoSentimentHead()
        state_dict = torch.load(VIDEO_MODEL_PATH, map_location=self.device)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

    @torch.no_grad()
    def predict(self, video_feature: torch.Tensor, transcript: str = ""):
        """
        video_feature: FloatTensor of shape (1, 512) -- averaged, face-cropped ResNet-18 features
        transcript: accepted for interface compatibility with the router, but NOT used --
                    this checkpoint has no text branch.
        """
        video_feature = video_feature.to(self.device)
        logit = self.model(video_feature).squeeze(-1)  # shape (1,)
        prob_positive = torch.sigmoid(logit).item()
        prob_negative = 1.0 - prob_positive

        if DEBUG:
            print("=" * 60)
            print(
                f"[VIDEO DEBUG] video_feature stats: "
                f"min={video_feature.min().item():.4f} max={video_feature.max().item():.4f} "
                f"mean={video_feature.mean().item():.4f} std={video_feature.std().item():.4f}"
            )
            print(f"[VIDEO DEBUG] raw logit: {logit.item():.4f}  prob_positive: {prob_positive:.4f}")

        best_sentiment, confidence, scores = to_ternary(prob_negative, prob_positive)

        if DEBUG:
            print(f"[VIDEO DEBUG] ternary scores: {scores}")
            print("=" * 60)

        return {
            "best_sentiment": best_sentiment,
            "confidence": float(confidence),
            "scores": scores,
            "raw_output": float(logit.item()),
        }


_video_model_singleton = None


def get_video_model() -> VideoSentimentModel:
    global _video_model_singleton
    if _video_model_singleton is None:
        _video_model_singleton = VideoSentimentModel()
    return _video_model_singleton

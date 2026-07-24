"""
Shared heuristic that turns a binary Negative/Positive probability pair into a
3-way Negative/Neutral/Positive distribution.

Neither `distilbert_model.pth` nor `video_sentiment_model.pth` was trained with
a "Neutral" class -- they only ever output Negative vs. Positive. Rather than
force every borderline case into one bucket or the other, this reassigns
probability mass to "Neutral" when the model's confidence gap is small.

This is a presentation-layer heuristic, not a trained class. If p_pos and
p_neg are close (within NEUTRAL_MARGIN of each other), most of the mass goes
to Neutral; if the model is confident either way, this collapses back to the
model's original 2-class behavior almost exactly.
"""
from app.config import NEUTRAL_MARGIN


def to_ternary(p_negative: float, p_positive: float, margin: float = NEUTRAL_MARGIN):
    diff = p_positive - p_negative  # -1 (confidently negative) .. +1 (confidently positive)

    neutral_share = max(0.0, margin - abs(diff)) / margin  # 0..1
    remaining = 1.0 - neutral_share

    pos_score = remaining * p_positive
    neg_score = remaining * p_negative
    neutral_score = neutral_share

    scores = {"Negative": neg_score, "Neutral": neutral_score, "Positive": pos_score}
    best_label = max(scores, key=scores.get)
    confidence = scores[best_label]

    return best_label, confidence, scores

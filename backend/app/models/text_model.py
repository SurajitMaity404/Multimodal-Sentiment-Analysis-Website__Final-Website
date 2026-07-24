"""
Text sentiment model.

The checkpoint `distilbert_model.pth` was inspected directly (state_dict keys
and tensor shapes) and turned out to be a standard Hugging Face
`BertForSequenceClassification` built on bert-base-uncased:
  - 12 encoder layers, hidden size 768, vocab size 30522
  - a pooler (bert.pooler.dense)
  - a classifier head (classifier.weight: shape (2, 768))

So despite the filename, we load it with the BERT architecture, not DistilBERT.
"""
import torch
import torch.nn.functional as F
from transformers import BertTokenizerFast, BertForSequenceClassification

from app.config import TEXT_MODEL_PATH, BERT_BACKBONE, MAX_TEXT_LEN, DEVICE
from app.utils.ternary_heuristic import to_ternary


class TextSentimentModel:
    def __init__(self):
        self.device = torch.device(DEVICE)
        self.tokenizer = BertTokenizerFast.from_pretrained(BERT_BACKBONE)
        # The trained classifier head is Linear(768, 2) -- raw Negative/Positive.
        # "Neutral" is added afterwards as a presentation-layer heuristic (see predict()).
        self.model = BertForSequenceClassification.from_pretrained(
            BERT_BACKBONE, num_labels=2
        )
        state_dict = torch.load(TEXT_MODEL_PATH, map_location=self.device)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

    @torch.no_grad()
    def predict(self, text: str):
        encoded = self.tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=MAX_TEXT_LEN,
            return_tensors="pt",
        ).to(self.device)

        logits = self.model(**encoded).logits
        p_negative, p_positive = F.softmax(logits, dim=-1).squeeze(0).cpu().tolist()

        best_label, confidence, scores = to_ternary(p_negative, p_positive)
        return {
            "best_sentiment": best_label,
            "confidence": float(confidence),
            "scores": scores,
        }


# Loaded once, reused across requests
_text_model_singleton = None


def get_text_model() -> TextSentimentModel:
    global _text_model_singleton
    if _text_model_singleton is None:
        _text_model_singleton = TextSentimentModel()
    return _text_model_singleton

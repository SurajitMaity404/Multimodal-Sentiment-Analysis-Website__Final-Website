"""
Sarcasm detection for the Audio Analysis page.

Uses a public, pretrained model from the Hugging Face Hub --
`helinivan/english-sarcasm-detector` (bert-base-uncased fine-tuned on the
Kaggle "News Headlines Dataset For Sarcasm Detection"). No custom .pth file
needed; it downloads and caches automatically on first use, the same way
bert-base-uncased does for the text model.

Runs on the audio transcript (not the video/text models) since sarcasm
detection is inherently a text-understanding task.
"""
import string
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from app.config import DEVICE

SARCASM_MODEL_NAME = "helinivan/english-sarcasm-detector"
SARCASM_LABELS = ["Not Sarcastic", "Sarcastic"]  # model convention: 0 -> Not Sarcastic, 1 -> Sarcastic


def _preprocess(text: str) -> str:
    # Matches the model card's recommended preprocessing exactly.
    return text.lower().translate(str.maketrans("", "", string.punctuation)).strip()


class SarcasmDetector:
    def __init__(self):
        self.device = torch.device(DEVICE)
        self.tokenizer = AutoTokenizer.from_pretrained(SARCASM_MODEL_NAME)
        self.model = AutoModelForSequenceClassification.from_pretrained(SARCASM_MODEL_NAME)
        self.model.to(self.device)
        self.model.eval()

    @torch.no_grad()
    def predict(self, text: str):
        if not text or not text.strip():
            return {"label": "Not Sarcastic", "confidence": 1.0}

        cleaned = _preprocess(text)
        encoded = self.tokenizer(
            [cleaned], padding=True, truncation=True, max_length=64, return_tensors="pt"
        ).to(self.device)

        logits = self.model(**encoded).logits
        probs = F.softmax(logits, dim=-1).squeeze(0).cpu().tolist()
        best_idx = int(torch.tensor(probs).argmax())

        return {"label": SARCASM_LABELS[best_idx], "confidence": float(probs[best_idx])}


_sarcasm_singleton = None


def get_sarcasm_model() -> SarcasmDetector:
    global _sarcasm_singleton
    if _sarcasm_singleton is None:
        _sarcasm_singleton = SarcasmDetector()
    return _sarcasm_singleton

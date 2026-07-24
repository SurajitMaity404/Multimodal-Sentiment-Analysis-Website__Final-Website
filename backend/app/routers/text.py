from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.text_model import get_text_model
from app.utils.translation import translate_to_english
from app.schemas import SentimentResponse

router = APIRouter(prefix="/predict/text", tags=["text"])


class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


@router.post("", response_model=SentimentResponse)
def analyze_text(payload: TextRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text input is empty.")

    # distilbert_model.pth is fine-tuned on English-vocabulary BERT, so
    # non-English input is translated first rather than fed in directly.
    english_text, detected_language = translate_to_english(text)

    model = get_text_model()
    result = model.predict(english_text)

    return SentimentResponse(
        modality="text",
        best_sentiment=result["best_sentiment"],
        confidence=result["confidence"],
        scores=result["scores"],
        detected_language=detected_language,
        translated_text=english_text if detected_language and detected_language != "en" else None,
    )

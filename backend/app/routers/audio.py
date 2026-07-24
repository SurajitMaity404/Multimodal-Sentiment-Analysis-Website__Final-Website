from fastapi import APIRouter, UploadFile, File, HTTPException

from app.models.audio_emotion_model import get_audio_model
from app.models.sarcasm_model import get_sarcasm_model
from app.utils.audio_features import extract_melspec
from app.utils.transcription import transcribe_multilingual
from app.schemas import SentimentResponse, SarcasmResult

router = APIRouter(prefix="/predict/audio", tags=["audio"])

ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".flac", ".ogg", ".webm"}


@router.post("", response_model=SentimentResponse)
async def analyze_audio(file: UploadFile = File(...)):
    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format '{ext}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    # Primary result: pure acoustic tone/speaking-style read from the mel-spectrogram CNN --
    # no text/transcript involved in this prediction at all.
    melspec = extract_melspec(audio_bytes)
    emotion_model = get_audio_model()
    result = emotion_model.predict(melspec)

    # Parallel, independent: transcript (native + English) for display and sarcasm detection.
    # Multilingual -- Whisper auto-detects the spoken language.
    native_text, detected_language, english_text = transcribe_multilingual(
        audio_bytes, filename_hint=file.filename
    )

    sarcasm_result = None
    if english_text.strip():
        sarcasm_model = get_sarcasm_model()
        sarcasm_pred = sarcasm_model.predict(english_text)
        sarcasm_result = SarcasmResult(label=sarcasm_pred["label"], confidence=sarcasm_pred["confidence"])

    return SentimentResponse(
        modality="audio",
        best_sentiment=result["best_sentiment"],
        confidence=result["confidence"],
        scores=result["scores"],
        transcript=native_text or None,
        detected_language=detected_language,
        translated_text=english_text if detected_language and detected_language != "en" else None,
        emotion_detail=result["emotion_detail"],
        sarcasm=sarcasm_result,
    )

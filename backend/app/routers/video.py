from fastapi import APIRouter, UploadFile, File, HTTPException

from app.models.video_model import get_video_model
from app.models.audio_emotion_model import get_audio_model
from app.utils.video_features import extract_video_feature
from app.utils.video_audio_extract import extract_audio_track
from app.utils.audio_features import extract_melspec
from app.utils.transcription import transcribe_multilingual
from app.schemas import SentimentResponse, AudioTrackResult

router = APIRouter(prefix="/predict/video", tags=["video"])

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}


@router.post("", response_model=SentimentResponse)
async def analyze_video(file: UploadFile = File(...)):
    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video format '{ext}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    video_bytes = await file.read()
    if not video_bytes:
        raise HTTPException(status_code=400, detail="Uploaded video file is empty.")

    # Visual features (sampled + face-cropped frames -> ResNet-18 -> averaged 512-dim vector).
    video_feature = extract_video_feature(video_bytes, filename_hint=file.filename)

    # Audio track: extracted once, used two ways --
    #  (1) transcribed (native + English) for display, and for the audio-track emotion panel
    #  (2) run through the acoustic emotion CNN for a secondary, visual-independent reading
    # NOTE: video_sentiment_model.pth (this version) has no text branch -- the transcript is
    # NOT fed into it, only used for display and the secondary audio-track panel below.
    native_text, detected_language, english_text = "", None, ""
    audio_track_result = None
    audio_bytes = extract_audio_track(video_bytes, filename_hint=file.filename)
    if audio_bytes:
        native_text, detected_language, english_text = transcribe_multilingual(
            audio_bytes, filename_hint="audio.wav"
        )

        melspec = extract_melspec(audio_bytes)
        audio_model = get_audio_model()
        audio_pred = audio_model.predict(melspec)
        audio_track_result = AudioTrackResult(
            best_sentiment=audio_pred["best_sentiment"],
            confidence=audio_pred["confidence"],
            scores=audio_pred["scores"],
        )

    # Main result: purely from the visual feature (this checkpoint has no text branch).
    video_model = get_video_model()
    result = video_model.predict(video_feature, english_text)

    return SentimentResponse(
        modality="video",
        best_sentiment=result["best_sentiment"],
        confidence=result["confidence"],
        scores=result["scores"],
        transcript=native_text or None,
        detected_language=detected_language,
        translated_text=english_text if detected_language and detected_language != "en" else None,
        audio_track=audio_track_result,
    )

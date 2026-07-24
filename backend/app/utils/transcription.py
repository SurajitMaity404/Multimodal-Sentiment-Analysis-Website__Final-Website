"""
Speech-to-text for the Audio and Video pages, with multilingual support.

Uses faster-whisper, which is inherently multilingual (Whisper auto-detects
the spoken language across ~99 languages). Two things are produced:
  1. A transcript in the ORIGINAL spoken language (shown to the user)
  2. An English translation of that speech (fed into the sentiment/sarcasm
     models, since those are fine-tuned on English-vocabulary BERT and can't
     meaningfully process other languages directly)

Whisper supports direct speech-to-English translation as a first-class mode
(more reliable than transcribing natively then separately machine-translating
the text, since it's a single model pass tuned for exactly this). If the
detected language is already English, the second pass is skipped.
"""
import tempfile
import os
import re

_whisper_model = None

# Whisper emits these bracketed/parenthetical tags for non-speech audio (music,
# applause, silence, etc.) instead of leaving the transcript empty. Left as-is,
# these get tokenized as if they were meaningful spoken words (e.g. "Music"),
# which pollutes the fusion model's text branch with an unrelated signal on
# clips that have no actual speech.
_NON_SPEECH_PATTERN = re.compile(
    r"^\s*[\[\(]?\s*(music|musique|applause|laughter|silence|no speech|inaudible|background noise)\s*[\]\)]?\s*$",
    re.IGNORECASE,
)


def _is_non_speech(text: str) -> bool:
    return bool(_NON_SPEECH_PATTERN.match(text.strip()))


def _get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        from faster_whisper import WhisperModel
        _whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
    return _whisper_model


def transcribe_multilingual(audio_bytes: bytes, filename_hint: str = "audio.wav"):
    """
    Returns (native_text, detected_language, english_text).
    On any failure, returns ("", None, "") rather than raising -- callers
    should treat that as "no transcript available" and fall back gracefully.
    """
    suffix = os.path.splitext(filename_hint)[1] or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        model = _get_whisper_model()

        segments, info = model.transcribe(tmp_path, beam_size=1, task="transcribe")
        native_text = " ".join(seg.text.strip() for seg in segments).strip()
        detected_language = info.language  # e.g. "en", "hi", "es"

        if _is_non_speech(native_text):
            # No actual speech in this clip (e.g. Whisper tagged it "[Music]") --
            # don't feed a non-speech placeholder into the model as if it were
            # meaningful spoken content. Keep it for display, but treat it as
            # empty for the English text that actually drives the prediction.
            return native_text, detected_language, ""

        if detected_language == "en":
            english_text = native_text
        else:
            eng_segments, _ = model.transcribe(tmp_path, beam_size=1, task="translate")
            english_text = " ".join(seg.text.strip() for seg in eng_segments).strip()
            if _is_non_speech(english_text):
                english_text = ""

        return native_text, detected_language, english_text
    except Exception:
        return "", None, ""
    finally:
        os.remove(tmp_path)


def transcribe(audio_bytes: bytes, filename_hint: str = "audio.wav") -> str:
    """Backwards-compatible helper: just the English text, for callers that don't need
    the native-language transcript or detected language separately."""
    _, _, english_text = transcribe_multilingual(audio_bytes, filename_hint)
    return english_text

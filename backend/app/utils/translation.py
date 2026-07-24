"""
Translation for typed text input (Text page).

Unlike audio/video, there's no Whisper pass to lean on here -- the user types
text directly. Uses `langdetect` (offline, pure Python) to detect the
language, and `deep-translator` (free, no API key) to translate non-English
input to English before it's fed into `distilbert_model.pth`, which is
fine-tuned on English-vocabulary BERT.

Translation requires internet access at request time (calls Google
Translate's public endpoint under the hood). If detection or translation
fails for any reason, falls back to the original text rather than failing
the whole request -- results just won't be multilingual-corrected in that
case.
"""


def translate_to_english(text: str):
    """
    Returns (english_text, detected_language).
    detected_language is None if detection failed or text was already English.
    english_text == the original text if no translation was needed/possible.
    """
    try:
        from langdetect import detect

        detected_language = detect(text)
    except Exception:
        detected_language = None

    if detected_language is None or detected_language == "en":
        return text, detected_language

    try:
        from deep_translator import GoogleTranslator

        translated = GoogleTranslator(source="auto", target="en").translate(text)
        if translated and translated.strip():
            return translated.strip(), detected_language
    except Exception:
        pass

    return text, detected_language

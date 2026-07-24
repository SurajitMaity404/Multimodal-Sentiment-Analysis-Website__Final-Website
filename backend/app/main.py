import os

# Works around a known Windows conflict where PyTorch and faster-whisper's
# CTranslate2 backend both bundle their own OpenMP runtime (libiomp5md.dll),
# which otherwise crashes with "OMP: Error #15" the first time both are loaded
# in the same process. Must be set before torch/ctranslate2 get imported
# anywhere below (directly or via the routers).
os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "TRUE")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import text, audio, video

app = FastAPI(
    title="Multimodal Sentiment Analysis API",
    description="Text, audio, and video sentiment analysis backed by three trained PyTorch models.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text.router)
app.include_router(audio.router)
app.include_router(video.router)


@app.get("/health")
def health():
    return {"status": "ok"}

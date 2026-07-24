"""
Extracts the audio track from an uploaded video file (via the system `ffmpeg`
binary -- the same one needed for compressed audio formats) so it can be run
through the audio emotion CNN alongside the frame-based video model.

Returns None (rather than raising) if the video has no audio track, ffmpeg
isn't installed, or extraction otherwise fails -- callers should treat a None
result as "no audio-track reading available" and simply omit it.
"""
import subprocess
import tempfile
import os


def extract_audio_track(video_bytes: bytes, filename_hint: str = "video.mp4") -> bytes | None:
    suffix = os.path.splitext(filename_hint)[1] or ".mp4"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as vid_tmp:
        vid_tmp.write(video_bytes)
        vid_path = vid_tmp.name

    audio_path = vid_path + ".wav"

    try:
        result = subprocess.run(
            ["ffmpeg", "-y", "-i", vid_path, "-vn", "-ar", "22050", "-ac", "1", audio_path],
            capture_output=True,
            timeout=60,
        )
        if result.returncode != 0 or not os.path.exists(audio_path):
            return None

        with open(audio_path, "rb") as f:
            return f.read()
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception):
        return None
    finally:
        os.remove(vid_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)

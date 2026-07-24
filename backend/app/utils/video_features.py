"""
Video preprocessing: sample frames evenly from the uploaded video, crop to the
detected face (these are CMU-MOSI-style talking-head clips, and academic
fusion models for this kind of data are typically trained on face-cropped
frames rather than full frames -- background/camera movement otherwise
dominates a full-frame CNN's features), run each through an
ImageNet-pretrained ResNet-18 (final fc layer removed) to get a 512-dim
embedding per frame, then average across frames into a single 512-dim
video-level feature vector.

Falls back to the full frame if no face is detected, so non-talking-head
videos still get a (less optimal, but non-empty) visual reading rather than
a hard failure.
"""
import tempfile
import os

import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms

from app.config import VIDEO_NUM_FRAMES, VIDEO_FRAME_SIZE, DEVICE

_resnet = None
_face_cascade = None

_preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((VIDEO_FRAME_SIZE, VIDEO_FRAME_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def _get_resnet():
    global _resnet
    if _resnet is None:
        backbone = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        backbone.fc = nn.Identity()  # output the 512-dim pooled features directly
        backbone.eval()
        _resnet = backbone.to(torch.device(DEVICE))
    return _resnet


def _get_face_cascade():
    global _face_cascade
    if _face_cascade is None:
        # Ships bundled with opencv-python -- no separate download needed.
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        _face_cascade = cv2.CascadeClassifier(cascade_path)
    return _face_cascade


def _crop_to_face(frame_rgb: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2GRAY)
    cascade = _get_face_cascade()
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))

    if len(faces) == 0:
        return frame_rgb  # fall back to full frame

    # Largest detected face (by area) -- most likely the main subject.
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

    # Pad ~20% around the tight face box so hair/chin/expression context isn't clipped.
    pad_x, pad_y = int(w * 0.2), int(h * 0.2)
    x0 = max(0, x - pad_x)
    y0 = max(0, y - pad_y)
    x1 = min(frame_rgb.shape[1], x + w + pad_x)
    y1 = min(frame_rgb.shape[0], y + h + pad_y)

    return frame_rgb[y0:y1, x0:x1]


def _sample_frames(video_path: str, num_frames: int):
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total <= 0:
        cap.release()
        return []

    indices = sorted(set(
        int(i * (total - 1) / max(1, num_frames - 1)) for i in range(num_frames)
    ))
    frames = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if ok:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame)
    cap.release()
    return frames


@torch.no_grad()
def extract_video_feature(video_bytes: bytes, filename_hint: str = "video.mp4") -> torch.Tensor:
    suffix = os.path.splitext(filename_hint)[1] or ".mp4"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(video_bytes)
        tmp_path = tmp.name

    try:
        frames = _sample_frames(tmp_path, VIDEO_NUM_FRAMES)
        if not frames:
            # Degenerate/corrupt upload -- return a zero vector rather than crashing.
            return torch.zeros(1, 512)

        cropped_frames = [_crop_to_face(f) for f in frames]
        faces_found = sum(1 for orig, cropped in zip(frames, cropped_frames) if cropped.shape != orig.shape)
        print(f"[VIDEO DEBUG] face detected in {faces_found}/{len(frames)} sampled frames")

        resnet = _get_resnet()
        device = torch.device(DEVICE)
        batch = torch.stack([_preprocess(f) for f in cropped_frames]).to(device)  # (N, 3, 224, 224)
        features = resnet(batch)  # (N, 512)
        video_feature = features.mean(dim=0, keepdim=True)  # (1, 512)
        return video_feature.cpu()
    finally:
        os.remove(tmp_path)

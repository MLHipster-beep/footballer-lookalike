
import json
import os
import tempfile
import numpy as np

os.environ["DEEPFACE_HOME"] = os.path.dirname(os.path.abspath(__file__))  # must run BEFORE deepface import

from deepface import DeepFace

EMBEDDINGS_PATH = "data/embeddings.json"

def _load_embeddings():
    if not os.path.exists(EMBEDDINGS_PATH):
        raise FileNotFoundError(
            f"{EMBEDDINGS_PATH} not found. "
            "Run `python precompute_embeddings.py` first."
        )
    with open(EMBEDDINGS_PATH) as f:
        data = json.load(f)
    print(f"[matcher] Loaded {len(data)} footballer embeddings.")
    return data

FOOTBALLER_DATA = _load_embeddings()


def cosine_similarity(a: list, b: list) -> float:
    a, b = np.array(a, dtype=np.float32), np.array(b, dtype=np.float32)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def raw_to_display_pct(sim: float) -> float:
    return min(round(float(sim) * 250, 1), 99.0)


def find_lookalike(image_bytes: bytes) -> dict:
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        result = DeepFace.represent(
            img_path=tmp_path,
            model_name="Facenet",
            enforce_detection=True,
            detector_backend="mtcnn",
            align=False,         

        )
        user_embedding = result[0]["embedding"]

    except Exception as e:
        error_msg = str(e)
        if "Face could not be detected" in error_msg or "No face" in error_msg.lower():
            return {
                "success": False,
                "error": "No face detected in your photo. Try a clear, front-facing selfie with good lighting."
            }
        return {"success": False, "error": f"Processing error: {error_msg}"}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    # KNN: compute cosine similarity against every footballer
    scores = []
    for footballer in FOOTBALLER_DATA:
        sim = cosine_similarity(user_embedding, footballer["embedding"])
        scores.append({
            "name": footballer["name"],
            "nationality": footballer["nationality"],
            "club": footballer["club"],
            "position": footballer["position"],
            "image_url": footballer["image_url"],
            "similarity_pct": raw_to_display_pct(sim),
        })

    scores.sort(key=lambda x: x["similarity_pct"], reverse=True)

    return {
        "success": True,
        "top_match": scores[0],
        "top_5": scores[:5],
    }
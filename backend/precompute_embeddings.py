
import json
import os
import sys
import requests
import tempfile
import numpy as np
from deepface import DeepFace
from footballers import FOOTBALLERS

OUTPUT_PATH = "data/embeddings.json"
os.makedirs("data", exist_ok=True)


def download_image(url: str) -> str:
    """Download image to a temp file, return the temp path."""
    headers = {"User-Agent": "Mozilla/5.0 (compatible; FootballerLookalikeBot/1.0)"}
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    suffix = ".jpg"
    tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    tmp.write(resp.content)
    tmp.close()
    return tmp.name


def extract_embedding(image_path: str) -> list[float] | None:
    """Extract 128-dim face embedding using FaceNet via DeepFace."""
    try:
        result = DeepFace.represent(
            img_path=image_path,
            model_name="Facenet",
            enforce_detection=False,   
            detector_backend="opencv",
        )
        return result[0]["embedding"]
    except Exception as e:
        print(f"    Embedding failed: {e}")
        return None


def main():
    print(f"Precomputing embeddings for {len(FOOTBALLERS)} footballers...\n")
    output = []
    failed = []

    for i, footballer in enumerate(FOOTBALLERS, 1):
        name = footballer["name"]
        print(f"[{i:02d}/{len(FOOTBALLERS)}] {name} ... ", end="", flush=True)

        tmp_path = None
        try:
            tmp_path = download_image(footballer["image_url"])
            embedding = extract_embedding(tmp_path)

            if embedding is None:
                print("FAILED (no face detected)")
                failed.append(name)
                continue

            entry = {k: footballer[k] for k in footballer if k != "image_url"}
            entry["image_url"] = footballer["image_url"]
            entry["embedding"] = embedding
            output.append(entry)
            print(f"OK  ({len(embedding)}-dim vector)")

        except requests.exceptions.RequestException as e:
            print(f"FAILED (download error: {e})")
            failed.append(name)
        except Exception as e:
            print(f"FAILED ({e})")
            failed.append(name)
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f)

    print(f"\nSaved {len(output)} embeddings to {OUTPUT_PATH}")
    if failed:
        print(f" Failed ({len(failed)}): {', '.join(failed)}")
        print(" You can replace their image_url in footballers.py and re-run.")


if __name__ == "__main__":
    main()

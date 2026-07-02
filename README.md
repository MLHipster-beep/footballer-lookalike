# Football Lookalike AI

Upload a selfie → get matched to your World Cup 2026 footballer lookalike.

**Stack:** FastAPI + DeepFace (FaceNet) + React (Vite)

## How it works

1. **Pre-compute** — downloads 20 footballer photos and extracts a 128-dimensional
   face embedding (feature vector) for each using the FaceNet model
2. **Upload** — user uploads a selfie, server extracts their embedding
3. **KNN match** — cosine similarity between user's vector and all 20 footballer
   vectors, sorted by closest match

---

## Setup (one time)

### Backend

```bash
cd backend
pip install -r requirements.txt

python precompute_embeddings.py
```

### Frontend

```bash
cd frontend
npm install
```

---

## Run

**Terminal 1 — backend:**

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API endpoints

| Method | Endpoint       | Description                      |
| ------ | -------------- | -------------------------------- |
| `GET`  | `/`            | Health check                     |
| `GET`  | `/footballers` | List all 20 footballers          |
| `POST` | `/match`       | Upload face photo, get lookalike |

### /match example (curl)

```bash
curl -X POST http://localhost:8000/match \
  -F "file=@your_selfie.jpg"
```

### Response

```json
{
  "success": true,
  "top_match": {
    "name": "Kylian Mbappé",
    "nationality": "France",
    "club": "Real Madrid",
    "position": "Forward",
    "image_url": "...",
    "similarity_pct": 73.4
  },
  "top_5": [ ...5 closest matches... ]
}
```

---

## Adding more footballers

Edit `backend/footballers.py` — add a new entry to the `FOOTBALLERS` list:

```python
{
    "name": "Player Name",
    "nationality": "Country",
    "club": "Club",
    "position": "Forward / Midfielder / Defender / Goalkeeper",
    "image_url": "https://...",  # clear, front-facing photo
},
```

Then re-run `python precompute_embeddings.py`.

---

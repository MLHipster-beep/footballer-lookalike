
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Footballer Lookalike API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from matcher import find_lookalike, FOOTBALLER_DATA


@app.get("/")
def root():
    return {
        "status": "running",
        "footballers_loaded": len(FOOTBALLER_DATA),
        "endpoints": {
            "POST /match": "Upload a face photo, get your footballer lookalike",
            "GET  /footballers": "List all footballers in the database",
        },
    }


@app.get("/footballers")
def list_footballers():
    return [
        {
            "name": f["name"],
            "nationality": f["nationality"],
            "club": f["club"],
            "position": f["position"],
            "image_url": f["image_url"],
        }
        for f in FOOTBALLER_DATA
    ]


@app.post("/match")
async def match_footballer(file: UploadFile = File(...)):

    if file.content_type not in ("image/jpeg", "image/jpg", "image/png", "image/webp"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Send jpg, png, or webp."
        )

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    result = find_lookalike(contents)

    if not result["success"]:
        raise HTTPException(status_code=422, detail=result["error"])

    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

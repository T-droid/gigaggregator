from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db, get_all_gigs, clear_gigs
from .scrapper import scrape_reddit

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB table on startup
@app.on_event("startup")
def startup():
    init_db()

@app.post("/scrape")
def run_scraper():
    clear_gigs()
    scrape_reddit()
    return {"message": "Scrape complete!"}

@app.get("/gigs")
def list_gigs():
    gigs = get_all_gigs()
    # Convert tuples to JSON objects
    return [
        {
            "id": g[0],
            "title": g[1],
            "url": g[2],
            "content": g[3],
            "platform": g[4],
            "post_date": g[5],
            "tags": g[6].split(",") if g[6] else []
        }
        for g in gigs
    ]

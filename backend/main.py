from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import cases_router, news_router, partners_router, photoalbums_router, photos_router, reviews_router

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

app.include_router(cases_router)
app.include_router(news_router)
app.include_router(partners_router)
app.include_router(photoalbums_router)
app.include_router(photos_router)
app.include_router(reviews_router)

@app.get("/")
def api_root():
    return {"message": "Hakaton UISI API is running"}

@app.get("/health")
def api_health():
    return {"status": "healthy"}
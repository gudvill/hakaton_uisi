from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import stats_router, analytics_router, admin_router, acquaintance_router, faq_router, program_router, about_router, cases_router, news_router, partners_router, photoalbums_router, photos_router, reviews_router, registration_router

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://hakaton1.bizml.ru"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

BASE_MEDIA = "media"
MEDIA_FOLDERS = ["news", "partners", "reviews", "about", "albums"]
os.makedirs(BASE_MEDIA, exist_ok=True)
for folder in MEDIA_FOLDERS:
    os.makedirs(os.path.join(BASE_MEDIA, folder), exist_ok=True)
app.mount("/media", StaticFiles(directory=BASE_MEDIA), name="media")

app.include_router(stats_router)
app.include_router(analytics_router)
app.include_router(admin_router)
app.include_router(acquaintance_router)
app.include_router(faq_router)
app.include_router(about_router)
app.include_router(program_router)
app.include_router(news_router)
app.include_router(cases_router)
app.include_router(partners_router)
app.include_router(reviews_router)
app.include_router(photoalbums_router)
app.include_router(photos_router)
app.include_router(registration_router)

@app.get("/")
def api_root():
    return {"message": "Hakaton API работает"}

@app.get("/health")
def api_health():
    return {"status": "healthy"}
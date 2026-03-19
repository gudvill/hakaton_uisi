# Основной файл FastAPI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cases_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hakaton UISI API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
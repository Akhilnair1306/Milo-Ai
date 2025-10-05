from fastapi import FastAPI
from app.api.v1 import routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MiloAI Backend")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1")

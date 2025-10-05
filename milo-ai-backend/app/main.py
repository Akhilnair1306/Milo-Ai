from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import routes
from app.db.database import SessionLocal
from app.services.notification_service import reminder_notifier
from threading import Thread
import time as t

app = FastAPI(title="MiloAI Backend")

# CORS settings
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


@app.on_event("startup")
async def start_reminder_notifier():
    def run_notifier():
        while True:
            with SessionLocal() as db:
                reminder_notifier(db)  # Your function to check and notify reminders
            t.sleep(60)  # Check every minute

    Thread(target=run_notifier, daemon=True).start()

from sqlalchemy.orm import Session
from app.models import diary as models
from app.schemas import diary as schemas
from sqlalchemy import text
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
def create_diary_entry(db: Session, entry: schemas.DiaryEntryCreate, embedding: list):
    db_obj = models.DiaryEntry(
        user_id=entry.user_id,
        entry_text=entry.entry_text,
        embedding=embedding,
        entry_type=entry.entry_type,
        reminder_time=entry.reminder_time,
        is_recurring=entry.is_recurring
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def search_diary_entries(user_id: str, query_embedding: list, k: int):
    response = supabase.rpc("search_diary_entries", {
        "query_embedding": query_embedding,
        "match_count": k,
        "user_id_param": user_id
    }).execute()
    return response.data
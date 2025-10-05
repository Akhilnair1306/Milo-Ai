from pydantic import BaseModel
from typing import Optional
from datetime import datetime,time
from uuid import UUID
from enum import Enum

class EntryType(str, Enum):
    INFORMATION = "information"
    REMINDER = "reminder"
class DiaryEntryBase(BaseModel):
    entry_text: str
    entry_type: EntryType = EntryType.INFORMATION
    reminder_time: Optional[time] = None
    is_recurring: Optional[bool] = False

class DiaryEntryCreate(DiaryEntryBase):
    user_id: UUID

class DiaryEntryResponse(DiaryEntryBase):
    id: int
    user_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True

    

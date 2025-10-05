from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Boolean, Time, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from pgvector.sqlalchemy import Vector
import enum
import uuid

class EntryType(str, enum.Enum):
    INFORMATION = "information"
    REMINDER = "reminder"

class DiaryEntry(Base):
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    entry_text = Column(Text, nullable=False)
    embedding = Column(Vector(dim=384), nullable=True)  # pgvector-compatible
    created_at = Column(TIMESTAMP, server_default=func.now())

    entry_type = Column(Enum(EntryType), default=EntryType.INFORMATION, nullable=False)
    reminder_time = Column(Time, nullable=True)  # Time of day for reminder
    is_recurring = Column(Boolean, default=False)  # Daily recurring reminder

    user = relationship("User", back_populates="diary_entries")

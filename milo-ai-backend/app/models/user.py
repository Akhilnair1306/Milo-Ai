from sqlalchemy import Column, Integer, String, ForeignKey,Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum
from sqlalchemy.dialects.postgresql import UUID
import uuid

class RoleEnum(str, enum.Enum):
    caregiver = "caregiver"
    user = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)

    caregiver = relationship("Caregiver", back_populates="user", uselist=False)
    diary_entries = relationship("DiaryEntry", back_populates="user", cascade="all, delete-orphan")

class Caregiver(Base):
    __tablename__ = "caregivers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.caregiver)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    user = relationship("User", back_populates="caregiver")
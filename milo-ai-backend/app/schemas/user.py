from pydantic import BaseModel,EmailStr
from typing import Optional
from enum import Enum

class RoleEnum(str, Enum):
    caregiver = "caregiver"
    user = "user"

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: RoleEnum

    class Config:
        orm_mode = True

class CaregiverBase(BaseModel):
    name: str
    email: EmailStr

class CaregiverCreate(CaregiverBase):
    password: str
    patient_email: EmailStr
    role: RoleEnum = RoleEnum.caregiver

class CaregiverResponse(CaregiverBase):
    id:int
    role: RoleEnum
    user: Optional[UserResponse]

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
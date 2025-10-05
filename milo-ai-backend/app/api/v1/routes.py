from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException,status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas import diary as schemas
from app.schemas import user as User
from app.models import user as UserModel
from app.services import (
    diary_service,
    embedding_service,
    vad_service,
    cartesia_service,
    cerebras_service,
    auth_service
)
from app.services.cartesia_service import CartesiaService
import json
import os
from dotenv import load_dotenv
import base64
from passlib.context import CryptContext
from datetime import datetime, time
from app.models.diary import DiaryEntry,EntryType
from typing import List
load_dotenv()

router = APIRouter()
cartesia_service = CartesiaService(api_key=os.getenv("CARTESIA_API_KEY"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    print(password)
    # bcrypt only supports up to 72 bytes
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

def verify_password(plain,hashed):
    return pwd_context.verify(plain,hashed)
# async def detect_intent(user_input: str) -> str:
#     prompt = f"""
#     You are an intent detection system.
#     Classify the following text into one of the intents: "store_memory", "query", "smalltalk", "other".
#     Only return the intent as a single word.

#     Text: "{user_input}"
#     """
#     intent = await cerebras_service.generate_response(user_input, prompt)
#     return intent.strip().lower()

# ---------------- USER SIGNUP ----------------
@router.post("/signup/user", response_model=User.UserResponse)
def register_user(request: User.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel.User).filter(UserModel.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = UserModel.User(
        name=request.name,
        email=request.email,
        password=hash_password(request.password),
        role=UserModel.RoleEnum.user,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# ---------------- CAREGIVER SIGNUP ----------------
@router.post("/signup/caregiver", response_model=User.CaregiverResponse)
def register_caregiver(request: User.CaregiverCreate, db: Session = Depends(get_db)):
    # Check caregiver email
    existing_caregiver = db.query(UserModel.Caregiver).filter(UserModel.Caregiver.email == request.email).first()
    if existing_caregiver:
        raise HTTPException(status_code=400, detail="Caregiver email already registered")

    # Find the user (patient) by email
    patient = db.query(UserModel.User).filter(UserModel.User.email == request.patient_email).first()
    if not patient:
        raise HTTPException(status_code=404, detail="No patient found with this email")

    # Ensure patient is not already linked
    if patient.caregiver is not None:
        raise HTTPException(status_code=400, detail="This patient already has a caregiver assigned")

    new_caregiver = UserModel.Caregiver(
        name=request.name,
        email=request.email,
        password=hash_password(request.password),
        role=request.role,
        user_id=patient.id,
    )

    db.add(new_caregiver)
    db.commit()
    db.refresh(new_caregiver)

    return new_caregiver


# ---------------- LOGIN ----------------
@router.post("/login", response_model=User.Token)
def login(request: User.LoginRequest, db: Session = Depends(get_db)):
    # Try to find user or caregiver
    user = (
        db.query(UserModel.User).filter(UserModel.User.email == request.email).first()
        or db.query(UserModel.Caregiver).filter(UserModel.Caregiver.email == request.email).first()
    )

    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Default: user id is their own
    user_id_to_return = str(user.id)

    # If caregiver, get linked user's id
    if isinstance(user, UserModel.Caregiver):
        if user.user_id:
            user_id_to_return = str(user.user_id)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Caregiver not linked to a user")

    token_data = {"sub": user.email, "role": user.role.value, "id": user_id_to_return}
    token = auth_service.create_access_token(token_data)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id_to_return,
            "name": user.name,
            "email": user.email,
            "role": user.role.value
        }
    }


@router.post("/diary", response_model=schemas.DiaryEntryResponse)
def add_entry(entry: schemas.DiaryEntryCreate, db: Session = Depends(get_db)):
    embedding = embedding_service.generate_embedding(entry.entry_text)
    return diary_service.create_diary_entry(db, entry, embedding)


@router.get("/diary/search")
def search_diary(query: str, user_id: str, db: Session = Depends(get_db)):
    embedding = embedding_service.generate_embedding(query)
    results = diary_service.search_diary_entries(db, user_id, embedding, top_k=3)
    return {"results": results}

@router.get("/reminders/{user_id}", response_model=List[schemas.DiaryEntryResponse])
def get_reminders(user_id: str, db: Session = Depends(get_db)):
    """
    Fetch all reminders for a user starting from today and not completed yet.
    """
    now = datetime.now().time()

    reminders = (
        db.query(DiaryEntry)
        .filter(
            DiaryEntry.user_id == user_id,
            DiaryEntry.entry_type == EntryType.REMINDER,
            DiaryEntry.reminder_completed == False,
            DiaryEntry.reminder_time >= now
        )
        .order_by(DiaryEntry.reminder_time.asc())
        .all()
    )
    return reminders

@router.put("/reminders/{reminder_id}/complete", response_model=schemas.DiaryEntryResponse)
def mark_reminder_completed(reminder_id: int, db: Session = Depends(get_db)):
    reminder = db.query(DiaryEntry).filter(DiaryEntry.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    reminder.reminder_completed = True
    db.commit()
    db.refresh(reminder)
    return reminder
@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    db: Session = next(get_db())
    user_id = None
    conversation_context = []

    try:
        audio_data = bytearray()
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            if payload["type"] == "init":
                user_id = payload.get("user_id", None)
                await websocket.send_text(
                    json.dumps({"type": "init_ack", "message": "Session started"})
                )

            elif payload["type"] == "audio_full":
                message = await websocket.receive_bytes() 
                with open("received_audio.webm", "wb") as f:
                    f.write(message)

                print("Audio saved — you can play it with any media player!") # Receive raw binary
            # text_chunk = cartesia_service.transcribe(message)  # Pass bytes directly
                # if vad_service.detect(audio_chunk):
                text_chunk = cartesia_service.transcribe(message)
                conversation_context.append(f"User: {text_chunk}")
                await websocket.send_text(json.dumps({"type": "transcribed_text", "text": text_chunk}))
                # else:
                #     await websocket.send_text(
                #         json.dumps(
                #             {"type": "vad_silence", "message": "No speech detected"}
                #         )
                #     )

            elif payload["type"] == "query":
                query_text = payload["text"]
                intent = await cerebras_service.classify_intent(query_text)
                print(intent)
                if intent == "store_memory":
                    embedding = embedding_service.generate_embedding(query_text)
                    entry = schemas.DiaryEntryCreate(
                        user_id=user_id, entry_text=query_text
                    )
                    diary_service.create_diary_entry(db, entry, embedding)
                    bot_response = "Got it! I’ve saved this information for you."

                # Retrieve past memories
                else:

                    embedding = embedding_service.generate_embedding(query_text)
                    memories = diary_service.search_diary_entries(user_id,embedding, 3)
                    memory_context = "\n".join(m["entry_text"] for m in memories)

                    full_context = (
                        memory_context + "\n" + "\n".join(conversation_context)
                    )

                    bot_response = await cerebras_service.generate_response(
                        user_id, query_text, db
                    )

                    conversation_context.append(f"Bot: {bot_response}")

                    # Send bot response text

                await websocket.send_text(
                    json.dumps({"type": "bot_response_text", "text": bot_response})
                )
                # --- Cartesia synthesis ---
                audio_data = cartesia_service.synthesize(bot_response)

                # Send audio as base64 so the frontend can play it
                

                audio_b64 = base64.b64encode(audio_data).decode("utf-8")

                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "bot_response_audio",
                            "audio": audio_b64,
                            "format": "mp3",
                        }
                    )
                )

    except WebSocketDisconnect:
        print(f"Client disconnected: {user_id}")



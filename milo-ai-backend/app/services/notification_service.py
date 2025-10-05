from fastapi import BackgroundTasks
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from app.models.diary import DiaryEntry,EntryType
from sqlalchemy.orm import Session
def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "noreply@example.com"
    msg["To"] = to_email

    with smtplib.SMTP("smtp.example.com", 587) as server:
        server.starttls()
        server.login("testakhil1306@gmail.com", "akhil1306")
        server.send_message(msg)

def reminder_notifier(db: Session):
    now = datetime.now().time()
    reminders = (
        db.query(DiaryEntry)
        .filter(
            DiaryEntry.entry_type == EntryType.REMINDER,
            DiaryEntry.reminder_completed == False,
            DiaryEntry.reminder_time <= (datetime.now() + timedelta(minutes=10)).time(),
        )
        .all()
    )
    for reminder in reminders:
        send_email(
            to_email=reminder.user.email,  # assuming User model has email
            subject="Reminder Notification",
            body=f"Reminder: {reminder.entry_text} at {reminder.reminder_time}",
        )

from cerebras.cloud.sdk import AsyncCerebras
from datetime import datetime
import os
from dotenv import load_dotenv
from app.services.embedding_service import generate_embedding
from app.services.diary_service import search_diary_entries
from app.schemas.diary import DiaryEntryResponse
load_dotenv()
client = AsyncCerebras(api_key=os.getenv("CEREBRAS_API_KEY"))


async def classify_intent(user_input: str) -> str:
    classification_prompt = f"""
Classify the user's message into EXACTLY ONE intent category. Respond with ONLY the intent label, nothing else.

INTENT CATEGORIES:

1. store_memory
   - User wants to save new information
   - Recording events, appointments, facts, or personal notes
   - Keywords: "remember", "save", "note that", "I have", "mark", "record"
   - Examples: "I have a doctor's appointment tomorrow", "Remember that my son's name is John"

2. reminder_query
   - User wants to know about scheduled reminders or upcoming events
   - Questions about their schedule, appointments, or what's coming up
   - Keywords: "what's on", "my schedule", "reminders", "what do I have", "appointments today"
   - Examples: "What's on my schedule?", "Do I have any reminders?", "What appointments do I have today?"

3. query
   - User wants to retrieve previously stored information
   - Questions about past events, facts, or diary entries
   - Seeking information from memory or asking about stored data
   - Keywords: "what", "when", "where", "who", "tell me about", "find", "recall", "look up"
   - Examples: "What did I eat yesterday?", "Tell me about my last diary entry", "Who visited me last week?"

4. smalltalk
   - Casual conversation, greetings, pleasantries
   - General chat not related to memory functions
   - Keywords: "hello", "hi", "how are you", "thanks", "goodbye"
   - Examples: "Hello!", "How are you doing?", "Thank you so much"

5. other
   - Ambiguous requests, commands, or unclear messages
   - System-level requests or out-of-scope queries
   - Anything that doesn't clearly fit the above categories

CLASSIFICATION RULES:
- If the user is asking a question about information (past events, facts, entries) → query
- If the user is asking about future events or schedule → reminder_query
- If the user is telling you information to save → store_memory
- If uncertain between query and reminder_query, check: Is it about the future/schedule? → reminder_query. Is it about past/stored info? → query
- Respond with ONLY the intent label in lowercase

User message: "{user_input}"

Intent:"""

    chat_completion = await client.chat.completions.create(
        model="llama3.1-8b",
        messages=[
            {"role": "system", "content": "You are a precise intent classification system. Respond only with the intent label."},
            {"role": "user", "content": classification_prompt},
        ],
        temperature=0.1,  # Low temperature for consistent classification
        max_tokens=10     # Only need one word response
    )

    intent = chat_completion.choices[0].message.content.strip().lower()
    
    # Validation: ensure response is a valid intent
    valid_intents = {"store_memory", "reminder_query", "query", "smalltalk", "other"}
    if intent not in valid_intents:
        # Fallback logic if model returns unexpected format
        intent = "other"
    
    return intent


async def get_context(user_id: str, query: str, db) -> str:
    """
    Fetch relevant diary entries from Supabase to provide context for the bot.
    """
    # Use your embedding-based search
    embedding =  generate_embedding(query)
    results = search_diary_entries( user_id,embedding, k=5)
    entries = [DiaryEntryResponse(**entry) for entry in results]
    context_lines = []
    for entry in entries:
        line = f"- [{entry.entry_type}] {entry.entry_text}"
        if entry.entry_type == "reminder":
            line += f" (Reminder at {entry.reminder_time}, recurring: {entry.is_recurring})"
        context_lines.append(line)

    return "\n".join(context_lines)


async def generate_response(user_id: str, user_input: str, db) -> str:
    """
    Main bot function: classifies intent, fetches context, and generates a response.
    """
    # Step 1: Classify the intent
    intent = await classify_intent(user_input)

    # Step 2: Get context only for queries or reminders
    context = ""
    if intent in ["reminder_query", "query"]:
        context = await get_context(user_id, user_input, db)

    # Step 3: Build the prompt for LLM
    prompt = f"""
    You are an Alzheimer’s assistant bot.
    Intent: {intent}
    Context:
    {context}

    User: {user_input}
    Bot:
    """

    # Step 4: Generate response
    chat_completion = await client.chat.completions.create(
        model="llama3.1-8b",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": prompt},
        ],
    )

    return chat_completion.choices[0].message.content.strip()


# Example usage:
# response = await bot_reply(user_id="user-uuid", user_input="What reminders do I have today?", db=db)
# print(response)

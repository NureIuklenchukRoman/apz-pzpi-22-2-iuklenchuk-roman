from sqlalchemy import select
from fastapi import APIRouter, Depends

from app.database import get_db
from app.database.models import Message
from app.utils.auth import Authorization

from .schema import MessageResponseSchema


messages_router = APIRouter(prefix="/messages", tags=["messages"])


@messages_router.get("/", response_model=list[MessageResponseSchema])
async def get_messages(db=Depends(get_db), user=Depends(Authorization())):
    user_messages = select(Message).filter(Message.user_id == user.id)
    result = await db.execute(user_messages)
    messages = result.scalars().all()
    messages = [{"id": message.id, "text": message.text, "user_id": message.user_id, "created_at": str(message.created_at)} for message in messages]
    return messages

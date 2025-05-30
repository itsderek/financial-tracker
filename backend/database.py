from sqlmodel import SQLModel
# from sqlmodel.ext.asyncio.session import AsyncSession
# from sqlmodel.ext.asyncio.engine import create_async_engine
from sqlmodel import create_engine, Session
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True, future=True)

async_session = sessionmaker(
    engine, class_=Session, expire_on_commit=False
)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
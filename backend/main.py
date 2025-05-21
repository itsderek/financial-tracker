from fastapi import FastAPI, Depends
from sqlmodel import select
from models import Transaction, Category
from database import async_session, init_db
from sqlmodel.ext.asyncio.session import AsyncSession

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await init_db()

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

@app.post("/transactions/", response_model=Transaction)
async def create_transaction(tx: Transaction, session: AsyncSession = Depends(get_session)):
    session.add(tx)
    await session.commit()
    await session.refresh(tx)
    return tx

@app.get("/transactions/", response_model=list[Transaction])
async def list_transactions(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Transaction))
    return result.scalars().all()

@app.post("/categories/", response_model=Category)
async def create_category(cat: Category, session: AsyncSession = Depends(get_session)):
    session.add(cat)
    await session.commit()
    await session.refresh(cat)
    return cat

@app.get("/categories/", response_model=list[Category])
async def list_categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category))
    return result.scalars().all()

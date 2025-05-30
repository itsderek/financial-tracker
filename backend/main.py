from fastapi import FastAPI, Depends, UploadFile, File
from sqlmodel import select
from models import Transaction, Category
from database import async_session, init_db
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from typing import AsyncGenerator

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()  # startup logic
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
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
    result = await session.exec(select(Transaction))
    return result.scalars().all()

@app.post("/categories/", response_model=Category)
async def create_category(cat: Category, session: AsyncSession = Depends(get_session)):
    session.add(cat)
    await session.commit()
    await session.refresh(cat)
    return cat

@app.get("/categories/", response_model=list[Category])
async def list_categories(session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(Category))
    return result.scalars().all()


@app.get("/sayhi")
async def sayHi(session: AsyncSession = Depends(get_session)):
    print("hi!")
    result = await session.exec(select(Transaction))
    transactions = result.scalars().all()

    for tx in transactions:
        print(tx)
    
    return transactions

from datetime import date

@app.post("/sayhi")
async def postHi(session: AsyncSession = Depends(get_session)):
    print("woah there!")

    tx = Transaction(
        date=date.today(),
        description="Test transaction",
        amount=42.00,
        category="Test"
    )

    session.add(tx)
    await session.commit()
    await session.refresh(tx)

    return {"message": "Transaction inserted", "transaction": tx}


@app.get("/hi")
async def read_root():
    return {"Hello": "World"}

import csv
from io import StringIO
import logging
from pathlib import Path
import json

CONFIG_PATH = Path("/app/config/Ascend Import Metadata.json")

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    print('bigtest')

    # load config file
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            config_data = json.load(f)
        desired_fields = config_data.get("fields", [])
    else:
        print('error in loading config file')
        return {"error": "config file not found."}
    



    print(file.content_type)
    # if 'csv' not in file.content_type:
    # # if file.content_type != "text/csv":
    #     print('big error')
    #     return {"error": "Only CSV files are allowed"}

    contents = await file.read()
    decoded = contents.decode("utf-8")

    #desired_fields = ['Account ID', 'Date', 'Description', 'Amount']
    extracted_data = []
    reader = csv.DictReader(StringIO(decoded))

    for row in reader:
        filtered_row = {field: row[field] for field in desired_fields if field in row}
        extracted_data.append(filtered_row)


    print(f'CSV data: {extracted_data}')
    return {"message": "bigger test"}
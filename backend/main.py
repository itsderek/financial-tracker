from fastapi import FastAPI, Depends, UploadFile, File
from sqlmodel import select, Session
from models import Transaction, Category, Account
from database import init_db, engine
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from contextlib import asynccontextmanager

import csv
from io import StringIO
from pathlib import Path
import json
from datetime import date

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get-accounts", response_model=List[Account])
async def getAccounts():
    with Session(engine) as session:
        results = session.exec(select(Account)).all()
        return results


@app.get("/sayhi")
async def sayHi():
    print("hi!")
    with Session(engine) as session:
        result = session.exec(select(Transaction))
        transactions = result.all()
        for tx in transactions:
            print(f'another transaction: {tx}')
            # print(tx)
        
        return transactions



@app.post("/sayhi")
async def postHi():
    print("woah there!")
    tx = Transaction(
        date=date.today(),
        description="Test transaction",
        amount=42.00,
        category="Test"
    )

    with Session(engine) as session:
        session.add(tx)
        session.commit()
        session.refresh(tx)

    return {"message": "Transaction inserted", "transaction": tx}


def transactionToSQL(reader):
    pass

CONFIG_PATH = Path("/app/config/Ascend Import Metadata.json")

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            config_data = json.load(f)
        desired_fields = config_data.get("fields", [])
    else:
        print('error in loading config file')
        return {"error": "config file not found."}
    

    contents = await file.read()
    decoded = contents.decode("utf-8")

    extracted_data = []
    reader = csv.DictReader(StringIO(decoded))

    for row in reader:
        filtered_row = {field: row[field] for field in desired_fields if field in row}
        extracted_data.append(filtered_row)


    print(f'CSV data: {extracted_data}')
    return {"message": "bigger test"}
from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select, Session
from models import Account, AccountType
from database import init_db, engine
from typing import List
from contextlib import asynccontextmanager

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
api_router = APIRouter(prefix="/api")
app.include_router(api_router)

def get_session():
    with Session(engine) as session:
        yield session


@app.get("/get-account-types", response_model=List[AccountType])
async def getAccounts(session: Session = Depends(get_session)):
    results = session.exec(select(AccountType)).all()
    return results

@app.post("/create-account-type")
def createAccountType(account_type: AccountType, session: Session = Depends(get_session)):
    session.add(account_type)
    session.commit()
    session.refresh(account_type)
    return account_type


@app.get("/get-accounts", response_model=List[Account])
async def getAccounts(session: Session = Depends(get_session)):
    results = session.exec(select(Account)).all()
    return results


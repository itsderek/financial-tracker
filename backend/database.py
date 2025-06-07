import os
from sqlmodel import Session, SQLModel, create_engine
from dotenv import load_dotenv

load_dotenv()

# DATABASE_URL = "postgresql+psycopg2://finance_user:finance_pass@db:5432/finance_db"
#DATABASE_URL="postgresql://finance_user:finance_pass@db:5432/finance_db"
#engine = create_engine(DATABASE_URL, echo=True, future=True)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment vairable not set")

engine = create_engine(DATABASE_URL, echo=True, future=True)

def get_session():
    with Session(engine) as session:
        yield session

async_session = get_session()

def init_db():
    #engine = create_engine(DATABASE_URL, echo=True, future=True)
    SQLModel.metadata.create_all(engine)
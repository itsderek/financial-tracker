import os
from sqlmodel import Session, SQLModel, create_engine, select
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment vairable not set")

engine = create_engine(DATABASE_URL, echo=True, future=True)

def get_session():
    with Session(engine) as session:
        yield session

async_session = get_session()

def init_db():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        from models import AccountType

        existing = session.exec(select(AccountType)).first()
        if not existing:
            default_account_types = [
                AccountType(name="Bank Accout"),
                AccountType(name="Savings Account"),
                AccountType(name="Credit Card"),
            ]
            session.add_all(default_account_types)
            session.commit()


    with Session(engine) as session:
        from models import Account

        existing = session.exec(select(Account)).first()
        if not existing:
            default_account_types = [
                Account(name="TEST", account_type_id=1, institution="TEST", configuration={}),
            ]

            session.add_all(default_account_types)
            session.commit()
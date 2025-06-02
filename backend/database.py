from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = "postgresql+psycopg2://finance_user:finance_pass@db:5432/finance_db"
print(DATABASE_URL)
engine = create_engine(DATABASE_URL, echo=True, future=True)

def get_session():
    with Session(engine) as session:
        yield session

async_session = get_session()

def init_db():
    engine = create_engine(DATABASE_URL, echo=True, future=True)
    SQLModel.metadata.create_all(engine)
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    description: str
    amount: float
    category: str

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
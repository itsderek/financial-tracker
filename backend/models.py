from sqlmodel import SQLModel, Field, Column, JSON, Relationship
from typing import Optional, List
from datetime import date, datetime, timezone

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    account_id: int = Field(foreign_key="account.id")
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    transaction_date: date
    description: str
    amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    extra_fields: Optional[dict] = Field(default=None, sa_column=Column(JSON))

    account: Optional["Account"] = Relationship(back_populates="transactions")
    category: Optional["Category"] = Relationship(back_populates="transactions")

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    transactions: List["Transaction"] = Relationship(back_populates="category")

class AccountType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    accounts: list["Account"] = Relationship(back_populates="account_type")

class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    account_type_id: int = Field(foreign_key="accounttype.id")
    institution: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    transactions: List["Transaction"] = Relationship(back_populates="account")
    account_type: Optional["AccountType"] = Relationship(back_populates="accounts")


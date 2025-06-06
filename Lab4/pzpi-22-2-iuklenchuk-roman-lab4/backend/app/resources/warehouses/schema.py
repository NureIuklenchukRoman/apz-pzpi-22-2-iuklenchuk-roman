from .schema import *
from fastapi import Form
from datetime import date
from typing import Optional
from pydantic import BaseModel

class WarehouseSchema(BaseModel):
    name: str
    location: str
    size_sqm: float
    price_per_day: float
    # available_premium_services: list | None = None

class WarehouseDetails(BaseModel):
    id: int
    name: str
    location: str
    price_per_day: float
    size_sqm: float
    busy_dates: list[date]

class WarehouseCreateSchema(WarehouseSchema):
    pass

class WarehouseUpdateSchema(WarehouseSchema):
    name: Optional[str] = None
    location: Optional[str] = None
    size_sqm: Optional[float] = None
    price_per_day: Optional[float] = None
    # available_premium_services: Optional[list] = None

class WarehouseDeleteSchema(BaseModel):
    id: int


class WarehouseQuerySchema(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_size: Optional[float] = None
    max_size: Optional[float] = None
    is_blocked: Optional[bool] = None


class WarehouseResponseSchema(BaseModel):
    id: int
    name: str
    location: str | None = None
    size_sqm: float
    price_per_day: float
    is_blocked: bool = False
    # available_premium_services: list | None = None
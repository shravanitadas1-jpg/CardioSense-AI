from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class VitalsReading(BaseModel):
    heartRate: int = 0
    spo2: int = 0
    temperature: float = 0.0
    cardiacAge: int = 0
    ces: int = 0
    ecg: int = 0
    fingerDetected: bool = False
    connection: str = "offline"
    sensor: str = "MAX30102 / AD8232"
    lastUpdated: Optional[str] = None


class SaveReadingRequest(BaseModel):
    heartRate: int
    spo2: int
    temperature: float
    cardiacAge: Optional[int] = None
    ces: Optional[int] = None
    recovery: Optional[str] = None


class StoredReading(BaseModel):
    id: int
    date: str
    time: str
    heartRate: int
    spo2: int
    temperature: float
    cardiacAge: Optional[int] = None
    ces: Optional[int] = None
    recovery: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class AnalyticsResponse(BaseModel):
    cardiacAge: int = 0
    ces: int = 0
    stress: int = 0
    recovery: int = 0
    ecgStability: int = 0
    hrv: int = 0
    spo2Stability: int = 0
    activityBalance: int = 0
    classification: str = "Moderate"
    sampleSize: int = 0
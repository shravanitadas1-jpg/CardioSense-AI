from typing import List

from fastapi import APIRouter

from app.models.vitals import SaveReadingRequest, StoredReading
from app.services.vitals_service import get_history, save_reading

router = APIRouter(tags=["history"])


@router.get("/history", response_model=List[StoredReading])
def history():
    return get_history()


@router.post("/save-reading", response_model=StoredReading)
def save_reading_endpoint(payload: SaveReadingRequest):
    return save_reading(payload)
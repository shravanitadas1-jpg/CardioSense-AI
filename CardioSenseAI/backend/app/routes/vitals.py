from fastapi import APIRouter

from app.models.vitals import VitalsReading
from app.services.vitals_service import get_live_vitals

router = APIRouter(tags=["vitals"])


@router.get("/live", response_model=VitalsReading)
def live_vitals():
    return get_live_vitals()
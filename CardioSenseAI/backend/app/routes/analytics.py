from fastapi import APIRouter

from app.models.vitals import AnalyticsResponse
from app.services.vitals_service import get_analytics

router = APIRouter(tags=["analytics"])


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics():
    return get_analytics()
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.business import BusinessCreate, BusinessDetailResponse, BusinessFilters, BusinessResponse
from app.services import business_service

router = APIRouter(prefix="/businesses", tags=["businesses"])


@router.get("/", response_model=list[BusinessResponse])
def list_businesses(
    name: str | None = Query(None, description="Partial name match"),
    state: str | None = Query(None),
    business_type: str | None = Query(None),
    min_monthly_revenue: float | None = Query(None),
    max_monthly_revenue: float | None = Query(None),
    db: Session = Depends(get_db),
):
    filters = BusinessFilters(
        name=name,
        state=state,
        business_type=business_type,
        min_monthly_revenue=min_monthly_revenue,
        max_monthly_revenue=max_monthly_revenue,
    )
    return business_service.get_businesses(db, filters)


@router.get("/{business_id}", response_model=BusinessDetailResponse)
def get_business(business_id: int, db: Session = Depends(get_db)):
    business = business_service.get_business_by_id(db, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.post("/", response_model=BusinessResponse, status_code=201)
def create_business(data: BusinessCreate, db: Session = Depends(get_db)):
    return business_service.create_business(db, data)

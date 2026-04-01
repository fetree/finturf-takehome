from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Business

router = APIRouter(prefix="/businesses", tags=["businesses"])


class BusinessCreate(BaseModel):
    # Identity
    name: str
    ein: str | None = None
    business_type: str | None = None
    state: str | None = None
    website: str | None = None
    years_in_business: int | None = None

    # Financials
    monthly_revenue: float | None = None
    num_employees: int | None = None
    outstanding_debt: float | None = None

    # Owner
    owner_name: str | None = None
    owner_credit_score: int | None = None


class BusinessResponse(BaseModel):
    id: int
    name: str
    ein: str | None
    business_type: str | None
    state: str | None
    website: str | None
    years_in_business: int | None
    monthly_revenue: float | None
    num_employees: int | None
    outstanding_debt: float | None
    owner_name: str | None
    owner_credit_score: int | None
    is_real: bool | None
    risk_score: float | None
    risk_tier: str | None

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[BusinessResponse])
def list_businesses(
    name: str | None = Query(None, description="Partial name match"),
    state: str | None = Query(None),
    business_type: str | None = Query(None),
    risk_tier: str | None = Query(None, description="low, medium, or high"),
    is_real: bool | None = Query(None),
    min_monthly_revenue: float | None = Query(None),
    max_monthly_revenue: float | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Business)

    if name is not None:
        q = q.filter(Business.name.ilike(f"%{name}%"))
    if state is not None:
        q = q.filter(Business.state == state)
    if business_type is not None:
        q = q.filter(Business.business_type == business_type)
    if risk_tier is not None:
        q = q.filter(Business.risk_tier == risk_tier)
    if is_real is not None:
        q = q.filter(Business.is_real == is_real)
    if min_monthly_revenue is not None:
        q = q.filter(Business.monthly_revenue >= min_monthly_revenue)
    if max_monthly_revenue is not None:
        q = q.filter(Business.monthly_revenue <= max_monthly_revenue)

    return q.all()


@router.post("/", response_model=BusinessResponse, status_code=201)
def create_business(business: BusinessCreate, db: Session = Depends(get_db)):
    db_business = Business(**business.model_dump())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

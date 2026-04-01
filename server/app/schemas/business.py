from datetime import date, datetime

from pydantic import BaseModel


class BusinessCreate(BaseModel):
    name: str
    ein: str | None = None
    business_type: str | None = None
    state: str | None = None
    website: str | None = None
    date_founded: date | None = None
    owner_name: str | None = None



class BusinessFilters(BaseModel):
    name: str | None = None
    state: str | None = None
    business_type: str | None = None


class RiskResponse(BaseModel):
    id: int
    monthly_revenue: float | None
    outstanding_debt: float | None
    num_employees: int | None
    owner_credit_score: int | None
    is_real: bool | None
    risk_score: float | None
    risk_tier: str | None
    evaluated_at: datetime

    model_config = {"from_attributes": True}


class BusinessResponse(BaseModel):
    id: int
    name: str
    ein: str | None
    business_type: str | None
    state: str | None
    website: str | None
    date_founded: date | None
    owner_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class BusinessDetailResponse(BusinessResponse):
    latest_risk: RiskResponse | None

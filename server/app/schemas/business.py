import re
from datetime import date, datetime

from pydantic import BaseModel, field_validator

VALID_BUSINESS_TYPES = {"llc", "corporation", "sole_proprietor", "partnership", "nonprofit"}
VALID_RISK_TIERS = {"low", "medium", "high"}
US_STATE_CODES = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
    "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY", "DC",
}


class BusinessCreate(BaseModel):
    name: str
    ein: str | None = None
    business_type: str | None = None
    state: str | None = None
    website: str | None = None
    date_founded: date | None = None
    owner_name: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name cannot be blank")
        return v.strip()

    @field_validator("ein")
    @classmethod
    def ein_format(cls, v: str | None) -> str | None:
        if v is None:
            return v
        if not re.fullmatch(r"\d{2}-\d{7}", v):
            raise ValueError("EIN must be in the format XX-XXXXXXX")
        return v

    @field_validator("business_type")
    @classmethod
    def valid_business_type(cls, v: str | None) -> str | None:
        if v is None:
            return v
        if v not in VALID_BUSINESS_TYPES:
            raise ValueError(f"business_type must be one of: {', '.join(sorted(VALID_BUSINESS_TYPES))}")
        return v

    @field_validator("state")
    @classmethod
    def valid_state(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.upper()
        if v not in US_STATE_CODES:
            raise ValueError("state must be a valid US state code (e.g. CA, NY)")
        return v

    @field_validator("date_founded")
    @classmethod
    def date_founded_not_future(cls, v: date | None) -> date | None:
        if v is None:
            return v
        if v > date.today():
            raise ValueError("date_founded cannot be in the future")
        return v


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

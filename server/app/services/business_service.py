from sqlalchemy.orm import Session

from app.models import Business, BusinessRisk
from app.schemas.business import BusinessCreate, BusinessDetailResponse, BusinessFilters, RiskResponse
from app.services import risk_evaluator


def get_businesses(db: Session, filters: BusinessFilters) -> list[Business]:
    q = db.query(Business)

    if filters.name is not None:
        q = q.filter(Business.name.ilike(f"%{filters.name}%"))
    if filters.state is not None:
        q = q.filter(Business.state == filters.state)
    if filters.business_type is not None:
        q = q.filter(Business.business_type == filters.business_type)

    return q.all()


def get_business_by_id(db: Session, business_id: int) -> BusinessDetailResponse | None:
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return None

    latest_risk = business.risks[0] if business.risks else None

    return BusinessDetailResponse(
        **{c.name: getattr(business, c.name) for c in Business.__table__.columns},
        latest_risk=RiskResponse.model_validate(latest_risk) if latest_risk else None,
    )


def get_risk_history(db: Session, business_id: int) -> list[RiskResponse] | None:
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return None
    return [RiskResponse.model_validate(r) for r in business.risks]


def evaluate_business(db: Session, business_id: int) -> RiskResponse | None:
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return None

    result = risk_evaluator.evaluate(business)
    risk = BusinessRisk(business_id=business.id, **result)
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return RiskResponse.model_validate(risk)


def create_business(db: Session, data: BusinessCreate) -> Business:
    business = Business(**data.model_dump())
    db.add(business)
    db.commit()
    db.refresh(business)
    return business

from sqlalchemy import Boolean, DateTime, Float, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Identity
    name: Mapped[str] = mapped_column(String, nullable=False)
    ein: Mapped[str | None] = mapped_column(String, nullable=True)
    business_type: Mapped[str | None] = mapped_column(String, nullable=True)
    state: Mapped[str | None] = mapped_column(String, nullable=True)
    website: Mapped[str | None] = mapped_column(String, nullable=True)
    years_in_business: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Financials
    monthly_revenue: Mapped[float | None] = mapped_column(Float, nullable=True)
    num_employees: Mapped[int | None] = mapped_column(Integer, nullable=True)
    outstanding_debt: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Owner
    owner_name: Mapped[str | None] = mapped_column(String, nullable=True)
    owner_credit_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Evaluation (set later)
    is_real: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_tier: Mapped[str | None] = mapped_column(String, nullable=True)
    evaluated_at: Mapped[str | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[str] = mapped_column(DateTime, server_default=func.now())

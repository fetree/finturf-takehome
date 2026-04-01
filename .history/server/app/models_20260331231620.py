from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

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

    created_at: Mapped[str] = mapped_column(DateTime, server_default=func.now())

    risks: Mapped[list["BusinessRisk"]] = relationship(
        "BusinessRisk", back_populates="business", order_by="BusinessRisk.evaluated_at.desc()"
    )


class BusinessRisk(Base):
    __tablename__ = "business_risks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)
    is_real: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_tier: Mapped[str | None] = mapped_column(String, nullable=True)
    evaluated_at: Mapped[str] = mapped_column(DateTime, server_default=func.now())

    business: Mapped["Business"] = relationship("Business", back_populates="risks")

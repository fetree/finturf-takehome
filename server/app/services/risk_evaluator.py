import random

from app.models import Business


def _score_to_tier(score: float) -> str:
    if score < 40:
        return "low"
    if score < 70:
        return "medium"
    return "high"


def evaluate(business: Business) -> dict:
    """
    Simulated risk evaluation. Replace this logic with real scoring when ready.
    """
    is_real = random.random() > 0.2
    risk_score = round(random.uniform(0, 100), 2)

    return {
        "is_real": is_real,
        "risk_score": risk_score,
        "risk_tier": _score_to_tier(risk_score),
        "monthly_revenue": round(random.uniform(10_000, 1_000_000), 2),
        "outstanding_debt": round(random.uniform(0, 500_000), 2),
        "num_employees": random.randint(1, 500),
        "owner_credit_score": random.randint(300, 850),
    }

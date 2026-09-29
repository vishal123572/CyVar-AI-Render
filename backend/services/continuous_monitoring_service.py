from datetime import datetime, timezone
from collections import deque

from database.connection import SessionLocal
from services.enterprise_risk_service import calculate_enterprise_risk
from services.ml_risk_service import get_ml_risk_predictions


# Keep latest 100 monitoring snapshots in memory
risk_history = deque(maxlen=100)


def run_monitoring_cycle():
    """
    Run one CyVar monitoring cycle.

    1. Recalculate enterprise financial risk
    2. Run XGBoost predictions
    3. Store timestamped snapshot
    """

    db = SessionLocal()

    try:
        enterprise = calculate_enterprise_risk()
        ml_predictions = get_ml_risk_predictions(db)

        summary = enterprise.get(
            "enterprise_summary",
            {}
        )

        critical_ml_assets = sum(
            1
            for item in ml_predictions
            if item.get("ml_risk_class") == "Critical"
        )

        high_ml_assets = sum(
            1
            for item in ml_predictions
            if item.get("ml_risk_class") == "High"
        )

        snapshot = {
            "timestamp": datetime.now(
                timezone.utc
            ).isoformat(),

            "expected_annual_loss":
                summary.get(
                    "expected_annual_loss",
                    0
                ),

            "var_95":
                summary.get(
                    "var_95",
                    0
                ),

            "var_99":
                summary.get(
                    "var_99",
                    0
                ),

            "probability_of_annual_loss":
                summary.get(
                    "probability_of_annual_loss",
                    0
                ),

            "critical_ml_assets":
                critical_ml_assets,

            "high_ml_assets":
                high_ml_assets,

            "assets_monitored":
                len(ml_predictions),
        }

        risk_history.append(snapshot)

        return snapshot

    finally:
        db.close()


def get_monitoring_status():

    if not risk_history:
        run_monitoring_cycle()

    return {
        "status": "active",
        "mode": "Near-real-time prototype monitoring",
        "refresh_interval_seconds": 60,
        "total_snapshots": len(risk_history),
        "latest": risk_history[-1],
        "history": list(risk_history),
    }
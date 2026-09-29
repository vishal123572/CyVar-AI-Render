from database.connection import SessionLocal

from models.asset import Asset
from models.business_service import BusinessService
from models.security_control import SecurityControl
from models.vulnerability import Vulnerability

from risk_engine.scenario_frequency import (
    estimate_annual_frequency
)

from risk_engine.monte_carlo import (
    run_monte_carlo
)


def calculate_asset_financial_risk(asset_code: str):

    db = SessionLocal()

    try:

        # ---------------------------------
        # GET ASSET
        # ---------------------------------

        asset = (
            db.query(Asset)
            .filter(
                Asset.asset_code == asset_code
            )
            .first()
        )

        if not asset:
            return {
                "error": "Asset not found"
            }

        # ---------------------------------
        # GET BUSINESS SERVICE
        # ---------------------------------

        business_service = (
            db.query(BusinessService)
            .filter(
                BusinessService.id
                == asset.business_service_id
            )
            .first()
        )

        if not business_service:
            return {
                "error": "Business service not found"
            }

        # ---------------------------------
        # GET VULNERABILITY
        # ---------------------------------

        vulnerability = (
            db.query(Vulnerability)
            .filter(
                Vulnerability.asset_id
                == asset.id
            )
            .order_by(
                Vulnerability.cvss_score.desc()
            )
            .first()
        )

        if not vulnerability:
            return {
                "error":
                    "No vulnerability found for asset"
            }

        # ---------------------------------
        # GET SECURITY CONTROLS
        # ---------------------------------

        controls = (
            db.query(SecurityControl)
            .filter(
                SecurityControl.asset_id
                == asset.id
            )
            .all()
        )

        implemented_controls = [
            control
            for control in controls
            if control.implemented
        ]

        if implemented_controls:

            average_control_effectiveness = (
                sum(
                    control.effectiveness
                    for control
                    in implemented_controls
                )
                / len(implemented_controls)
            )

        else:
            average_control_effectiveness = 0.0

        # ---------------------------------
        # ESTIMATE ANNUAL FREQUENCY
        # ---------------------------------

        annual_frequency = (
            estimate_annual_frequency(
                epss_score=(
                    vulnerability.epss_score
                    or 0
                ),
                cisa_kev=(
                    vulnerability.cisa_kev
                ),
                internet_exposed=(
                    asset.internet_exposed
                ),
                control_effectiveness=(
                    average_control_effectiveness
                )
            )
        )

        # ---------------------------------
        # MONTE CARLO
        # ---------------------------------

        result = run_monte_carlo(

            annual_event_frequency=
                annual_frequency,

            revenue_per_hour=
                business_service.revenue_per_hour,

            # Synthetic financial assumptions
            min_downtime_hours=1,

            most_likely_downtime_hours=
                business_service.max_tolerable_downtime,

            max_downtime_hours=8,

            min_response_cost=200000,

            most_likely_response_cost=500000,

            max_response_cost=1500000,

            simulations=10000,

            seed=42
        )

        # ---------------------------------
        # FINAL CYVAR RESPONSE
        # ---------------------------------

        return {

            "asset": {
                "asset_code":
                    asset.asset_code,

                "name":
                    asset.name,

                "criticality":
                    asset.criticality,

                "internet_exposed":
                    asset.internet_exposed
            },

            "business_service": {
                "name":
                    business_service.name,

                "revenue_per_hour":
                    business_service.revenue_per_hour
            },

            "vulnerability": {
                "cve":
                    vulnerability.cve_id,

                "cvss":
                    vulnerability.cvss_score,

                "epss":
                    vulnerability.epss_score,

                "cisa_kev":
                    vulnerability.cisa_kev
            },

            "controls": {
                "implemented":
                    len(implemented_controls),

                "average_effectiveness":
                    round(
                        average_control_effectiveness,
                        4
                    )
            },

            "frequency_model": {
                "annual_event_frequency":
                    annual_frequency,

                "model_type":
                    "Prototype scenario frequency model"
            },

            "financial_risk": result
        }

    finally:

        db.close()
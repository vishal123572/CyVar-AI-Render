from database.connection import SessionLocal

from models.asset import Asset
from models.business_service import BusinessService
from models.vulnerability import Vulnerability
from models.security_control import SecurityControl

from risk_engine.scenario_frequency import estimate_annual_frequency
from risk_engine.portfolio_monte_carlo import calculate_portfolio_risk
from services.risk_service import calculate_asset_financial_risk


def calculate_enterprise_risk():

    db = SessionLocal()

    try:
        assets = db.query(Asset).all()

        scenario_inputs = []
        asset_results = []
        skipped_assets = []

        for asset in assets:

            # ---------------------------------
            # INDIVIDUAL ASSET RISK
            # ---------------------------------

            result = calculate_asset_financial_risk(
                asset.asset_code
            )

            if "error" in result:
                skipped_assets.append({
                    "asset_code": asset.asset_code,
                    "name": asset.name,
                    "reason": result["error"]
                })
                continue

            # ---------------------------------
            # BUSINESS SERVICE
            # ---------------------------------

            business_service = (
                db.query(BusinessService)
                .filter(
                    BusinessService.id
                    == asset.business_service_id
                )
                .first()
            )

            # ---------------------------------
            # VULNERABILITY
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

            # ---------------------------------
            # CONTROLS
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

                average_effectiveness = (
                    sum(
                        control.effectiveness
                        for control
                        in implemented_controls
                    )
                    / len(implemented_controls)
                )

            else:
                average_effectiveness = 0

            # ---------------------------------
            # FREQUENCY
            # ---------------------------------

            annual_frequency = (
                estimate_annual_frequency(
                    epss_score=
                        vulnerability.epss_score,

                    cisa_kev=
                        vulnerability.cisa_kev,

                    internet_exposed=
                        asset.internet_exposed,

                    control_effectiveness=
                        average_effectiveness
                )
            )

            # ---------------------------------
            # PORTFOLIO INPUT
            # ---------------------------------

            scenario_inputs.append({

                "asset_code":
                    asset.asset_code,

                "annual_event_frequency":
                    annual_frequency,

                "revenue_per_hour":
                    business_service.revenue_per_hour,

                "most_likely_downtime":
                    business_service.max_tolerable_downtime
            })

            # ---------------------------------
            # ASSET RESULT
            # ---------------------------------

            asset_results.append({

                "asset_code":
                    asset.asset_code,

                "name":
                    asset.name,

                "criticality":
                    asset.criticality,

                "cve":
                    vulnerability.cve_id,

                "expected_annual_loss":
                    result[
                        "financial_risk"
                    ][
                        "expected_annual_loss"
                    ],

                "var_95":
                    result[
                        "financial_risk"
                    ][
                        "var_95"
                    ]
            })

        # -------------------------------------
        # ENTERPRISE PORTFOLIO SIMULATION
        # -------------------------------------

        portfolio = calculate_portfolio_risk(
            scenario_inputs,
            simulations=10000
        )

        # Highest EAL first
        asset_results.sort(
            key=lambda item:
                item["expected_annual_loss"],
            reverse=True
        )

        critical_assets = sum(
            1
            for item in asset_results
            if item["criticality"] >= 4
        )

        return {

            "enterprise_summary": {

                "total_assets":
                    len(assets),

                "modeled_assets":
                    len(asset_results),

                "coverage_percent":
                    round(
                        (
                            len(asset_results)
                            / len(assets)
                            * 100
                        )
                        if assets
                        else 0,
                        2
                    ),

                "critical_assets":
                    critical_assets,

                "expected_annual_loss":
                    portfolio[
                        "expected_annual_loss"
                    ],

                "var_95":
                    portfolio["var_95"],

                "var_99":
                    portfolio["var_99"],

                "probability_of_annual_loss":
                    portfolio[
                        "probability_of_annual_loss"
                    ],

                "maximum_simulated_loss":
                    portfolio[
                        "maximum_simulated_loss"
                    ]
            },

            "top_risk_drivers":
                asset_results[:5],

            "assets":
                asset_results,

            "skipped_assets":
                skipped_assets,

            "methodology": {
                "simulation_years": 10000,
                "portfolio_model":
                    "Monte Carlo",
                "scenario_dependency":
                    "Independent prototype scenarios",
                "financial_data":
                    "Synthetic demo assumptions"
            }
        }

    finally:
        db.close()
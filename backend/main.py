from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pulp

from services.continuous_monitoring_service import (
    run_monitoring_cycle,
    get_monitoring_status,
)

# ==================================================
# DATABASE
# ==================================================

from database.connection import (
    Base,
    engine,
    test_connection,
    SessionLocal,
)

# ==================================================
# MODELS
# ==================================================

from models.business_service import BusinessService
from models.asset import Asset
from models.security_control import SecurityControl
from models.vulnerability import Vulnerability
from services.ml_risk_service import get_ml_risk_predictions
from services.copilot_service import ask_cyvar_copilot

# ==================================================
# SERVICES
# ==================================================

from services.risk_service import (
    calculate_asset_financial_risk,
)

from services.enterprise_risk_service import (
    calculate_enterprise_risk,
)

# ==================================================
# RISK ENGINE
# ==================================================

from risk_engine.scenario_frequency import (
    estimate_annual_frequency,
)

from risk_engine.monte_carlo import (
    run_monte_carlo,
)


# ==================================================
# CREATE TABLES
# ==================================================

Base.metadata.create_all(bind=engine)


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="CyVar AI API",
    description=(
        "AI-Powered Continuous Cyber Risk "
        "Quantification and Investment "
        "Optimization Platform"
    ),
    version="0.1.0",
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# STARTUP
# ==================================================

@app.on_event("startup")
def startup():
    test_connection()


# ==================================================
# REQUEST MODELS
# ==================================================

class SimulationRequest(BaseModel):
    asset_code: str
    new_control_effectiveness: float


class OptimizationRequest(BaseModel):
    budget: float

class CopilotRequest(BaseModel):
    question: str    


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():

    return {
        "platform": "CyVar AI",
        "status": "running",
        "version": "0.1.0",
    }


# ==================================================
# HEALTH
# ==================================================

@app.get("/api/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(status_code=503, detail="Database is unavailable") from None
    return {
        "status": "healthy",
        "database": "PostgreSQL",
    }

# ==================================================
# CONTINUOUS RISK MONITORING
# ==================================================

@app.post("/api/monitoring/refresh")
def refresh_monitoring():

    snapshot = run_monitoring_cycle()

    return {
        "status": "updated",
        "snapshot": snapshot,
    }


@app.get("/api/monitoring/status")
def monitoring_status():

    return get_monitoring_status()

# ==================================================
# CYVAR AI COPILOT - OLLAMA
# ==================================================

@app.post("/api/copilot")
def cyvar_copilot(request: CopilotRequest):

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    result = ask_cyvar_copilot(question)

    return {
        "status": "success",
        "question": question,
        "answer": result["answer"],
        "model": result["model"],
        "provider": result["provider"],
    }

# ==================================================
# ASSETS
# ==================================================

@app.get("/api/assets")
def get_assets():

    db = SessionLocal()

    try:

        assets = db.query(Asset).all()

        return {
            "total": len(assets),

            "assets": [
                {
                    "id": asset.id,
                    "asset_code": asset.asset_code,
                    "name": asset.name,
                    "asset_type": asset.asset_type,
                    "business_unit": asset.business_unit,
                    "criticality": asset.criticality,
                    "internet_exposed":
                        asset.internet_exposed,
                    "data_classification":
                        asset.data_classification,
                    "environment": asset.environment,
                }
                for asset in assets
            ],
        }

    finally:
        db.close()


# ==================================================
# VULNERABILITIES
# ==================================================

@app.get("/api/vulnerabilities")
def get_vulnerabilities():

    db = SessionLocal()

    try:

        vulnerabilities = (
            db.query(Vulnerability).all()
        )

        results = []

        for vulnerability in vulnerabilities:

            asset = (
                db.query(Asset)
                .filter(
                    Asset.id
                    == vulnerability.asset_id
                )
                .first()
            )

            results.append(
                {
                    "id":
                        vulnerability.id,

                    "asset_code":
                        asset.asset_code
                        if asset
                        else None,

                    "asset_name":
                        asset.name
                        if asset
                        else "Unknown Asset",

                    "cve_id":
                        vulnerability.cve_id,

                    "cvss_score":
                        vulnerability.cvss_score,

                    "cvss_severity":
                        vulnerability.cvss_severity,

                    "epss_score":
                        vulnerability.epss_score,

                    "epss_percentile":
                        vulnerability.epss_percentile,

                    "cisa_kev":
                        vulnerability.cisa_kev,

                    "patch_status":
                        vulnerability.patch_status,

                    "description":
                        vulnerability.description,
                }
            )

        return {
            "total": len(results),
            "vulnerabilities": results,
        }

    finally:
        db.close()


# ==================================================
# ENTERPRISE RISK
# ==================================================

@app.get("/api/risk/enterprise/summary")
def get_enterprise_risk():

    return calculate_enterprise_risk()

# ==================================================
# XGBOOST ML RISK PREDICTIONS
# ==================================================

@app.get("/api/ml/risk-predictions")
def ml_risk_predictions():

    db = SessionLocal()

    try:
        predictions = get_ml_risk_predictions(db)

        return {
            "model": "XGBoost",
            "training_data": "Synthetic cyber-risk scenarios",
            "predictions": predictions,
        }

    finally:
        db.close()


# ==================================================
# WHAT-IF SIMULATOR
# ==================================================

@app.post("/api/simulate")
def simulate_risk(
    request: SimulationRequest
):

    db = SessionLocal()

    try:

        # ------------------------------------------
        # VALIDATE CONTROL EFFECTIVENESS
        # ------------------------------------------

        if (
            request.new_control_effectiveness < 0
            or
            request.new_control_effectiveness > 1
        ):

            return {
                "error": (
                    "Control effectiveness must "
                    "be between 0 and 1."
                )
            }


        # ------------------------------------------
        # FIND ASSET
        # ------------------------------------------

        asset = (
            db.query(Asset)
            .filter(
                Asset.asset_code
                == request.asset_code
            )
            .first()
        )

        if not asset:

            return {
                "error": "Asset not found"
            }


        # ------------------------------------------
        # FIND VULNERABILITY
        # ------------------------------------------

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
                    "No vulnerability scenario found"
            }

        if vulnerability.epss_score is None:

            return {
                "error":
                    "EPSS data unavailable for this asset"
            }


        # ------------------------------------------
        # BUSINESS SERVICE
        # ------------------------------------------

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
                "error":
                    "Business service not found"
            }


        # ------------------------------------------
        # CURRENT RISK
        # ------------------------------------------

        current = (
            calculate_asset_financial_risk(
                asset.asset_code
            )
        )

        if "error" in current:

            return current


        # ------------------------------------------
        # NEW FREQUENCY
        # ------------------------------------------

        new_frequency = (
            estimate_annual_frequency(

                epss_score=
                    vulnerability.epss_score,

                cisa_kev=
                    vulnerability.cisa_kev,

                internet_exposed=
                    asset.internet_exposed,

                control_effectiveness=
                    request.new_control_effectiveness,
            )
        )


        # ------------------------------------------
        # MONTE CARLO SIMULATION
        # ------------------------------------------

        simulated = run_monte_carlo(

            annual_event_frequency=
                new_frequency,

            revenue_per_hour=
                business_service.revenue_per_hour,

            min_downtime_hours=1,

            most_likely_downtime_hours=
                business_service
                .max_tolerable_downtime,

            max_downtime_hours=8,

            min_response_cost=200000,

            most_likely_response_cost=500000,

            max_response_cost=1500000,

            simulations=10000,

            seed=42,
        )


        # ------------------------------------------
        # BEFORE
        # ------------------------------------------

        current_eal = (
            current[
                "financial_risk"
            ][
                "expected_annual_loss"
            ]
        )

        current_var95 = (
            current[
                "financial_risk"
            ][
                "var_95"
            ]
        )


        # ------------------------------------------
        # AFTER
        # ------------------------------------------

        new_eal = (
            simulated[
                "expected_annual_loss"
            ]
        )

        new_var95 = (
            simulated[
                "var_95"
            ]
        )


        # ------------------------------------------
        # RISK REDUCTION
        # ------------------------------------------

        reduction = max(
            0,
            current_eal - new_eal
        )

        reduction_percent = (

            (
                reduction
                / current_eal
            )
            * 100

            if current_eal > 0

            else 0
        )


        # ------------------------------------------
        # RESPONSE
        # ------------------------------------------

        return {

            "asset": {

                "asset_code":
                    asset.asset_code,

                "name":
                    asset.name,
            },


            "before": {

                "expected_annual_loss":
                    current_eal,

                "var_95":
                    current_var95,
            },


            "after": {

                "expected_annual_loss":
                    new_eal,

                "var_95":
                    new_var95,
            },


            "risk_reduction": {

                "annual_loss_reduction":
                    round(
                        reduction,
                        2
                    ),

                "reduction_percent":
                    round(
                        reduction_percent,
                        2
                    ),
            },


            "simulation": {

                "control_effectiveness":
                    request
                    .new_control_effectiveness,

                "annual_event_frequency":
                    new_frequency,

                "simulation_years":
                    10000,
            },


            "note": (
                "Prototype what-if result using "
                "synthetic control effectiveness "
                "and financial assumptions."
            ),
        }

    finally:
        db.close()


# ==================================================
# INVESTMENT OPTIMIZER
# ==================================================

@app.post("/api/optimize")
def optimize_investment(
    request: OptimizationRequest
):

    if request.budget <= 0:
        return {
            "error": "Budget must be greater than zero"
        }

    # Synthetic prototype security investments.
    # Costs and modeled benefits are demo assumptions.
    candidates = [
        {
            "name": "Privileged Access Management",
            "asset": "Identity Server",
            "cost": 700000,
            "annual_risk_reduction": 950000,
        },
        {
            "name": "Advanced Patch Management",
            "asset": "Internet Banking Web Server",
            "cost": 250000,
            "annual_risk_reduction": 720000,
        },
        {
            "name": "API Threat Protection",
            "asset": "Mobile Banking API",
            "cost": 500000,
            "annual_risk_reduction": 610000,
        },
        {
            "name": "Database Activity Monitoring",
            "asset": "Customer Database",
            "cost": 400000,
            "annual_risk_reduction": 360000,
        },
        {
            "name": "Enhanced WAF Rules",
            "asset": "Payment Gateway API",
            "cost": 300000,
            "annual_risk_reduction": 410000,
        },
    ]

    for item in candidates:
        item["benefit_cost_ratio"] = round(
            item["annual_risk_reduction"] / item["cost"],
            3,
        )

    # --------------------------------------------------
    # PuLP 0/1 BINARY LINEAR PROGRAM
    # Maximize modeled annual risk reduction
    # subject to total investment <= available budget.
    # --------------------------------------------------

    problem = pulp.LpProblem(
        "CyVar_Security_Investment_Optimization",
        pulp.LpMaximize,
    )

    decisions = {
        i: pulp.LpVariable(
            f"select_control_{i}",
            cat="Binary",
        )
        for i in range(len(candidates))
    }

    problem += pulp.lpSum(
        candidates[i]["annual_risk_reduction"]
        * decisions[i]
        for i in range(len(candidates))
    )

    problem += (
        pulp.lpSum(
            candidates[i]["cost"] * decisions[i]
            for i in range(len(candidates))
        )
        <= request.budget
    )

    problem.solve(pulp.PULP_CBC_CMD(msg=False))

    selected = [
        item
        for i, item in enumerate(candidates)
        if pulp.value(decisions[i]) == 1
    ]

    spent = sum(item["cost"] for item in selected)
    total_reduction = sum(
        item["annual_risk_reduction"]
        for item in selected
    )

    enterprise = calculate_enterprise_risk()
    current_eal = enterprise[
        "enterprise_summary"
    ]["expected_annual_loss"]

    # Do not claim a modeled financial reduction above
    # the current modeled enterprise EAL.
    effective_reduction = min(
        total_reduction,
        current_eal,
    )

    remaining_eal = max(
        0,
        current_eal - effective_reduction,
    )

    rosi = (
        (effective_reduction - spent) / spent * 100
        if spent > 0
        else 0
    )

    # --------------------------------------------------
    # RISK REDUCTION CURVE
    # Solve the same PuLP optimization at several
    # budget levels for frontend visualization.
    # --------------------------------------------------

    curve = []
    curve_budgets = [
        0,
        250000,
        500000,
        750000,
        1000000,
        1250000,
        1500000,
        1750000,
        2000000,
        2150000,
    ]

    for curve_budget in curve_budgets:
        curve_problem = pulp.LpProblem(
            f"CyVar_Curve_{curve_budget}",
            pulp.LpMaximize,
        )

        curve_decisions = {
            i: pulp.LpVariable(
                f"curve_{curve_budget}_{i}",
                cat="Binary",
            )
            for i in range(len(candidates))
        }

        curve_problem += pulp.lpSum(
            candidates[i]["annual_risk_reduction"]
            * curve_decisions[i]
            for i in range(len(candidates))
        )

        curve_problem += (
            pulp.lpSum(
                candidates[i]["cost"]
                * curve_decisions[i]
                for i in range(len(candidates))
            )
            <= curve_budget
        )

        curve_problem.solve(
            pulp.PULP_CBC_CMD(msg=False)
        )

        curve_reduction = sum(
            candidates[i]["annual_risk_reduction"]
            for i in range(len(candidates))
            if pulp.value(curve_decisions[i]) == 1
        )

        curve_effective_reduction = min(
            curve_reduction,
            current_eal,
        )

        curve_remaining_eal = max(
            0,
            current_eal - curve_effective_reduction,
        )

        curve.append(
            {
                "budget": curve_budget,
                "risk_reduction": round(
                    curve_effective_reduction, 2
                ),
                "remaining_eal": round(
                    curve_remaining_eal, 2
                ),
                "reduction_percent": round(
                    (
                        curve_effective_reduction
                        / current_eal
                        * 100
                    )
                    if current_eal > 0
                    else 0,
                    2,
                ),
            }
        )

    return {
        "optimizer": "PuLP",
        "optimization_method":
            "0/1 Binary Linear Programming",
        "solver_status":
            pulp.LpStatus[problem.status],
        "objective": (
            "Maximize modeled annual risk reduction "
            "within the available security budget"
        ),
        "budget": request.budget,
        "recommended_investments": selected,
        "total_investment": spent,
        "unused_budget": request.budget - spent,
        "modeled_annual_risk_reduction": round(
            effective_reduction, 2
        ),
        "raw_control_benefit": round(
            total_reduction, 2
        ),
        "current_enterprise_eal": current_eal,
        "remaining_enterprise_eal": round(
            remaining_eal, 2
        ),
        "rosi_percent": round(rosi, 2),
        "risk_reduction_curve": curve,
        "assumption_note": (
            "Control costs and modeled risk-reduction "
            "benefits are synthetic prototype assumptions. "
            "PuLP performs the budget-constrained control "
            "selection."
        ),
    }


# ==================================================
# INDIVIDUAL ASSET RISK
#
# IMPORTANT:
# Keep this route AFTER
# /api/risk/enterprise/summary
# ==================================================

@app.get("/api/risk/{asset_code}")
def get_asset_risk(
    asset_code: str
):

    return (
        calculate_asset_financial_risk(
            asset_code
        )
    )

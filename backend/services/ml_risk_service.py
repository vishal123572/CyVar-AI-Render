from sqlalchemy.orm import Session

from models.asset import Asset
from models.vulnerability import Vulnerability
from models.security_control import SecurityControl
from ml.risk_predictor import predict_cyber_risk


def get_ml_risk_predictions(db: Session):

    assets = db.query(Asset).all()

    results = []

    for asset in assets:

        # Get highest-CVSS vulnerability for this asset
        vulnerability = (
            db.query(Vulnerability)
            .filter(Vulnerability.asset_id == asset.id)
            .order_by(Vulnerability.cvss_score.desc())
            .first()
        )

        if not vulnerability:
            continue

        # Get implemented security controls
        controls = (
            db.query(SecurityControl)
            .filter(
                SecurityControl.asset_id == asset.id,
                SecurityControl.implemented == True
            )
            .all()
        )

        # Calculate average implemented control effectiveness
        if controls:
            control_effectiveness = sum(
                control.effectiveness or 0
                for control in controls
            ) / len(controls)
        else:
            control_effectiveness = 0.0

        # Convert patch status for ML model
        patch_text = (vulnerability.patch_status or "").lower()

        patch_status = 1 if patch_text in [
            "patched",
            "closed",
            "resolved",
            "fixed"
        ] else 0

        # Send actual CyVar asset data to XGBoost
        prediction = predict_cyber_risk(
            cvss_score=vulnerability.cvss_score or 0,
            epss_score=vulnerability.epss_score or 0,
            cisa_kev=vulnerability.cisa_kev,
            internet_exposed=asset.internet_exposed,
            asset_criticality=asset.criticality,
            control_effectiveness=control_effectiveness,
            patch_status=patch_status,
        )

        results.append({
            "asset_code": asset.asset_code,
            "asset_name": asset.name,

            "cve_id": vulnerability.cve_id,
            "cvss_score": vulnerability.cvss_score,
            "epss_score": vulnerability.epss_score,
            "cisa_kev": vulnerability.cisa_kev,

            "internet_exposed": asset.internet_exposed,
            "asset_criticality": asset.criticality,

            "control_effectiveness": round(
                control_effectiveness,
                3
            ),

            "patch_status": vulnerability.patch_status,

            "ml_risk_class": prediction["risk_class"],
            "ml_confidence": prediction["confidence"],

            "class_probabilities":
                prediction["class_probabilities"],

            "model": "XGBoost"
        })

    return results
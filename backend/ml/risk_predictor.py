from pathlib import Path

import pandas as pd
from xgboost import XGBClassifier


BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "xgboost_risk_model.json"

FEATURES = [
    "cvss_score",
    "epss_score",
    "cisa_kev",
    "internet_exposed",
    "asset_criticality",
    "control_effectiveness",
    "patch_status",
]

RISK_LABELS = {
    0: "Low",
    1: "Medium",
    2: "High",
    3: "Critical",
}


# Load trained model only once
model = XGBClassifier()
model.load_model(MODEL_PATH)


def predict_cyber_risk(
    cvss_score,
    epss_score,
    cisa_kev,
    internet_exposed,
    asset_criticality,
    control_effectiveness,
    patch_status,
):
    """
    patch_status:
    0 = Open / Unpatched
    1 = Patched
    """

    input_data = pd.DataFrame(
        [[
            float(cvss_score),
            float(epss_score),
            int(bool(cisa_kev)),
            int(bool(internet_exposed)),
            int(asset_criticality),
            float(control_effectiveness),
            int(patch_status),
        ]],
        columns=FEATURES
    )

    predicted_class = int(model.predict(input_data)[0])

    probabilities = model.predict_proba(input_data)[0]

    confidence = float(probabilities[predicted_class])

    return {
        "risk_class_id": predicted_class,
        "risk_class": RISK_LABELS[predicted_class],
        "confidence": round(confidence * 100, 2),
        "class_probabilities": {
            RISK_LABELS[i]: round(float(probabilities[i]) * 100, 2)
            for i in range(len(probabilities))
        },
        "model": "XGBoost",
        "training_data": "Synthetic cyber-risk scenarios",
    }


# Quick test
if __name__ == "__main__":

    result = predict_cyber_risk(
        cvss_score=9.8,
        epss_score=0.996,
        cisa_kev=True,
        internet_exposed=True,
        asset_criticality=5,
        control_effectiveness=0.20,
        patch_status=0,
    )

    print("\nXGBOOST CYBER RISK PREDICTION")
    print("--------------------------------")

    print("Risk Class:", result["risk_class"])
    print("Confidence:", result["confidence"], "%")

    print("\nClass Probabilities:")

    for risk_class, probability in result["class_probabilities"].items():
        print(f"{risk_class}: {probability}%")
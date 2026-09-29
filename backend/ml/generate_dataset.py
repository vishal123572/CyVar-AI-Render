import numpy as np
import pandas as pd
from pathlib import Path

# Reproducible synthetic dataset
np.random.seed(42)

NUM_SAMPLES = 10000

# -----------------------------
# Generate synthetic features
# -----------------------------

cvss_score = np.round(
    np.random.uniform(0, 10, NUM_SAMPLES), 1
)

epss_score = np.round(
    np.random.beta(1.2, 4.0, NUM_SAMPLES), 5
)

cisa_kev = np.random.binomial(
    1, 0.15, NUM_SAMPLES
)

internet_exposed = np.random.binomial(
    1, 0.45, NUM_SAMPLES
)

asset_criticality = np.random.randint(
    1, 6, NUM_SAMPLES
)

control_effectiveness = np.round(
    np.random.uniform(0, 1, NUM_SAMPLES), 2
)

patch_status = np.random.binomial(
    1, 0.55, NUM_SAMPLES
)

# patch_status:
# 0 = Open / Unpatched
# 1 = Patched


# -----------------------------
# Create synthetic risk signal
# -----------------------------

risk_signal = (
    (cvss_score / 10) * 25
    + epss_score * 25
    + cisa_kev * 15
    + internet_exposed * 10
    + (asset_criticality / 5) * 15
    + (1 - control_effectiveness) * 7
    + (1 - patch_status) * 3
)

# Small random variation
noise = np.random.normal(
    0,
    3,
    NUM_SAMPLES
)

risk_score = np.clip(
    risk_signal + noise,
    0,
    100
)


# -----------------------------
# Convert score into risk class
# -----------------------------

def get_risk_class(score):
    if score < 30:
        return 0      # Low
    elif score < 50:
        return 1      # Medium
    elif score < 70:
        return 2      # High
    else:
        return 3      # Critical


risk_class = [
    get_risk_class(score)
    for score in risk_score
]


# -----------------------------
# Create dataframe
# -----------------------------

df = pd.DataFrame({
    "cvss_score": cvss_score,
    "epss_score": epss_score,
    "cisa_kev": cisa_kev,
    "internet_exposed": internet_exposed,
    "asset_criticality": asset_criticality,
    "control_effectiveness": control_effectiveness,
    "patch_status": patch_status,
    "risk_score": np.round(risk_score, 2),
    "risk_class": risk_class
})


# -----------------------------
# Save dataset
# -----------------------------

output_path = Path(__file__).parent / "cyber_risk_dataset.csv"

df.to_csv(
    output_path,
    index=False
)

print("Synthetic cyber-risk dataset created successfully!")
print("Rows:", len(df))
print()
print("Risk class distribution:")
print(df["risk_class"].value_counts().sort_index())
print()
print("Saved to:")
print(output_path)
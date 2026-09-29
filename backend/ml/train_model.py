from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier


# -----------------------------
# File paths
# -----------------------------

BASE_DIR = Path(__file__).parent

DATASET_PATH = BASE_DIR / "cyber_risk_dataset.csv"
MODEL_PATH = BASE_DIR / "xgboost_risk_model.json"


# -----------------------------
# Load dataset
# -----------------------------

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully!")
print("Total rows:", len(df))


# -----------------------------
# Input features
# -----------------------------

features = [
    "cvss_score",
    "epss_score",
    "cisa_kev",
    "internet_exposed",
    "asset_criticality",
    "control_effectiveness",
    "patch_status",
]

X = df[features]

# XGBoost will predict this
y = df["risk_class"]


# -----------------------------
# Train/Test split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training records:", len(X_train))
print("Testing records:", len(X_test))


# -----------------------------
# Create XGBoost model
# -----------------------------

model = XGBClassifier(
    n_estimators=250,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softprob",
    num_class=4,
    eval_metric="mlogloss",
    random_state=42
)


# -----------------------------
# Train
# -----------------------------

print("\nTraining XGBoost model...")

model.fit(
    X_train,
    y_train
)

print("Training completed!")


# -----------------------------
# Test model
# -----------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\nMODEL RESULTS")
print("----------------------------")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        target_names=[
            "Low",
            "Medium",
            "High",
            "Critical"
        ],
        zero_division=0
    )
)

print("Confusion Matrix:")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# -----------------------------
# Feature importance
# -----------------------------

importance = pd.DataFrame({
    "feature": features,
    "importance": model.feature_importances_
}).sort_values(
    by="importance",
    ascending=False
)

print("\nFeature Importance:")

print(
    importance.to_string(index=False)
)


# -----------------------------
# Save trained model
# -----------------------------

model.save_model(MODEL_PATH)

print("\nModel saved successfully!")
print("Saved to:")
print(MODEL_PATH)
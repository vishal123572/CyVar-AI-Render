def calculate_risk(
    epss_score,
    asset_criticality,
    internet_exposed,
    control_effectiveness,
    revenue_per_hour,
    downtime_hours
):

    # -----------------------------
    # 1. THREAT LIKELIHOOD SIGNAL
    # -----------------------------

    threat_likelihood = epss_score

    # Internet exposure increases
    # organizational exposure
    if internet_exposed:
        exposure_factor = 1.20
    else:
        exposure_factor = 0.80

    # -----------------------------
    # 2. ASSET CRITICALITY
    # -----------------------------

    criticality_factor = (
        asset_criticality / 5
    )

    # -----------------------------
    # 3. CONTROL EFFECTIVENESS
    # -----------------------------

    residual_control_factor = (
        1 - control_effectiveness
    )

    # -----------------------------
    # 4. SCENARIO LIKELIHOOD
    # -----------------------------

    scenario_likelihood = (
        threat_likelihood
        * exposure_factor
        * criticality_factor
        * residual_control_factor
    )

    # Probability cannot exceed 1
    scenario_likelihood = min(
        scenario_likelihood,
        1.0
    )

    # -----------------------------
    # 5. ESTIMATED LOSS
    # -----------------------------

    downtime_loss = (
        revenue_per_hour
        * downtime_hours
    )

    # Demo response/recovery cost
    response_recovery_cost = 500000

    estimated_loss = (
        downtime_loss
        + response_recovery_cost
    )

    # -----------------------------
    # 6. EXPECTED LOSS
    # -----------------------------

    expected_loss = (
        scenario_likelihood
        * estimated_loss
    )

    return {
        "scenario_likelihood":
            round(scenario_likelihood, 4),

        "estimated_loss":
            round(estimated_loss, 2),

        "expected_loss":
            round(expected_loss, 2),

        "inputs": {
            "epss_score": epss_score,
            "asset_criticality":
                asset_criticality,
            "internet_exposed":
                internet_exposed,
            "control_effectiveness":
                control_effectiveness,
            "revenue_per_hour":
                revenue_per_hour,
            "downtime_hours":
                downtime_hours
        }
    }
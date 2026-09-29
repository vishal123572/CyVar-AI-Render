import numpy as np


def run_monte_carlo(
    annual_event_frequency,
    revenue_per_hour,
    min_downtime_hours,
    most_likely_downtime_hours,
    max_downtime_hours,
    min_response_cost,
    most_likely_response_cost,
    max_response_cost,
    simulations=10000,
    seed=42
):

    # Fixed seed makes demo results reproducible
    rng = np.random.default_rng(seed)

    # ----------------------------------
    # 1. NUMBER OF INCIDENTS PER YEAR
    # ----------------------------------

    event_counts = rng.poisson(
        lam=annual_event_frequency,
        size=simulations
    )

    annual_losses = np.zeros(simulations)

    # ----------------------------------
    # 2. SIMULATE EACH YEAR
    # ----------------------------------

    for i in range(simulations):

        incidents = event_counts[i]

        if incidents == 0:
            continue

        # Downtime for each incident
        downtime_hours = rng.triangular(
            min_downtime_hours,
            most_likely_downtime_hours,
            max_downtime_hours,
            size=incidents
        )

        # Incident response / recovery cost
        response_costs = rng.triangular(
            min_response_cost,
            most_likely_response_cost,
            max_response_cost,
            size=incidents
        )

        downtime_losses = (
            downtime_hours * revenue_per_hour
        )

        incident_losses = (
            downtime_losses + response_costs
        )

        annual_losses[i] = np.sum(
            incident_losses
        )

    # ----------------------------------
    # 3. FINANCIAL RISK METRICS
    # ----------------------------------

    eal = np.mean(annual_losses)

    var_95 = np.percentile(
        annual_losses,
        95
    )

    var_99 = np.percentile(
        annual_losses,
        99
    )

    probability_of_loss = np.mean(
        annual_losses > 0
    )

    return {

        "simulations": simulations,

        "annual_event_frequency":
            round(float(annual_event_frequency), 4),

        "expected_annual_loss":
            round(float(eal), 2),

        "var_95":
            round(float(var_95), 2),

        "var_99":
            round(float(var_99), 2),

        "probability_of_annual_loss":
            round(float(probability_of_loss), 4),

        "minimum_simulated_loss":
            round(float(np.min(annual_losses)), 2),

        "maximum_simulated_loss":
            round(float(np.max(annual_losses)), 2),

        "assumptions": {

            "revenue_per_hour":
                revenue_per_hour,

            "downtime_hours": [
                min_downtime_hours,
                most_likely_downtime_hours,
                max_downtime_hours
            ],

            "response_cost": [
                min_response_cost,
                most_likely_response_cost,
                max_response_cost
            ]
        }
    }
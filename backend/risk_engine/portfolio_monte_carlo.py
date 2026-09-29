import numpy as np


def simulate_asset_annual_losses(
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

    rng = np.random.default_rng(seed)

    event_counts = rng.poisson(
        lam=annual_event_frequency,
        size=simulations
    )

    annual_losses = np.zeros(simulations)

    for i in range(simulations):

        incidents = event_counts[i]

        if incidents == 0:
            continue

        downtime = rng.triangular(
            min_downtime_hours,
            most_likely_downtime_hours,
            max_downtime_hours,
            size=incidents
        )

        response_cost = rng.triangular(
            min_response_cost,
            most_likely_response_cost,
            max_response_cost,
            size=incidents
        )

        incident_loss = (
            downtime * revenue_per_hour
            + response_cost
        )

        annual_losses[i] = np.sum(
            incident_loss
        )

    return annual_losses


def calculate_portfolio_risk(
    scenario_inputs,
    simulations=10000
):

    portfolio_losses = np.zeros(
        simulations
    )

    for index, scenario in enumerate(
        scenario_inputs
    ):

        asset_losses = (
            simulate_asset_annual_losses(
                annual_event_frequency=
                    scenario[
                        "annual_event_frequency"
                    ],

                revenue_per_hour=
                    scenario[
                        "revenue_per_hour"
                    ],

                min_downtime_hours=1,

                most_likely_downtime_hours=
                    scenario[
                        "most_likely_downtime"
                    ],

                max_downtime_hours=8,

                min_response_cost=200000,

                most_likely_response_cost=
                    500000,

                max_response_cost=1500000,

                simulations=simulations,

                # Different reproducible stream
                # for each asset
                seed=42 + index
            )
        )

        portfolio_losses += asset_losses

    return {

        "simulations": simulations,

        "expected_annual_loss":
            round(
                float(
                    np.mean(
                        portfolio_losses
                    )
                ),
                2
            ),

        "var_95":
            round(
                float(
                    np.percentile(
                        portfolio_losses,
                        95
                    )
                ),
                2
            ),

        "var_99":
            round(
                float(
                    np.percentile(
                        portfolio_losses,
                        99
                    )
                ),
                2
            ),

        "probability_of_annual_loss":
            round(
                float(
                    np.mean(
                        portfolio_losses > 0
                    )
                ),
                4
            ),

        "maximum_simulated_loss":
            round(
                float(
                    np.max(
                        portfolio_losses
                    )
                ),
                2
            )
    }
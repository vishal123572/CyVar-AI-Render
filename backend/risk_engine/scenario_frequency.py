def estimate_annual_frequency(
    epss_score,
    cisa_kev,
    internet_exposed,
    control_effectiveness
):

    # Start with a baseline annual frequency.
    # This is a synthetic prototype assumption.
    baseline_frequency = 0.20

    # EPSS is used as a threat signal,
    # NOT directly as annual breach probability.
    epss_factor = 0.5 + epss_score

    # Known exploitation increases threat pressure.
    kev_factor = 1.5 if cisa_kev else 1.0

    # Internet-facing assets have greater exposure.
    exposure_factor = (
        1.3 if internet_exposed else 0.8
    )

    # Effective controls reduce residual frequency.
    control_factor = max(
        0.1,
        1 - control_effectiveness
    )

    annual_frequency = (
        baseline_frequency
        * epss_factor
        * kev_factor
        * exposure_factor
        * control_factor
    )

    return round(
        annual_frequency,
        4
    )
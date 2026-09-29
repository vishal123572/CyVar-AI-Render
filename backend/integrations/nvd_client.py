import httpx


NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"


def get_nvd_data(cve_id: str):

    try:
        response = httpx.get(
            NVD_URL,
            params={"cveId": cve_id},
            timeout=20.0
        )

        response.raise_for_status()

        result = response.json()

        vulnerabilities = result.get("vulnerabilities", [])

        if not vulnerabilities:
            return None

        cve = vulnerabilities[0]["cve"]

        # -------------------------
        # DESCRIPTION
        # -------------------------

        description = None

        for item in cve.get("descriptions", []):
            if item.get("lang") == "en":
                description = item.get("value")
                break

        # -------------------------
        # CVSS
        # -------------------------

        metrics = cve.get("metrics", {})

        cvss_data = None

        # Prefer newer CVSS versions
        for metric_name in [
            "cvssMetricV40",
            "cvssMetricV31",
            "cvssMetricV30",
            "cvssMetricV2"
        ]:

            if metric_name in metrics:
                cvss_data = metrics[metric_name][0].get(
                    "cvssData"
                )
                break

        if cvss_data is None:
            return {
                "cve": cve_id,
                "description": description,
                "cvss_score": None,
                "severity": None,
                "attack_vector": None,
                "attack_complexity": None,
                "privileges_required": None,
                "user_interaction": None,
                "source": "NVD"
            }

        return {
            "cve": cve_id,
            "description": description,

            "cvss_score":
                cvss_data.get("baseScore"),

            "severity":
                cvss_data.get("baseSeverity"),

            "attack_vector":
                cvss_data.get("attackVector"),

            "attack_complexity":
                cvss_data.get("attackComplexity"),

            "privileges_required":
                cvss_data.get("privilegesRequired"),

            "user_interaction":
                cvss_data.get("userInteraction"),

            "source": "NVD"
        }

    except Exception as error:

        print("NVD API error:", error)

        return None
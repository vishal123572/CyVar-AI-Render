import httpx


KEV_URL = (
    "https://www.cisa.gov/sites/default/files/feeds/"
    "known_exploited_vulnerabilities.json"
)


def get_kev_data(cve_id: str):

    try:
        response = httpx.get(
            KEV_URL,
            timeout=20.0
        )

        response.raise_for_status()

        result = response.json()

        vulnerabilities = result.get(
            "vulnerabilities",
            []
        )

        for vulnerability in vulnerabilities:

            if vulnerability.get("cveID") == cve_id:

                return {
                    "cve": cve_id,
                    "known_exploited": True,

                    "vendor":
                        vulnerability.get(
                            "vendorProject"
                        ),

                    "product":
                        vulnerability.get(
                            "product"
                        ),

                    "date_added":
                        vulnerability.get(
                            "dateAdded"
                        ),

                    "required_action":
                        vulnerability.get(
                            "requiredAction"
                        ),

                    "due_date":
                        vulnerability.get(
                            "dueDate"
                        ),

                    "ransomware_use":
                        vulnerability.get(
                            "knownRansomwareCampaignUse"
                        ),

                    "source": "CISA KEV"
                }

        return {
            "cve": cve_id,
            "known_exploited": False,
            "source": "CISA KEV"
        }

    except Exception as error:

        print("CISA KEV error:", error)

        return None
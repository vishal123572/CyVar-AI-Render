import httpx


EPSS_URL = "https://api.first.org/data/v1/epss"


def get_epss(cve_id: str):

    try:
        response = httpx.get(
            EPSS_URL,
            params={"cve": cve_id},
            timeout=15.0
        )

        response.raise_for_status()

        result = response.json()

        data = result.get("data", [])

        if not data:
            return None

        record = data[0]

        return {
            "cve": record.get("cve"),
            "epss": float(record.get("epss", 0)),
            "percentile": float(
                record.get("percentile", 0)
            ),
            "date": record.get("date"),
            "source": "FIRST EPSS"
        }

    except Exception as error:
        print("EPSS API error:", error)
        return None
from database.connection import SessionLocal

from models.asset import Asset
from models.vulnerability import Vulnerability

from services.vulnerability_service import enrich_vulnerability


# --------------------------------------------------
# DEMO ASSET -> CVE MAPPINGS
# --------------------------------------------------

DEMO_SCENARIOS = [

    {
        "asset_code": "PAY-API-001",
        "cve_id": "CVE-2021-44228"
    },

    {
        "asset_code": "PAY-DB-001",
        "cve_id": "CVE-2024-10979"
    },

    {
        "asset_code": "IAM-001",
        "cve_id": "CVE-2021-20222"
    },

    {
        "asset_code": "CUST-DB-001",
        "cve_id": "CVE-2024-10979"
    },

    {
        "asset_code": "MOB-API-001",
        "cve_id": "CVE-2022-22965"
    },

    {
        "asset_code": "WEB-001",
        "cve_id": "CVE-2021-42013"
    }
]


def seed_vulnerabilities():

    db = SessionLocal()

    try:

        for scenario in DEMO_SCENARIOS:

            asset_code = scenario["asset_code"]
            cve_id = scenario["cve_id"]

            print()
            print(
                f"Processing {asset_code} -> {cve_id}"
            )

            # ---------------------------------------
            # FIND ASSET
            # ---------------------------------------

            asset = (
                db.query(Asset)
                .filter(
                    Asset.asset_code == asset_code
                )
                .first()
            )

            if not asset:

                print(
                    f"Asset not found: {asset_code}"
                )

                continue


            # ---------------------------------------
            # CHECK DUPLICATE
            # ---------------------------------------

            existing = (
                db.query(Vulnerability)
                .filter(
                    Vulnerability.asset_id
                    == asset.id,

                    Vulnerability.cve_id
                    == cve_id
                )
                .first()
            )

            if existing:

                print(
                    f"Already exists: {cve_id}"
                )

                continue


            # ---------------------------------------
            # FETCH REAL THREAT INTELLIGENCE
            # ---------------------------------------

            print(
                "Fetching NVD + EPSS + CISA data..."
            )

            data = enrich_vulnerability(cve_id)

            if not data:

                print(
                    f"Could not fetch data for {cve_id}"
                )

                continue


            # ---------------------------------------
            # SAVE TO POSTGRESQL
            # ---------------------------------------

            vulnerability = Vulnerability(

                asset_id=asset.id,

                cve_id=data["cve_id"],

                description=data.get(
                    "description"
                ),

                cvss_score=data.get(
                    "cvss_score"
                ),

                cvss_severity=data.get(
                    "cvss_severity"
                ),

                epss_score=data.get(
                    "epss_score"
                ),

                epss_percentile=data.get(
                    "epss_percentile"
                ),

                cisa_kev=data.get(
                    "cisa_kev",
                    False
                ),

                patch_status="Open"
            )

            db.add(vulnerability)

            # Commit each scenario separately
            db.commit()

            print(
                f"Saved {cve_id} "
                f"for {asset.name}"
            )


        print()
        print(
            "Vulnerability seeding completed!"
        )


    except Exception as error:

        db.rollback()

        print()
        print("ERROR:")
        print(error)


    finally:

        db.close()


if __name__ == "__main__":

    seed_vulnerabilities()
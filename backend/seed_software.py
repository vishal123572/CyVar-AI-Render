from database.connection import SessionLocal

from models.asset import Asset
from models.software_inventory import SoftwareInventory


db = SessionLocal()


try:
    # Prevent duplicates
    if db.query(SoftwareInventory).count() > 0:
        print("Software inventory already exists.")
        raise SystemExit

    payment_api = (
        db.query(Asset)
        .filter(Asset.asset_code == "PAY-API-001")
        .first()
    )

    identity_server = (
        db.query(Asset)
        .filter(Asset.asset_code == "IAM-001")
        .first()
    )

    web_server = (
        db.query(Asset)
        .filter(Asset.asset_code == "WEB-001")
        .first()
    )

    if not payment_api or not identity_server or not web_server:
        print("Required assets not found.")
        raise SystemExit

    software = [

        # Synthetic vulnerable component for demo
        SoftwareInventory(
            asset_id=payment_api.id,
            vendor="Apache",
            product="Log4j",
            version="2.14.1",
            cpe="cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*"
        ),

        SoftwareInventory(
            asset_id=payment_api.id,
            vendor="Python",
            product="FastAPI",
            version="Demo",
            cpe=None
        ),

        SoftwareInventory(
            asset_id=identity_server.id,
            vendor="Keycloak",
            product="Keycloak",
            version="Demo",
            cpe=None
        ),

        SoftwareInventory(
            asset_id=web_server.id,
            vendor="Apache",
            product="HTTP Server",
            version="Demo",
            cpe=None
        )
    ]

    db.add_all(software)

    db.commit()

    print("Synthetic software inventory created successfully!")
    print("Software records:", len(software))


finally:
    db.close()
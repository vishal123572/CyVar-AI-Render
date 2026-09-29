from database.connection import SessionLocal

from models.asset import Asset
from models.software_inventory import SoftwareInventory


db = SessionLocal()


def add_software(
    asset_code,
    vendor,
    product,
    version,
    cpe
):

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
        return

    existing = (
        db.query(SoftwareInventory)
        .filter(
            SoftwareInventory.asset_id
            == asset.id,

            SoftwareInventory.vendor
            == vendor,

            SoftwareInventory.product
            == product,

            SoftwareInventory.version
            == version
        )
        .first()
    )

    if existing:
        print(
            f"Already exists: "
            f"{asset_code} - {product}"
        )
        return

    software = SoftwareInventory(
        asset_id=asset.id,
        vendor=vendor,
        product=product,
        version=version,
        cpe=cpe
    )

    db.add(software)

    print(
        f"Added: {asset_code} "
        f"-> {product} {version}"
    )


try:

    # ---------------------------------
    # PAYMENT TRANSACTION DATABASE
    # ---------------------------------

    add_software(
        asset_code="PAY-DB-001",
        vendor="PostgreSQL",
        product="PostgreSQL",
        version="16.4",
        cpe=(
            "cpe:2.3:a:postgresql:"
            "postgresql:16.4:*:*:*:*:*:*:*"
        )
    )


    # ---------------------------------
    # IDENTITY SERVER
    # ---------------------------------

    add_software(
        asset_code="IAM-001",
        vendor="Red Hat",
        product="Keycloak",
        version="13.0.0",
        cpe=(
            "cpe:2.3:a:redhat:"
            "keycloak:13.0.0:*:*:*:*:*:*:*"
        )
    )


    # ---------------------------------
    # CUSTOMER DATABASE
    # ---------------------------------

    add_software(
        asset_code="CUST-DB-001",
        vendor="PostgreSQL",
        product="PostgreSQL",
        version="15.8",
        cpe=(
            "cpe:2.3:a:postgresql:"
            "postgresql:15.8:*:*:*:*:*:*:*"
        )
    )


    # ---------------------------------
    # MOBILE BANKING API
    # ---------------------------------

    add_software(
        asset_code="MOB-API-001",
        vendor="VMware",
        product="Spring Framework",
        version="5.3.17",
        cpe=(
            "cpe:2.3:a:vmware:"
            "spring_framework:5.3.17:"
            "*:*:*:*:*:*:*"
        )
    )


    # ---------------------------------
    # INTERNET BANKING WEB SERVER
    # ---------------------------------

    add_software(
        asset_code="WEB-001",
        vendor="Apache",
        product="HTTP Server",
        version="2.4.50",
        cpe=(
            "cpe:2.3:a:apache:"
            "http_server:2.4.50:"
            "*:*:*:*:*:*:*"
        )
    )


    db.commit()

    print()
    print(
        "Remaining synthetic software "
        "inventory created successfully!"
    )


finally:

    db.close()
from database.connection import SessionLocal

from models.asset import Asset
from models.software_inventory import SoftwareInventory


def get_asset_software(asset_code: str):

    db = SessionLocal()

    try:
        asset = (
            db.query(Asset)
            .filter(
                Asset.asset_code == asset_code
            )
            .first()
        )

        if not asset:
            return {
                "error": "Asset not found"
            }

        software = (
            db.query(SoftwareInventory)
            .filter(
                SoftwareInventory.asset_id
                == asset.id
            )
            .all()
        )

        return {
            "asset": {
                "id": asset.id,
                "asset_code": asset.asset_code,
                "name": asset.name
            },

            "software": [
                {
                    "id": item.id,
                    "vendor": item.vendor,
                    "product": item.product,
                    "version": item.version,
                    "cpe": item.cpe
                }
                for item in software
            ]
        }

    finally:
        db.close()
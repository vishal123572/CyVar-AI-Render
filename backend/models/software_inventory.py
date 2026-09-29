from sqlalchemy import Column, ForeignKey, Integer, String

from database.connection import Base


class SoftwareInventory(Base):

    __tablename__ = "software_inventory"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    asset_id = Column(
        Integer,
        ForeignKey("assets.id"),
        nullable=False
    )

    vendor = Column(
        String,
        nullable=False
    )

    product = Column(
        String,
        nullable=False
    )

    version = Column(
        String,
        nullable=False
    )

    cpe = Column(
        String,
        nullable=True
    )
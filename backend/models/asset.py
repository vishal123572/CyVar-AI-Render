from sqlalchemy import (  # pyright: ignore[reportMissingImports]
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String
)

from database.connection import Base


class Asset(Base):

    __tablename__ = "assets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    asset_code = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    asset_type = Column(
        String,
        nullable=False
    )

    business_unit = Column(
        String,
        nullable=False
    )

    business_service_id = Column(
        Integer,
        ForeignKey("business_services.id"),
        nullable=False
    )

    criticality = Column(
        Integer,
        nullable=False
    )

    internet_exposed = Column(
        Boolean,
        default=False
    )

    data_classification = Column(
        String,
        nullable=False
    )

    environment = Column(
        String,
        default="Production"
    )
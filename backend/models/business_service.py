from sqlalchemy import Column, Float, Integer, String  # type: ignore[reportMissingImports]

from database.connection import Base


class BusinessService(Base):

    __tablename__ = "business_services"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    service_code = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    business_unit = Column(
        String,
        nullable=False
    )

    criticality = Column(
        Integer,
        nullable=False
    )

    revenue_per_hour = Column(
        Float,
        default=0
    )

    max_tolerable_downtime = Column(
        Float,
        default=0
    )
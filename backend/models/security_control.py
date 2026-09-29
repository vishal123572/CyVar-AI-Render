from sqlalchemy import (  # type: ignore[reportMissingImports]
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    String
)

from database.connection import Base


class SecurityControl(Base):

    __tablename__ = "security_controls"

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

    control_name = Column(
        String,
        nullable=False
    )

    control_type = Column(
        String,
        nullable=False
    )

    implemented = Column(
        Boolean,
        default=False
    )

    effectiveness = Column(
        Float,
        default=0
    )

    annual_cost = Column(
        Float,
        default=0
    )

    framework_reference = Column(
        String,
        nullable=True
    )
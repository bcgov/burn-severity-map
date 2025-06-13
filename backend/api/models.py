# models.py
from sqlalchemy import Integer, String, Float,Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry, WKBElement # Keep this for your geometry type

from database import Base # Import Base from your database.py file
from schemas import SeverityClassEnum

class FireBurnSeverity(Base): # Inherit from database.Base
    __tablename__ = "fire_burn_severity"

    # Define all columns for the table here
    ID: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True) # Common to have an auto-incrementing PK
    FIRE_NUMBER: Mapped[str] = mapped_column(String(50), index=True) # Add index if frequently queried
    FIRE_YEAR: Mapped[int] = mapped_column(Integer,nullable=True)
    PRE_FIRE_IMAGE: Mapped[str] = mapped_column(String(50),nullable=False)
    PRE_FIRE_IMAGE_DATE: Mapped[str] = mapped_column(String(50), nullable=True)
    POST_FIRE_IMAGE: Mapped[str] = mapped_column(String(50),nullable=False)
    POST_FIRE_IMAGE_DATE: Mapped[str] = mapped_column(String(50), nullable=True)
    COMMENTS: Mapped[str] = mapped_column(String(255),nullable=True)
    FIRE_STATUS: Mapped[str] = mapped_column(String(50),nullable=True)
    BURN_SEVERITY_RATING: Mapped[str] = mapped_column(SQLAlchemyEnum(SeverityClassEnum), nullable=False) # Or keep as String if no Enum
    AREA_HA: Mapped[float] = mapped_column(Float,nullable=True)
    geometry: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=False
    )

    def __repr__(self):
        return f"<FireBurnSeverity(id={self.ID}, \
            FIRE_NUMBER='{self.FIRE_NUMBER}', \
            FIRE_YEAR='{self.FIRE_YEAR}', \
            PRE_FIRE_IMAGE={self.PRE_FIRE_IMAGE}, \
            PRE_FIRE_IMAGE_DATE={self.PRE_FIRE_IMAGE_DATE}, \
            POST_FIRE_IMAGE={self.POST_FIRE_IMAGE}, \
            POST_FIRE_IMAGE_DATE={self.POST_FIRE_IMAGE_DATE}, \
            COMMENTS={self.COMMENTS}, \
            FIRE_STATUS={self.FIRE_STATUS}, \
            BURN_SEVERITY_RATING={self.BURN_SEVERITY_RATING}, \
            AREA_HA={self.AREA_HA})>"
    
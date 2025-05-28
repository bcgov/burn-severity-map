# models.py
from sqlalchemy import Integer, String, Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry, WKBElement # Keep this for your geometry type

from database import Base # Import Base from your database.py file

# If you have an Enum for severity_class, define it here or import it
# Example:
# import enum
# class SeverityClassEnum(str, enum.Enum):
#     HIGH = "High"
#     MODERATE = "Moderate"
#     LOW = "Low"
#     NONE = "None"

class FireBurnSeverity(Base): # Inherit from database.Base
    __tablename__ = "fire_burn_severity"

    # Define all columns for the table here
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True) # Common to have an auto-incrementing PK
    fire_number: Mapped[str] = mapped_column(String(50), index=True) # Add index if frequently queried
    pre_image_date: Mapped[str] = mapped_column(String(50), nullable=True)
    post_image_date: Mapped[str] = mapped_column(String(50), nullable=True)
    # severity_class: Mapped[SeverityClassEnum] = mapped_column(SQLAlchemyEnum(SeverityClassEnum, name="severity_enum_type", create_type=True), nullable=True)
    severity_class: Mapped[str] = mapped_column(String(50), nullable=True) # Or keep as String if no Enum
    geom: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=True
    )

    def __repr__(self):
        return f"<FireBurnSeverity(id={self.id}, fire_number='{self.fire_number}', severity_class='{self.severity_class}')>"
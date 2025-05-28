# schemas.py
from pydantic import BaseModel, constr
from typing import Optional # Don't forget List if you have list responses

# If you have an Enum, import it here as well to use in Pydantic models
# from .models import SeverityClassEnum # Or define it in a shared enums.py

# Pydantic model for creating a new record (API input)
class FireBurnSeverityCreate(BaseModel):
    fire_number: constr(max_length=50)
    pre_image_date: Optional[str] = None
    post_image_date: Optional[str] = None
    # severity_class: Optional[SeverityClassEnum] = None
    severity_class: Optional[str] = None
    # geom: str # GeoJSON string for input, or a custom Pydantic type for WKT/WKB

    # Example for handling WKT input for geometry:
    # from pydantic import field_validator
    # from shapely import wkt
    # geom_wkt: Optional[str] = None

    # @field_validator('geom_wkt')
    # def validate_geom_wkt(cls, value):
    #     if value is None:
    #         return None
    #     try:
    #         wkt.loads(value)
    #     except Exception:
    #         raise ValueError("Invalid WKT string for geometry")
    #     return value


# Pydantic model for API response (API output)
class FireBurnSeverityResponse(BaseModel):
    id: int
    fire_number: str
    pre_image_date: Optional[str] = None
    post_image_date: Optional[str] = None
    # severity_class: Optional[SeverityClassEnum] = None
    severity_class: Optional[str] = None
    # geom: Optional[str] = None # Or a GeoJSON representation

    class Config:
        from_attributes = True # For Pydantic V2 (formerly orm_mode)
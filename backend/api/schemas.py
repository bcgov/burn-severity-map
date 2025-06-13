from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from enum import Enum

class SeverityClassEnum(str, Enum):
    UNBURNT = "Unburned"
    LOW = "Low"
    MODERATE = "Medium"
    HIGH = "High"

class CRSProperties(BaseModel):
    name: str

class CRS(BaseModel):
    type: str
    properties: CRSProperties

class BurnSeverityProps(BaseModel):

    FIRE_NUMBER: str
    FIRE_YEAR: int
    PRE_FIRE_IMAGE: str
    PRE_FIRE_IMAGE_DATE: str
    POST_FIRE_IMAGE: str
    POST_FIRE_IMAGE_DATE: str
    COMMENTS: Optional[str] = None
    FIRE_STATUS: str
    BURN_SEVERITY_RATING: SeverityClassEnum
    AREA_HA: float
    FEATURE_AREA_SQM: float
    FEATURE_LENGTH_M: float
    
    class Config:
        from_attributes = True # For Pydantic V2 (formerly orm_mode)

class FireBurnSeverityFeature(BaseModel):
    type: str
    geometry: dict
    properties: BurnSeverityProps


    # def parse_properties(cls, v):
    #     print("🔥 Validating properties:", v)  # Debug print
    #     if isinstance(v, dict):
    #         return BurnSeverityProps.model_validate(v)
    #     return v
    class Config:
        from_attributes = True # For Pydantic V2 (formerly orm_mode)

class FireBurnSeverityCreate(BaseModel):
    type: str
    crs: CRS
    features: List[FireBurnSeverityFeature]
    class Config:
        from_attributes = True # For Pydantic V2 (formerly orm_mode)

class FireBurnSeverityResponse(BaseModel):
    type: str
    crs: CRS
    features: List[FireBurnSeverityFeature]

    class Config:
        from_attributes = True # For Pydantic V2 (formerly orm_mode)
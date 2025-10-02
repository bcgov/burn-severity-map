from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import date

class FeatureProperties(BaseModel):
    FIRE_NUMBER: str
    FIRE_YEAR: int
    PRE_FIRE_IMAGE: str
    PRE_FIRE_IMAGE_DATE: date
    POST_FIRE_IMAGE: str
    POST_FIRE_IMAGE_DATE: date
    COMMENTS: Optional[str]
    FIRE_STATUS: str
    BURN_SEVERITY_RATING: str
    AREA_HA: float
    FEATURE_AREA_SQM: float
    FEATURE_LENGTH_M: float

class Geometry(BaseModel):
    type: str
    coordinates: Any  # Can be List[List[List[float]]] for Polygons

class Feature(BaseModel):
    type: str = "Feature"
    geometry: Geometry
    properties: FeatureProperties

class FeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[Feature]

class FireNumberList(BaseModel):
    fire_numbers: List[str]

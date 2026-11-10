from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Optional, Any, Literal
from datetime import datetime

class FeatureProperties(BaseModel):
    FIRE_NUMBER: str
    FIRE_YEAR: int
    PRE_FIRE_IMAGE: str
    PRE_FIRE_IMAGE_DATE: str
    POST_FIRE_IMAGE: str
    POST_FIRE_IMAGE_DATE: str
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
class FireYearsList(BaseModel):
    fire_years: List[int]


# BsJob Model
class BsJob(BaseModel):
    fire: str = Field(pattern=r"^[A-Za-z]\d{5}$")
    year: int
    sensor: Literal["S2", "LS_8_9", "LS_5_7"]
    start_date: str | None = None
    end_date: str | None = None
    cloud: float = Field(default=30.0, ge=0, le=100)
    image_ids: str | None = None
    output_folder: str | None = None
    object_storage: bool = True

    @field_validator("year")
    @classmethod
    def validate_year(cls, value: int) -> int:
        current_year = datetime.now().year

        if value < 1984 or value > current_year:
            raise ValueError(
                f"Year must be between 1984 and {current_year}"
            )

        return value

    @model_validator(mode="after")
    def validate_outputs(self):
        if self.output_folder is None and not self.object_storage:
            raise ValueError(
                "Either output_folder or object_storage must be specified"
            )
        return self

class BarcAnalysisResult(BaseModel):
    job_id: str
    status: str
    fire: str
    year: int
    outputs: list[str] = []
    warnings: list[str] = []
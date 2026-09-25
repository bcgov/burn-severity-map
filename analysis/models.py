from pydantic import BaseModel, Field, field_validator
from typing import Literal
from datetime import date, datetime

class BsJob(BaseModel):
    fire: str = Field(pattern=r"^[A-Za-z]\d{5}$")
    year: int
    sensor: Literal["S2", "LS_8_9", "LS_5_7"]
    start_date: str
    end_date: str
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

    @field_validator("output_folder")
    @classmethod
    def validate_outputs(cls, value, info):
        object_storage = info.data.get("object_storage", False)

        if not value and not object_storage:
            raise ValueError(
                "Either output_folder or object_storage must be specified"
            )

        return value

class BarcAnalysisResult(BaseModel):
    status: str
    fire: str
    year: int
    outputs: list[str] = []
    warnings: list[str] = []
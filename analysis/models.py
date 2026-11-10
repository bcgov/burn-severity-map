from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Literal
from datetime import datetime

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
    status: str
    fire: str
    year: int
    outputs: list[str] = []
    warnings: list[str] = []
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    repository_url: str = Field(min_length=1, max_length=500)
    branch: str = Field(default="main", max_length=100)
    runtime: str = Field(default="Unknown", max_length=50)
    region: str = Field(default="asia-south1", max_length=100)


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    repository_url: str
    branch: str
    runtime: str
    region: str
    status: str
    created_at: datetime

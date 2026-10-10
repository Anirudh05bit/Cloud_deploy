
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DeploymentResponse(BaseModel):
    id: int
    project_id: int
    commit_hash: str
    version: str
    status: str
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

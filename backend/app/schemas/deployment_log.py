
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DeploymentLogResponse(BaseModel):
    id: int
    deployment_id: int
    stage: str
    level: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

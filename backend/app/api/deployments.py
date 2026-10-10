
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.project import Project
from app.models.deployment import Deployment
from app.schemas.deployment import DeploymentResponse
from app.models.deployment_log import DeploymentLog
from app.schemas.deployment_log import DeploymentLogResponse

from app.services.deployment_worker import process_deployment

router = APIRouter(tags=["Deployments"])


@router.get(
    "/api/deployments/",
    response_model=list[DeploymentResponse],
)
def get_deployments(
    db: Session = Depends(get_db),
):
    return (
        db.query(Deployment)
        .order_by(Deployment.created_at.desc())
        .all()
    )



@router.post(
    "/api/projects/{project_id}/deployments/",
    response_model=DeploymentResponse,
    status_code=201,
)
def create_deployment(
    project_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    deployment_count = (
        db.query(Deployment)
        .filter(Deployment.project_id == project_id)
        .count()
    )

    new_deployment = Deployment(
        project_id=project_id,
        commit_hash="pending",
        version=f"v{deployment_count + 1}",
        status="QUEUED",
    )

    try:
        db.add(new_deployment)
        db.commit()
        db.refresh(new_deployment)

        # Save the ID before the request's DB session closes.
        deployment_id = new_deployment.id

        # Process the deployment after sending the response.
        background_tasks.add_task(
            process_deployment,
            deployment_id,
        )

        return new_deployment

    except Exception:
        db.rollback()
        raise


@router.get(
    "/api/projects/{project_id}/deployments/",
    response_model=list[DeploymentResponse],
)
def get_project_deployments(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return (
        db.query(Deployment)
        .filter(Deployment.project_id == project_id)
        .order_by(Deployment.created_at.desc())
        .all()
    )

@router.get(
    "/api/deployments/{deployment_id}/logs/",
    response_model=list[DeploymentLogResponse],
)
def get_deployment_logs(
    deployment_id: int,
    db: Session = Depends(get_db),
):
    deployment = (
        db.query(Deployment)
        .filter(Deployment.id == deployment_id)
        .first()
    )

    if deployment is None:
        raise HTTPException(
            status_code=404,
            detail="Deployment not found",
        )

    return (
        db.query(DeploymentLog)
        .filter(DeploymentLog.deployment_id == deployment_id)
        .order_by(DeploymentLog.created_at.asc(), DeploymentLog.id.asc())
        .all()
    )

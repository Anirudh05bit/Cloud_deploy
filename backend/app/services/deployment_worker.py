
import logging
import time
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.deployment import Deployment
from app.models.deployment_log import DeploymentLog


logger = logging.getLogger(__name__)


def add_log(
    db: Session,
    deployment_id: int,
    stage: str,
    message: str,
    level: str = "INFO",
):
    log_entry = DeploymentLog(
        deployment_id=deployment_id,
        stage=stage,
        level=level,
        message=message,
    )

    db.add(log_entry)
    db.commit()


def process_deployment(deployment_id: int):
    db = SessionLocal()

    try:
        deployment = (
            db.query(Deployment)
            .filter(Deployment.id == deployment_id)
            .first()
        )

        if deployment is None:
            logger.error(
                "Deployment %s was not found",
                deployment_id,
            )
            return

        if deployment.status != "QUEUED":
            logger.info(
                "Deployment %s is not queued; skipping",
                deployment_id,
            )
            return

        deployment.status = "CLONING"
        deployment.started_at = datetime.utcnow()
        db.commit()

        add_log(
            db,
            deployment_id,
            "VALIDATION",
            "Deployment record found. Local simulation started.",
        )

        # Simulate cloning the repository.
        time.sleep(1)
        add_log(
            db,
            deployment_id,
            "CLONING",
            "Simulation: repository preparation completed.",
        )

        # Simulate running tests.
        deployment.status = "TESTING"
        db.commit()

        time.sleep(1)
        add_log(
            db,
            deployment_id,
            "TESTING",
            "Simulation: tests passed.",
        )

        # Simulate building the application.
        deployment.status = "BUILDING"
        db.commit()

        time.sleep(1)
        add_log(
            db,
            deployment_id,
            "BUILD",
            "Simulation: application build completed.",
        )

        # Simulate deployment and health checks.
        deployment.status = "DEPLOYING"
        db.commit()

        time.sleep(1)
        add_log(
            db,
            deployment_id,
            "DEPLOY",
            "Simulation: deployment stage completed.",
        )

        deployment.status = "HEALTH_CHECK"
        db.commit()

        time.sleep(1)
        add_log(
            db,
            deployment_id,
            "HEALTH_CHECK",
            "Simulation: health check passed.",
        )

        deployment.status = "SUCCESS"
        deployment.completed_at = datetime.utcnow()
        db.commit()

        add_log(
            db,
            deployment_id,
            "COMPLETE",
            "Simulated deployment finished successfully.",
        )

    except Exception:
        db.rollback()
        logger.exception(
            "Deployment %s failed",
            deployment_id,
        )

        try:
            deployment = (
                db.query(Deployment)
                .filter(Deployment.id == deployment_id)
                .first()
            )

            if deployment is not None:
                deployment.status = "FAILED"
                deployment.completed_at = datetime.utcnow()
                db.commit()

                add_log(
                    db,
                    deployment_id,
                    "ERROR",
                    "Deployment simulation failed. Check backend logs.",
                    level="ERROR",
                )
        except Exception:
            db.rollback()
            logger.exception(
                "Could not save failure status for deployment %s",
                deployment_id,
            )

    finally:
        db.close()

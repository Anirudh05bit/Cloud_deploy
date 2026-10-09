from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine, Base
from app.models.project import Project
from app.models.deployment import Deployment
from app.api.projects import router as projects_router


app = FastAPI(
    title="CloudDeploy API",
    description="Cloud deployment management platform",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)

# Add columns that create_all does not add to existing tables
with engine.begin() as connection:
    connection.execute(
        text(
            "ALTER TABLE projects "
            "ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'QUEUED'"
        )
    )


# Register API routers
app.include_router(projects_router)


@app.get("/")
def root():
    return {
        "message": "CloudDeploy API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }
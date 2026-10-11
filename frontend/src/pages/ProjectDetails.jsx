
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FolderGit2,
  Rocket,
  GitBranch,
  Server,
  Database,
  ArrowLeft,
} from "lucide-react";

import RepositoryInspection from "../components/RepositoryInspection";
import StatusBadge from "../components/StatusBadge";

import {
  getProject,
  getProjectDeployments,
} from "../services/projectService";

import { createDeployment } from "../services/deploymentService";

function formatDate(dateString) {
  if (!dateString) return "Not available";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString();
}

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");
  const [deployError, setDeployError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjectDetails() {
      setLoading(true);
      setError("");

      try {
        const projectData = await getProject(projectId);

        const deploymentData =
          await getProjectDeployments(projectId);

        if (!cancelled) {
          setProject(projectData);
          setDeployments(deploymentData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              "Could not load project details. Check the backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjectDetails();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function handleDeploy() {
    setDeploying(true);
    setDeployError("");

    try {
      const deployment = await createDeployment(projectId);

      navigate(`/deployments/${deployment.id}`);
    } catch (err) {
      setDeployError(
        err.response?.data?.detail ||
          "Could not create the deployment."
      );
    } finally {
      setDeploying(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-slate-500">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <p className="text-red-600">
          {error || "Project not found."}
        </p>

        <Link
          to="/projects"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  const latestDeployment = deployments[0];

  return (
    <div className="p-8">
      <Link
        to="/projects"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Project #{project.id}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {project.name}
          </h1>

          <a
            href={project.repository_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-2 break-all text-sm text-indigo-600 hover:underline"
          >
            <FolderGit2 size={16} />
            {project.repository_url}
          </a>
        </div>

        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Rocket size={18} />
          {deploying ? "Creating deployment..." : "Deploy"}
        </button>
      </div>

      {deployError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {deployError}
        </div>
      )}

      {/* Project information */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <GitBranch size={20} />

          <p className="mt-4 text-sm text-slate-500">
            Branch
          </p>

          <p className="mt-1 font-semibold">
            {project.branch}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <Server size={20} />

          <p className="mt-4 text-sm text-slate-500">
            Runtime
          </p>

          <p className="mt-1 font-semibold">
            {project.runtime}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <Database size={20} />

          <p className="mt-4 text-sm text-slate-500">
            Region
          </p>

          <p className="mt-1 font-semibold">
            {project.region}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">
            Latest Deployment
          </p>

          <div className="mt-3">
            {latestDeployment ? (
              <StatusBadge status={latestDeployment.status} />
            ) : (
              <span className="text-sm text-slate-400">
                No deployments yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Repository Inspection */}

      <RepositoryInspection projectId={project.id} />

      {/* Deployment history */}

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          Deployment History
        </h2>

        {deployments.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No deployments found for this project. Click Deploy
            to create your first deployment.
          </p>
        ) : (
          <div className="mt-5">
            {deployments.map((deployment) => (
              <Link
                key={deployment.id}
                to={`/deployments/${deployment.id}`}
                className="flex flex-col gap-3 border-b border-slate-100 py-4 last:border-0 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {deployment.version}
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    Commit: {deployment.commit_hash}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Created: {formatDate(deployment.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={deployment.status} />
                  <span className="text-sm text-indigo-600">
                    View logs →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;

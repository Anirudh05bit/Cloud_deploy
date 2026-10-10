
import { useCallback, useEffect, useState } from "react";
import {
  Rocket,
  RefreshCw,
  Clock3,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { getProjects } from "../services/projectService";
import {
  getDeployments,
  createDeployment,
} from "../services/deploymentService";

function StatusBadge({ status }) {
  const styles = {
    QUEUED: "bg-amber-50 text-amber-700",
    CLONING: "bg-blue-50 text-blue-700",
    TESTING: "bg-blue-50 text-blue-700",
    BUILDING: "bg-blue-50 text-blue-700",
    DEPLOYING: "bg-blue-50 text-blue-700",
    HEALTH_CHECK: "bg-purple-50 text-purple-700",
    SUCCESS: "bg-emerald-50 text-emerald-700",
    FAILED: "bg-red-50 text-red-700",
    ROLLING_BACK: "bg-orange-50 text-orange-700",
    ROLLED_BACK: "bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status?.replaceAll("_", " ") || "UNKNOWN"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "Not started";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Deployments() {
  const [projects, setProjects] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [projectData, deploymentData] = await Promise.all([
        getProjects(),
        getDeployments(),
      ]);

      setProjects(projectData);
      setDeployments(deploymentData);

      setSelectedProjectId((current) => {
        if (
          current &&
          projectData.some(
            (project) => String(project.id) === current
          )
        ) {
          return current;
        }

        return projectData.length
          ? String(projectData[0].id)
          : "";
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load projects or deployments. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleDeploy() {
    if (!selectedProjectId) {
      setError("Create a project before requesting a deployment.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setNotice("");

      const deployment = await createDeployment(
        selectedProjectId
      );

      setNotice(
        `Deployment ${deployment.version} was created with status ${deployment.status}.`
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not create the deployment. Please try again."
      );
    } finally {
      setCreating(false);
    }
  }

  const projectNames = new Map(
    projects.map((project) => [
      project.id,
      project.name,
    ])
  );

  const sortedDeployments = [...deployments].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  const successCount = deployments.filter(
    (deployment) => deployment.status === "SUCCESS"
  ).length;

  const failedCount = deployments.filter(
    (deployment) => deployment.status === "FAILED"
  ).length;

  const queuedCount = deployments.filter(
    (deployment) =>
      ["QUEUED", "CLONING", "TESTING", "BUILDING", "DEPLOYING", "HEALTH_CHECK"].includes(
        deployment.status
      )
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Delivery pipeline
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Deployments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Request deployments and track their lifecycle.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Total deployments"
            value={deployments.length}
            icon={<Rocket size={20} />}
          />
          <Stat
            label="Queued / processing"
            value={queuedCount}
            icon={<Clock3 size={20} />}
          />
          <Stat
            label="Successful"
            value={successCount}
            icon={<CheckCircle2 size={20} />}
          />
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Create a deployment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a registered project to create a deployment record.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <select
              aria-label="Select project"
              value={selectedProjectId}
              onChange={(event) =>
                setSelectedProjectId(event.target.value)
              }
              disabled={!projects.length || creating}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              {!projects.length && (
                <option value="">No projects available</option>
              )}

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} — {project.branch}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleDeploy}
              disabled={!selectedProjectId || creating || loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Rocket size={17} />
              )}
              {creating ? "Creating..." : "Deploy project"}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            This runs a simulated pipeline through cloning, testing, building, deploying, and a health check. Use Refresh to see the latest status.
          </p>
        </div>

        {notice && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Deployment history
            </h2>
            <span className="text-sm text-slate-500">
              {deployments.length} records
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading deployments...
              </div>
            ) : sortedDeployments.length === 0 ? (
              <div className="p-10 text-center">
                <Rocket
                  size={30}
                  className="mx-auto text-slate-400"
                />
                <h3 className="mt-3 font-semibold text-slate-900">
                  No deployments yet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Select a project above and click Deploy project.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Version</th>
                      <th className="px-5 py-4 font-semibold">Project</th>
                      <th className="px-5 py-4 font-semibold">Commit</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Created</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {sortedDeployments.map((deployment) => (
                      <tr
                        key={deployment.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {deployment.version}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {projectNames.get(deployment.project_id) ||
                            `Project #${deployment.project_id}`}
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          {deployment.commit_hash}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={deployment.status} />
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(deployment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {failedCount > 0 && (
            <p className="mt-3 text-sm text-red-600">
              {failedCount} deployment(s) have failed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="text-slate-400">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
    
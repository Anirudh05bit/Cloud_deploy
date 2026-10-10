
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  Terminal,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from "lucide-react";

import {
  getDeployments,
  getDeploymentLogs,
} from "../services/deploymentService";

const activeStatuses = [
  "QUEUED",
  "CLONING",
  "TESTING",
  "BUILDING",
  "DEPLOYING",
  "HEALTH_CHECK",
  "ROLLING_BACK",
];

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString("en-IN");
}

export default function DeploymentDetails() {
  const { deploymentId } = useParams();

  const [deployment, setDeployment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDetails = useCallback(async () => {
    try {
      setError("");

      const deploymentData = await getDeployments();
      const selected = deploymentData.find(
        (item) => String(item.id) === deploymentId
      );

      if (!selected) {
        setDeployment(null);
        setLogs([]);
        setError("Deployment not found.");
        return;
      }

      setDeployment(selected);

      const logData = await getDeploymentLogs(selected.id);
      setLogs(logData);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load deployment details."
      );
    } finally {
      setLoading(false);
    }
  }, [deploymentId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  useEffect(() => {
    if (!deployment || !activeStatuses.includes(deployment.status)) {
      return;
    }

    const timer = setInterval(loadDetails, 2000);

    return () => clearInterval(timer);
  }, [deployment, loadDetails]);

  if (loading) {
    return (
      <div className="p-8 text-slate-500">
        Loading deployment details...
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="p-8">
        <p className="text-red-600">
          {error || "Deployment not found."}
        </p>
        <Link
          to="/deployments"
          className="mt-4 inline-block text-blue-600"
        >
          Back to deployments
        </Link>
      </div>
    );
  }

  const successful = deployment.status === "SUCCESS";
  const failed = deployment.status === "FAILED";

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/deployments"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to deployments
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-blue-600">
              Deployment #{deployment.id}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Version {deployment.version}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Project ID: {deployment.project_id}
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold ${
              successful
                ? "bg-emerald-100 text-emerald-700"
                : failed
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {successful ? (
              <CheckCircle2 size={17} />
            ) : failed ? (
              <XCircle size={17} />
            ) : (
              <LoaderCircle size={17} className="animate-spin" />
            )}
            {deployment.status.replaceAll("_", " ")}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={<Clock size={19} />}
            label="Created"
            value={formatDate(deployment.created_at)}
          />
          <InfoCard
            icon={<Terminal size={19} />}
            label="Commit"
            value={deployment.commit_hash || "Pending"}
          />
          <InfoCard
            icon={<Clock size={19} />}
            label="Started"
            value={formatDate(deployment.started_at)}
          />
          <InfoCard
            icon={<CheckCircle2 size={19} />}
            label="Completed"
            value={formatDate(deployment.completed_at)}
          />
        </div>

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Deployment logs
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Logs recorded by the backend worker
              </p>
            </div>

            <button
              type="button"
              onClick={loadDetails}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No logs recorded for this deployment yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[150px_90px_1fr]"
                >
                  <span className="text-xs text-slate-500">
                    {formatDate(log.created_at)}
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      log.level === "ERROR"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {log.stage} · {log.level}
                  </span>

                  <p className="break-words text-sm text-slate-700">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-3 break-words text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

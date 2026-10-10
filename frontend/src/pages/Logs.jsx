import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, RefreshCw, Terminal } from "lucide-react";

import {
  getDeploymentLogs,
  getDeployments,
} from "../services/deploymentService";

function formatDate(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Unknown time"
    : date.toLocaleString("en-IN");
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const deployments = await getDeployments();
      const deploymentLogs = await Promise.all(
        deployments.map(async (deployment) => {
          const entries = await getDeploymentLogs(deployment.id);
          return entries.map((entry) => ({
            ...entry,
            version: deployment.version,
          }));
        })
      );

      setLogs(
        deploymentLogs
          .flat()
          .sort(
            (left, right) =>
              new Date(right.created_at).getTime() -
              new Date(left.created_at).getTime()
          )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Could not load deployment logs. Check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Deployment activity
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Logs
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Saved stage messages from deployment runs.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLogs}
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

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">
              Loading deployment logs...
            </p>
          ) : logs.length === 0 ? (
            <div className="p-10 text-center">
              <Terminal className="mx-auto text-slate-400" size={28} />
              <p className="mt-3 font-semibold text-slate-900">
                No deployment logs yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Create a deployment to see its simulated pipeline stages here.
              </p>
              <Link
                to="/deployments"
                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Go to deployments
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[170px_110px_1fr_auto]"
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
                  <Link
                    to={`/deployments/${log.deployment_id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {log.version}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

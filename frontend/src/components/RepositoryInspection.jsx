
import { useState } from "react";
import { inspectProjectRepository } from "../services/projectService";

export default function RepositoryInspection({ projectId }) {
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInspect() {
    setLoading(true);
    setError("");
    setInspection(null);

    try {
      const result = await inspectProjectRepository(projectId);
      setInspection(result);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not inspect the repository. Check the backend and repository URL."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Repository Inspection
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Inspect the GitHub repository, latest commit, and detected runtime.
          </p>
        </div>

        <button
          onClick={handleInspect}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Inspecting..." : "Inspect Repository"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {inspection && (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Detected Runtime</p>
              <p className="mt-2 font-semibold text-slate-900">
                {inspection.detected_runtime}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Branch</p>
              <p className="mt-2 font-semibold text-slate-900">
                {inspection.requested_branch}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Repository Visibility</p>
              <p className="mt-2 font-semibold text-slate-900">
                {inspection.private ? "Private" : "Public"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Repository</h3>
            <a
              href={inspection.repository_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 break-all text-sm text-indigo-600 hover:underline"
            >
              {inspection.full_name}
            </a>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Latest Commit</h3>
            <p className="mt-1 break-all font-mono text-sm text-slate-600">
              {inspection.latest_commit_hash}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {inspection.latest_commit_message}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">
              Files Found in Repository Root
            </h3>

            {inspection.root_files.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {inspection.root_files.map((file) => (
                  <span
                    key={file}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                  >
                    {file}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No root-level files were returned.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

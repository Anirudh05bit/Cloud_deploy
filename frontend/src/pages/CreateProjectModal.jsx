
import { useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import { createProject } from "../services/projectService";

const initialForm = {
  name: "",
  repository_url: "",
  branch: "main",
  runtime: "node",
  region: "asia-south1",
};

export default function CreateProjectModal({
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const repositoryUrl = form.repository_url.trim();

    if (
      !/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(
        repositoryUrl
      )
    ) {
      setError(
        "Enter a valid GitHub repository URL, myre"
      );
      return;
    }

    try {
      setLoading(true);

      await createProject({
        ...form,
        name: form.name.trim(),
        repository_url: repositoryUrl,
        branch: form.branch.trim(),
      });

      await onCreated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not create the project.You are really shitty bro. "
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "block text-sm font-medium text-slate-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FolderPlus size={23} />
            </div>

            <div>
              <h2
                id="create-project-title"
                className="text-lg font-semibold text-slate-900"
              >
                Create project
              </h2>
              <p className="text-sm text-slate-500">
                Connect a repository to CloudDeploy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Project name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="My React Application"
              className={inputClass}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label
              htmlFor="repository_url"
              className={labelClass}
            >
              GitHub repository URL
            </label>
            <input
              id="repository_url"
              name="repository_url"
              type="url"
              value={form.repository_url}
              onChange={handleChange}
              placeholder="https://github.com/username/repository"
              className={inputClass}
              maxLength={500}
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Use the HTTPS URL of your repository.
            </p>
          </div>

          <div>
            <label htmlFor="branch" className={labelClass}>
              Branch
            </label>
            <input
              id="branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="main"
              className={inputClass}
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="runtime" className={labelClass}>
                Runtime
              </label>
              <select
                id="runtime"
                name="runtime"
                value={form.runtime}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="node">Node.js</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
              </select>
            </div>

            <div>
              <label htmlFor="region" className={labelClass}>
                GCP region
              </label>
              <select
                id="region"
                name="region"
                value={form.region}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="asia-south1">
                  Mumbai (asia-south1)
                </option>
                <option value="asia-south2">
                  Delhi (asia-south2)
                </option>
                <option value="asia-southeast1">
                  Singapore (asia-southeast1)
                </option>
                <option value="us-central1">
                  Iowa (us-central1)
                </option>
                <option value="europe-west1">
                  Belgium (europe-west1)
                </option>
              </select>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {loading ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

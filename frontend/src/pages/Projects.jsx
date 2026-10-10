
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { getProjects } from "../services/projectService";
import CreateProjectModal from "./CreateProjectModal";

const runtimeLabels = {
  node: "Node.js",
  python: "Python",
  java: "Java",
  go: "Go",
};

function getRepositoryName(url) {
  try {
    const parts = new URL(url).pathname
      .split("/")
      .filter(Boolean);

    return parts.slice(-2).join("/");
  } catch {
    return url;
  }
}

function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProjectCard({ project }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
            <FolderGit2 size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {project.name}
            </h3>
            <p className="mt-1 truncate text-sm text-slate-500">
              {getRepositoryName(project.repository_url)}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {runtimeLabels[project.runtime] || project.runtime}
        </span>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">Branch</span>
          <span className="max-w-[65%] truncate font-medium text-slate-700">
            {project.branch}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">GCP region</span>
          <span className="font-medium text-slate-700">
            {project.region}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">Created</span>
          <span className="text-slate-600">
            {formatDate(project.created_at)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <a
          href={project.repository_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600"
        >
          Repository <ExternalLink size={14} />
        </a>

        <Link
          to={`/projects/${project.id}`}
          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
        >
          View project
        </Link>
      </div>
    </article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load projects. Check that the backend and database are running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    return (
      project.name.toLowerCase().includes(searchText) ||
      project.repository_url.toLowerCase().includes(searchText) ||
      project.runtime.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Projects
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage repositories and prepare applications for deployment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create project
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={loadProjects}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mt-5 text-sm text-slate-500">
          {projects.length} {projects.length === 1 ? "project" : "projects"} total
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={loadProjects}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FolderGit2 size={27} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {search ? "No matching projects" : "No projects yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "Try another search term."
                : "Create your first project to start organizing your application deployments."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Create your first project
              </button>
            )}
          </div>
        )}
      </div>

      {showCreateForm && (
        <CreateProjectModal
          onClose={() => setShowCreateForm(false)}
          onCreated={loadProjects}
        />
      )}
    </div>
  );
}
 
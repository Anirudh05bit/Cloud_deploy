import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import ProjectCard from "../components/ProjectCard";
import { getProjects } from "../services/projectService";


function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getProjects()
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.detail ||
              requestError.message ||
              "Unable to load projects.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Projects
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your connected GitHub repositories.
          </p>

        </div>


        <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800">

          <Plus size={18} />

          New Project

        </button>

      </div>


      {/* Projects */}

      {loading && <p className="text-slate-500">Loading projects...</p>}

      {error && (
        <p role="alert" className="mb-5 text-sm text-red-600">
          Could not load projects: {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="text-slate-500">No projects found.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              repository={project.repository_url}
            />
          ))}
        </div>
      )}


    </div>
  );
}

export default Projects;
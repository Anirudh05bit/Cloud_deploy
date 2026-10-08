import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";


function ProjectCard({
  id,
  name,
  repository,
  runtime,
  status,
  region,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <h2 className="font-semibold text-slate-900">
            {name}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {repository}
          </p>

        </div>

        <StatusBadge status={status} />

      </div>


      <div className="mt-6 grid grid-cols-2 gap-4">

        <div>

          <p className="text-xs text-slate-400">
            Runtime
          </p>

          <p className="mt-1 text-sm font-medium">
            {runtime}
          </p>

        </div>

        <div>

          <p className="text-xs text-slate-400">
            Region
          </p>

          <p className="mt-1 text-sm font-medium">
            {region}
          </p>

        </div>

      </div>


      <div className="mt-6 flex gap-3">

        <Link
          to={`/projects/${id}`}
          className="flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          View Project
        </Link>

      </div>

    </div>
  );
}

export default ProjectCard;
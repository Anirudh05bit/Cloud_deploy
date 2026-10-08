import { GitCommitHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";

function DeploymentCard({
  project,
  branch,
  commit,
  status,
  time,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">

      <div>

        <p className="font-medium text-slate-900">
          {project}
        </p>

        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

          <span>
            {branch}
          </span>

          <span>•</span>

          <GitCommitHorizontal size={14} />

          <span>
            {commit}
          </span>

        </div>

      </div>

      <div className="flex items-center gap-4">

        <span className="text-sm text-slate-400">
          {time}
        </span>

        <StatusBadge status={status} />

      </div>

    </div>
  );
}

export default DeploymentCard;
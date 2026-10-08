import {
  FolderGit2,
  Rocket,
  GitBranch,
  Server,
  Database,
} from "lucide-react";

import { useParams } from "react-router-dom";

import StatusBadge from "../components/StatusBadge";


function ProjectDetails() {

  const { projectId } = useParams();


  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8 flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            Project #{projectId}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            ecommerce-api
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">

            <FolderGit2 size={16} />

            github.com/Anirudh05bit/ecommerce-api

          </p>

        </div>


        <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white">

          <Rocket size={18} />

          Deploy

        </button>

      </div>


      {/* Project information */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border bg-white p-5">

          <GitBranch size={20} />

          <p className="mt-4 text-sm text-slate-500">
            Branch
          </p>

          <p className="mt-1 font-semibold">
            main
          </p>

        </div>


        <div className="rounded-xl border bg-white p-5">

          <Server size={20} />

          <p className="mt-4 text-sm text-slate-500">
            Runtime
          </p>

          <p className="mt-1 font-semibold">
            Node.js
          </p>

        </div>


        <div className="rounded-xl border bg-white p-5">

          <Database size={20} />

          <p className="mt-4 text-sm text-slate-500">
            Environment
          </p>

          <p className="mt-1 font-semibold">
            Production
          </p>

        </div>


        <div className="rounded-xl border bg-white p-5">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <div className="mt-3">

            <StatusBadge status="SUCCESS" />

          </div>

        </div>

      </div>


      {/* Deployment history */}

      <div className="mt-8 rounded-xl border bg-white p-6">

        <h2 className="text-xl font-semibold">
          Deployment History
        </h2>

        <div className="mt-5">

          {[
            ["v23", "a83d91f", "SUCCESS", "2 min ago"],
            ["v22", "91ab23c", "SUCCESS", "8 min ago"],
            ["v21", "2cd901a", "FAILED", "15 min ago"],
            ["v20", "c812ab4", "SUCCESS", "1 hour ago"],
          ].map(
            ([version, commit, status, time]) => (

              <div
                key={version}
                className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"
              >

                <div>

                  <p className="font-medium">
                    {version}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Commit {commit}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-sm text-slate-400">
                    {time}
                  </span>

                  <StatusBadge status={status} />

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default ProjectDetails;
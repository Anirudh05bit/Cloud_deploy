import {
  FolderGit2,
  Rocket,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import StatCard from "../components/StatCard";
import DeploymentCard from "../components/DeploymentCard";


const recentDeployments = [
  {
    project: "ecommerce-api",
    branch: "main",
    commit: "a83d91f",
    status: "SUCCESS",
    time: "2 min ago",
  },
  {
    project: "frontend",
    branch: "main",
    commit: "91ab23c",
    status: "SUCCESS",
    time: "8 min ago",
  },
  {
    project: "payment-service",
    branch: "main",
    commit: "2cd901a",
    status: "FAILED",
    time: "15 min ago",
  },
  {
    project: "notification-service",
    branch: "develop",
    commit: "c812ab4",
    status: "RUNNING",
    time: "20 min ago",
  },
];


function Dashboard() {
  return (
    <div className="p-8">

      {/* Page Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor your cloud deployments and projects.
        </p>

      </div>


      {/* Statistics */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Projects"
          value="5"
          description="2 added this month"
          icon={FolderGit2}
        />

        <StatCard
          title="Deployments"
          value="24"
          description="8 this week"
          icon={Rocket}
        />

        <StatCard
          title="Successful"
          value="21"
          description="87.5% success rate"
          icon={CheckCircle2}
        />

        <StatCard
          title="Failed"
          value="3"
          description="12.5% failure rate"
          icon={XCircle}
        />

      </div>


      {/* Recent Deployments */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-4">

          <h2 className="text-xl font-semibold text-slate-900">
            Recent Deployments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest deployment activity.
          </p>

        </div>


        <div>

          {recentDeployments.map((deployment, index) => (

            <DeploymentCard
              key={index}
              project={deployment.project}
              branch={deployment.branch}
              commit={deployment.commit}
              status={deployment.status}
              time={deployment.time}
            />

          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
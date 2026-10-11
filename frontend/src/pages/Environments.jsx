import { Link } from "react-router-dom";
import { Server } from "lucide-react";

export default function Environments() {
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-blue-600">
          Project configuration
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Environments
        </h1>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8">
          <Server className="text-slate-400" size={28} />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Environment management is not available yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Environment settings are not currently provided by the backend.
            You can still manage projects and view their deployments.
          </p>
          <Link
            to="/projects"
            className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Go to projects
          </Link>
        </section>
      </div>
    </div>
  );
}
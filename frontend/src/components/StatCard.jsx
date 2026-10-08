import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">

            <ArrowUpRight size={15} />

            {description}

          </div>
        </div>

        <div className="rounded-lg bg-slate-100 p-3">

          <Icon
            size={21}
            className="text-slate-700"
          />

        </div>

      </div>

    </div>
  );
}

export default StatCard;
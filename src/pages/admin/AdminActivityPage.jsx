import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatDateTime } from "../../utils/formatters";
import { Search } from "lucide-react";

export const AdminActivityPage = () => {
  const { activityLogs } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = activityLogs.filter((act) => {
    const matches =
      act.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      act.userName.toLowerCase().includes(search.toLowerCase()) ||
      act.action.toLowerCase().includes(search.toLowerCase()) ||
      act.details.toLowerCase().includes(search.toLowerCase());
    if (!matches) return false;
    if (categoryFilter !== "all" && act.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Audit Activity Log"
        description="Immutable audit record of user permissions, plan upgrades, AI triggers, and tenant events."
        badge={`${filtered.length} Events`}
      />

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search activity events, tenant, user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Event Categories</option>
          <option value="lead">Lead Operations</option>
          <option value="ai">AI Model Handoffs</option>
          <option value="team">Team Routing</option>
          <option value="billing">Plan &amp; Billing</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 text-xs">
          {filtered.map((act) => (
            <div
              key={act.id}
              className="p-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-xs">
                    {act.action}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                    {act.category}
                  </span>
                </div>
                <span className="text-xs text-slate-400 tabular-nums">
                  {formatDateTime(act.timestamp)}
                </span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{act.details}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <span>
                  Tenant: <strong className="text-slate-700">{act.organizationName}</strong>
                </span>
                <span>·</span>
                <span>Actor: {act.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
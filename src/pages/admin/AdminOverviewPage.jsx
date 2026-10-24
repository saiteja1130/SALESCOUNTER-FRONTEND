import { useApp } from "../../context/AppContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatRelativeTime } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const AdminOverviewPage = () => {
  const { adminOrgs, activityLogs } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Infrastructure & Overview"
        description="Cross-tenant system operations, aggregate message throughput, and tenant subscriptions."
        badge="Platform Operations"
        actions={
          <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs font-medium">
            Simulation Sandbox · Read-Only Audits
          </span>
        }
      />

      {/* High-level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Organizations"
          value="148"
          subValue="142 active enterprise tenants"
          trend={{ value: "+18 this month", isPositive: true }}
          icon={<Building2 className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate("/admin/organizations")}
        />
        <MetricCard
          label="Total Active Sales Reps"
          value="612"
          subValue="Across all tenant workspaces"
          icon={<Users className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/admin/users")}
        />
        <MetricCard
          label="Monthly WhatsApp Messages"
          value="1.42M"
          subValue="Processed through webhook bridge"
          trend={{ value: "140ms p95 latency", isPositive: true }}
          icon={<MessageSquare className="w-4 h-4 text-slate-600" />}
        />
        <MetricCard
          label="Active Tenants"
          value="142"
          subValue="Active customer organizations"
          trend={{ value: "+14 this month", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/admin/organizations")}
        />
      </div>

      {/* Main Grid: Tenants Table + Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Tenant Organizations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mock sample of provisioned business accounts
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/organizations")}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-600">
                  <th className="py-2.5 px-3 font-medium">Organization</th>
                  <th className="py-2.5 px-3 font-medium">Seats</th>
                  <th className="py-2.5 px-3 text-right font-medium">Leads / Mo</th>
                  <th className="py-2.5 px-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminOrgs.slice(0, 5).map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div>{org.name}</div>
                      <div className="text-xs text-slate-400 font-normal">
                        {org.industry}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 tabular-nums">
                      {org.seatsUsed} / {org.seatsLimit}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-900 tabular-nums">
                      {org.leadsThisMonth.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          org.status === "Active"
                            ? "bg-emerald-50 text-emerald-800"
                            : org.status === "Trial"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-rose-50 text-rose-800"
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Platform Events
            </h3>
            <span className="text-xs text-slate-400">Live stream</span>
          </div>
          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-800">
                    {act.organizationName}
                  </span>
                  <span className="tabular-nums">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
                <div className="font-medium text-slate-900">{act.action}</div>
                <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {act.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
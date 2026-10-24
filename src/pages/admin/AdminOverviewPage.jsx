import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
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
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [orgRes, logRes] = await Promise.allSettled([
          apiClient.get("/admin/organizations"),
          apiClient.get("/admin/audit-logs"),
        ]);

        if (isMounted) {
          if (orgRes.status === "fulfilled" && orgRes.value.success) {
            setOrganizations(orgRes.value.organizations || []);
          }
          if (logRes.status === "fulfilled" && logRes.value.success) {
            setAuditLogs(logRes.value.logs || []);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(
    (o) => o.subscription?.status?.toLowerCase() === "active"
  ).length;

  const totalAllowedReps = organizations.reduce((acc, o) => {
    const base = o.subscription?.plan === "enterprise" ? 10 : o.subscription?.plan === "growth" ? 5 : 2;
    return acc + base + (o.subscription?.repAddons || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Infrastructure & Overview"
        description="Cross-tenant system operations, aggregate message throughput, and tenant subscriptions."
        badge="Platform Operations"
        actions={
          <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs font-medium">
            Live Central Operations
          </span>
        }
      />

      {/* High-level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Organizations"
          value={String(totalOrgs)}
          subValue={`${activeOrgs} active customer tenants`}
          trend={{ value: `${totalOrgs} total`, isPositive: true }}
          icon={<Building2 className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate("/admin/organizations")}
        />
        <MetricCard
          label="Rep Seat Capacity"
          value={String(totalAllowedReps)}
          subValue="Across provisioned tenant workspaces"
          icon={<Users className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/admin/organizations")}
        />
        <MetricCard
          label="Active Tenants"
          value={String(activeOrgs)}
          subValue="Active customer organizations"
          trend={{ value: `${activeOrgs} live`, isPositive: true }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/admin/organizations")}
        />
        <MetricCard
          label="Audit Log Entries"
          value={String(auditLogs.length)}
          subValue="Immutable administration events"
          icon={<MessageSquare className="w-4 h-4 text-slate-600" />}
          onClick={() => navigate("/admin/activity")}
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
                Active registered tenants in platform MongoDB
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
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading organizations...</div>
            ) : organizations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No organizations provisioned yet.</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-600">
                    <th className="py-2.5 px-3 font-medium">Organization</th>
                    <th className="py-2.5 px-3 font-medium">Plan</th>
                    <th className="py-2.5 px-3 text-right font-medium">Rep Add-ons</th>
                    <th className="py-2.5 px-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizations.slice(0, 5).map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        <div>{org.name}</div>
                        <div className="text-xs text-slate-400 font-normal">
                          {org.owner?.email || org.slug}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 capitalize">
                        {org.subscription?.plan || "Trial"}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-900 tabular-nums">
                        {org.subscription?.repAddons || 0}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                            org.subscription?.status === "active"
                              ? "bg-emerald-50 text-emerald-800"
                              : org.subscription?.status === "trial"
                              ? "bg-blue-50 text-blue-800"
                              : "bg-rose-50 text-rose-800"
                          }`}
                        >
                          {org.subscription?.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Events Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Admin Events
            </h3>
            <span className="text-xs text-slate-400">Live stream</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading audit events...</div>
            ) : auditLogs.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No audit activity recorded yet.</div>
            ) : (
              auditLogs.slice(0, 5).map((act) => (
                <div
                  key={act._id || act.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800">
                      {act.targetOrganizationId?.name || "System"}
                    </span>
                    <span className="tabular-nums">
                      {act.createdAt ? formatRelativeTime(act.createdAt) : "Just now"}
                    </span>
                  </div>
                  <div className="font-medium text-slate-900">{act.action}</div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {act.note || act.details || "Subscription modification"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
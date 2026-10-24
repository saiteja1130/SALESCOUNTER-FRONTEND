import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatDateTime } from "../../utils/formatters";
import { Search } from "lucide-react";

export const AdminActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchLogs() {
      try {
        setLoading(true);
        const res = await apiClient.get("/admin/audit-logs");
        if (isMounted && res.success && Array.isArray(res.logs)) {
          setLogs(res.logs);
        }
      } catch {
        if (isMounted) setLogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = logs.filter((act) => {
    const orgName = act.targetOrganizationId?.name || "";
    const adminEmail = act.adminUserId?.email || "";
    const adminName = act.adminUserId?.name || "";
    const action = act.action || "";
    const note = act.note || "";
    const matches =
      orgName.toLowerCase().includes(search.toLowerCase()) ||
      adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      adminName.toLowerCase().includes(search.toLowerCase()) ||
      action.toLowerCase().includes(search.toLowerCase()) ||
      note.toLowerCase().includes(search.toLowerCase());
    return matches;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Audit Activity Log"
        description="Immutable audit record of subscription modifications, plan changes, and tenant events."
        badge={`${filtered.length} Events`}
      />

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search activity events, tenant, admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit log events...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No audit activity recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {filtered.map((act) => (
              <div
                key={act._id || act.id}
                className="p-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">
                      {act.action}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 capitalize">
                      Platform Audit
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {act.createdAt ? formatDateTime(act.createdAt) : "Recently"}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{act.note || "No additional notes."}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                  <span>
                    Tenant:{" "}
                    <strong className="text-slate-700">
                      {act.targetOrganizationId?.name || "Global / System"}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Admin:{" "}
                    {act.adminUserId?.name
                      ? `${act.adminUserId.name} (${act.adminUserId.email})`
                      : act.adminUserId?.email || "Platform Admin"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
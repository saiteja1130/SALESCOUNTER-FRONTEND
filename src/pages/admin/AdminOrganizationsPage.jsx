import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatDate } from "../../utils/formatters";
import { Search, Edit3, Check, X, Shield, RefreshCw } from "lucide-react";

export const AdminOrganizationsPage = () => {
  const { showToast } = useToast();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingOrg, setEditingOrg] = useState(null);
  const [planInput, setPlanInput] = useState("trial");
  const [statusInput, setStatusInput] = useState("active");
  const [cycleInput, setCycleInput] = useState("trial");
  const [repAddonsInput, setRepAddonsInput] = useState(0);
  const [campaignsAddonInput, setCampaignsAddonInput] = useState(false);
  const [followUpsAddonInput, setFollowUpsAddonInput] = useState(false);
  const [endDateInput, setEndDateInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/admin/organizations");
      if (res.success && Array.isArray(res.organizations)) {
        setOrganizations(res.organizations);
      } else {
        setOrganizations([]);
      }
    } catch {
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleEdit = (org) => {
    setEditingOrg(org);
    const sub = org.subscription || {};
    setPlanInput(sub.plan || "trial");
    setStatusInput(sub.status || "active");
    setCycleInput(sub.billingCycle || "trial");
    setRepAddonsInput(sub.repAddons || 0);
    setCampaignsAddonInput(Boolean(sub.campaignsAddon));
    setFollowUpsAddonInput(Boolean(sub.followUpsAddon));
    setEndDateInput(
      sub.endDate ? new Date(sub.endDate).toISOString().slice(0, 10) : ""
    );
  };

  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    if (!editingOrg) return;

    try {
      setSaving(true);
      await apiClient.patch(`/admin/subscriptions/${editingOrg.id}`, {
        plan: planInput,
        status: statusInput,
        billingCycle: cycleInput,
        repAddons: parseInt(repAddonsInput, 10) || 0,
        campaignsAddon: campaignsAddonInput,
        followUpsAddon: followUpsAddonInput,
        endDate: endDateInput ? new Date(endDateInput).toISOString() : undefined,
        note: `Subscription updated by platform administrator`,
      });
      showToast("Subscription updated successfully and audit log recorded");
      setEditingOrg(null);
      fetchOrganizations();
    } catch (err) {
      showToast(err.message || "Failed to update subscription", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = organizations.filter((org) => {
    const name = org.name || "";
    const email = org.owner?.email || "";
    const db = org.tenantDbName || "";
    const query = search.toLowerCase();
    return (
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      db.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Organizations & Subscriptions"
        description="Inspect provisioned customer databases, plan entitlements, and manually assign subscriptions."
        badge={`${filtered.length} Tenants`}
      />

      {/* Search Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenant by company, owner email, database name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
        <button
          onClick={fetchOrganizations}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Organization & Tenant DB</th>
                <th className="py-3 px-4">Owner Contact</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Rep Seats</th>
                <th className="py-3 px-4">Features</th>
                <th className="py-3 px-4">Renewal / Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((org) => {
                const sub = org.subscription || {};
                return (
                  <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{org.name}</div>
                      <div className="text-2xs text-slate-400 font-mono font-normal">
                        {org.tenantDbName || org.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{org.owner?.name || "Workspace Owner"}</div>
                      <div className="text-2xs text-slate-400 font-mono">
                        {org.owner?.email || "—"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-slate-800">
                      {sub.plan || "Trial"}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      {sub.repAddons ? `+${sub.repAddons} extra` : "Base plan"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 space-x-1">
                      {sub.campaignsAddon && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-2xs font-semibold">
                          Campaigns
                        </span>
                      )}
                      {sub.followUpsAddon && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-2xs font-semibold">
                          Follow-ups
                        </span>
                      )}
                      {!sub.campaignsAddon && !sub.followUpsAddon && sub.plan !== "enterprise" && (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                      {sub.endDate ? formatDate(sub.endDate) : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          sub.status === "active"
                            ? "bg-emerald-50 text-emerald-800"
                            : sub.status === "cancelled"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-rose-50 text-rose-800"
                        }`}
                      >
                        {sub.status || "active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(org)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Manage Subscription"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Subscription Edit Modal */}
      {editingOrg && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Manage Subscription: {editingOrg.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingOrg(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubscription} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subscription Plan</label>
                <select
                  value={planInput}
                  onChange={(e) => setPlanInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="trial">Trial (1 conn, 1 rep, 30 leads/day)</option>
                  <option value="basic">Basic (1 conn, 2 reps, 30 leads/day)</option>
                  <option value="growth">Growth (2 conns, 3 reps, 50 leads/day)</option>
                  <option value="enterprise">Enterprise (3 conns, 5 reps, 100 leads/day, campaigns included)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Billing Cycle</label>
                  <select
                    value={cycleInput}
                    onChange={(e) => setCycleInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="trial">Trial</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">End / Expiry Date</label>
                <input
                  type="date"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Extra Sales Rep Seats</label>
                <input
                  type="number"
                  min="0"
                  value={repAddonsInput}
                  onChange={(e) => setRepAddonsInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-1 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={campaignsAddonInput}
                    onChange={(e) => setCampaignsAddonInput(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Enable Campaigns Add-on</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={followUpsAddonInput}
                    onChange={(e) => setFollowUpsAddonInput(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Enable Follow-ups Add-on</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
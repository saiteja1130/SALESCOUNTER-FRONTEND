import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatDate } from "../../utils/formatters";
import { Search } from "lucide-react";

export const AdminOrganizationsPage = () => {
  const { adminOrgs } = useApp();
  const [search, setSearch] = useState("");

  const filtered = adminOrgs.filter((org) => {
    return (
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
      org.industry.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Organizations Management"
        description="Inspect provisioned customer accounts, seat consumption, and plan limits."
        badge={`${filtered.length} Tenants`}
      />

      {/* Search Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenant by company, owner email, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Owner / Contact</th>
                <th className="py-3 px-4">Seats Used</th>
                <th className="py-3 px-4 text-right">Leads / Mo</th>
                <th className="py-3 px-4 text-right">AI Messages</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{org.name}</div>
                    <div className="text-xs text-slate-400 font-normal">
                      {org.industry}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{org.ownerName}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {org.ownerEmail}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-slate-700">
                    {org.seatsUsed} / {org.seatsLimit}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-medium text-slate-900">
                    {org.leadsThisMonth.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-600">
                    {org.aiMessagesThisMonth.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                    {formatDate(org.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
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
    </div>
  );
};
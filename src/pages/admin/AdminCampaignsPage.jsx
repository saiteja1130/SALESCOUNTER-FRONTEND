import { MetricCard } from "../../components/ui/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { Radio, CheckCircle2, Eye, MessageSquare } from "lucide-react";

export const AdminCampaignsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform-Wide Broadcast Telemetry"
        description="Meta Cloud API delivery health, quality scores, and opt-out rates across all tenants."
        badge="Global Telemetry"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Broadcasts Dispatched"
          value="1,840"
          subValue="Across 142 organizations"
          icon={<Radio className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          label="Global Delivery Rate"
          value="98.7%"
          subValue="Meta Cloud API confirmed"
          trend={{ value: "Optimal", isPositive: true }}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          label="Spam / Complaint Rate"
          value="0.04%"
          subValue="Threshold target < 0.1%"
          icon={<Eye className="w-4 h-4 text-slate-700" />}
        />
        <MetricCard
          label="Meta Tier Quality"
          value="HIGH"
          subValue="Green phone status verified"
          icon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Recent Tenant Broadcast Jobs
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-xs">
                Apex Mobility Motors · Lucid Air VIP Demo Invitation
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Targeted 450 contacts · Oct 22, 2026
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Completed · 99.1% delivered
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-xs">
                Artisan Living Decor · Autumn Living VIP Catalog Drop
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Targeted 142 contacts · Oct 12, 2026
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Completed · 98.4% delivered
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-xs">
                Clarity Aesthetic Dermatology · Seasonal Skin Revitalize
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Targeted 210 contacts · Oct 8, 2026
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Completed · 97.9% delivered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
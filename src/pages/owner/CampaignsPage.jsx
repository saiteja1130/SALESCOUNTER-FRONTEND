import { useState, Fragment } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { MetricCard } from "../../components/ui/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { Unauthorized } from "../../components/layout/Unauthorized";
import { formatDate } from "../../utils/formatters";
import { Plus, Users, CheckCircle2, Eye, TrendingUp } from "lucide-react";

export const CampaignsPage = () => {
  const { role } = useAuth();
  const { campaigns, createCampaign, leads } = useApp();
  const { showToast } = useToast();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [name, setName] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("interested");
  const [templateMessage, setTemplateMessage] = useState(
    "Artisan Living Privilege: Discover our handcrafted bespoke dining suites before public launch. Reply VIP to reserve preview pricing."
  );

  if (role !== "owner") {
    return <Unauthorized featureName="Broadcast Marketing Campaigns" />;
  }

  const totalTargeted = campaigns.reduce((acc, c) => acc + c.targetCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalRead = campaigns.reduce((acc, c) => acc + c.readCount, 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + c.repliedCount, 0);

  const estimatedAudienceSize = {
    all_leads: leads.length,
    interested: leads.filter((l) => l.status === "Interested").length,
    converted: leads.filter((l) => l.status === "Converted").length,
    inactive_30_days: 12,
  }[audienceFilter] || 0;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !templateMessage.trim()) return;
    createCampaign({
      name,
      audienceFilter,
      targetCount: estimatedAudienceSize,
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      templateMessage,
    });
    setName("");
    setWizardOpen(false);
    showToast("WhatsApp broadcast campaign scheduled");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Broadcast Campaigns"
        description="Bulk outreach, catalog drops, and targeted re-engagement messages for your leads."
        badge={`${campaigns.length} Campaigns`}
        actions={
          <Button
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setWizardOpen(true)}
          >
            Create Campaign
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Leads Targeted"
          value={totalTargeted}
          subValue="Audience reach"
          icon={<Users className="w-4 h-4 text-slate-600" />}
        />
        <MetricCard
          label="Delivery Rate"
          value="98.2%"
          subValue={`${totalDelivered} messages delivered`}
          trend={{ value: "Meta Verified", isPositive: true }}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          label="Read Rate"
          value="82.4%"
          subValue={`${totalRead} leads opened`}
          icon={<Eye className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          label="Replied & Engaged"
          value="28.6%"
          subValue={`${totalReplied} active conversations`}
          trend={{ value: "High intent", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <h3 className="font-semibold text-sm text-slate-900">
            Campaign History &amp; Broadcast Schedule
          </h3>
          <span className="text-xs text-slate-500">
            WhatsApp Meta Cloud API Mock
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-600">
                <th className="py-3 px-5 font-medium">Campaign Name</th>
                <th className="py-3 px-4 font-medium">Audience Segment</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Targeted</th>
                <th className="py-3 px-4 text-right font-medium">Delivered</th>
                <th className="py-3 px-4 text-right font-medium">Read</th>
                <th className="py-3 px-4 text-right font-medium">Replied</th>
                <th className="py-3 px-5 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr
                  key={camp.id || camp.name}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-slate-900">
                    <div>{camp.name}</div>
                    <div className="text-xs text-slate-400 italic line-clamp-1 max-w-xs mt-0.5">
                      "{camp.templateMessage}"
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-600">
                    {camp.audienceFilter.replace("_", " ")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        camp.status === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : camp.status === "scheduled"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-medium text-slate-800">
                    {camp.targetCount}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-600">
                    {camp.deliveredCount || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-600">
                    {camp.readCount || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-emerald-700 font-semibold">
                    {camp.repliedCount || "-"}
                  </td>
                  <td className="py-3.5 px-5 text-right text-slate-400 tabular-nums whitespace-nowrap">
                    {formatDate(camp.scheduledDate || camp.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Create WhatsApp Broadcast Campaign"
        description="Broadcast customized messages to segmented leads without manual messaging."
        maxWidth="md"
        footer={
          <Fragment>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWizardOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              Schedule Broadcast
            </Button>
          </Fragment>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Campaign Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Black Friday VIP Early Access"
          />

          <Select
            label="Target Audience Segment"
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
          >
            <option value="interested">Interested Leads (High Intent)</option>
            <option value="all_leads">All Registered Inbound Leads</option>
            <option value="converted">Past Converted Customers (Upsell)</option>
            <option value="inactive_30_days">Cold Inactive Leads (&gt;30 days)</option>
          </Select>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>Estimated Audience:</span>
            <strong className="text-slate-900 tabular-nums">
              {estimatedAudienceSize} verified WhatsApp contacts
            </strong>
          </div>

          <Textarea
            label="WhatsApp Approved Template Body"
            required
            rows={4}
            value={templateMessage}
            onChange={(e) => setTemplateMessage(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

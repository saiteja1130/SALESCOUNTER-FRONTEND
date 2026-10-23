import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { MetricCard } from "../../components/ui/MetricCard";
import { Unauthorized } from "../../components/layout/Unauthorized";
import { formatDate } from "../../utils/formatters";
import { Plus, Users, CheckCircle2, Eye, TrendingUp } from "lucide-react";
const CampaignsPage = () => {
  const { role } = useAuth();
  const {
    campaigns,
    campaignsAddonUnlocked,
    setCampaignsAddonUnlocked,
    createCampaign,
    leads,
  } = useApp();
  const { showToast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [name, setName] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("interested");
  const [templateMessage, setTemplateMessage] = useState(
    "Artisan Living Privilege: Discover our handcrafted bespoke dining suites before public launch. Reply VIP to reserve preview pricing.",
  );
  if (role !== "owner") {
    return <Unauthorized featureName={"Broadcast Marketing Campaigns"} />;
  }
  const totalTargeted = campaigns.reduce((acc, c) => acc + c.targetCount, 0);
  const totalDelivered = campaigns.reduce(
    (acc, c) => acc + c.deliveredCount,
    0,
  );
  const totalRead = campaigns.reduce((acc, c) => acc + c.readCount, 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + c.repliedCount, 0);
  const estimatedAudienceSize = {
    all_leads: leads.length,
    interested: leads.filter((l) => l.status === "Interested").length,
    converted: leads.filter((l) => l.status === "Converted").length,
    inactive_30_days: 12,
  }[audienceFilter];
  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !templateMessage.trim()) return;
    createCampaign({
      name,
      audienceFilter,
      targetCount: estimatedAudienceSize,
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 864e5 * 2).toISOString(),
      templateMessage,
    });
    setName("");
    setWizardOpen(false);
    showToast("WhatsApp broadcast campaign scheduled");
  };
  return (
    <div className={"space-y-6"}>
      {
        <div
          className={
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          }
        >
          {
            <div>
              {
                <h1
                  className={
                    "text-2xl font-semibold text-slate-900 tracking-tight"
                  }
                >
                  WhatsApp Broadcast Campaigns
                </h1>
              }
              {
                <p className={"text-xs sm:text-sm text-slate-500 mt-1"}>
                  Bulk outreach, catalog drops, and targeted re-engagement
                  messages for your leads
                </p>
              }
            </div>
          }
          {
            <div className={"flex items-center gap-2.5"}>
              {
                <Button
                  size={"sm"}
                  icon={<Plus className={"w-3.5 h-3.5"} />}
                  onClick={() => setWizardOpen(true)}
                >
                  Create Campaign
                </Button>
              }
            </div>
          }
        </div>
      }
      {
        <div
          className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"}
        >
          {
            <MetricCard
              label={"Total Leads Targeted"}
              value={totalTargeted}
              subValue={"Audience reach"}
              icon={<Users className={"w-4 h-4 text-slate-600"} />}
            />
          }
          {
            <MetricCard
              label={"Delivery Rate"}
              value={"98.2%"}
              subValue={`${totalDelivered} messages delivered`}
              trend={{ value: "Meta Verified", isPositive: true }}
              icon={<CheckCircle2 className={"w-4 h-4 text-emerald-600"} />}
            />
          }
          {
            <MetricCard
              label={"Read Rate"}
              value={"82.4%"}
              subValue={`${totalRead} leads opened`}
              icon={<Eye className={"w-4 h-4 text-blue-600"} />}
            />
          }
          {
            <MetricCard
              label={"Replied & Engaged"}
              value={"28.6%"}
              subValue={`${totalReplied} active conversations`}
              trend={{ value: "High intent", isPositive: true }}
              icon={<TrendingUp className={"w-4 h-4 text-emerald-600"} />}
            />
          }
        </div>
      }
      {
        <div
          className={
            "bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs"
          }
        >
          {
            <div
              className={
                "p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between"
              }
            >
              {
                <h3 className={"font-semibold text-xs text-slate-900"}>
                  Campaign History &amp; Broadcast Schedule
                </h3>
              }
              {
                <span className={"text-[11px] text-slate-400"}>
                  WhatsApp Meta Cloud API Mock
                </span>
              }
            </div>
          }
          {
            <div className={"overflow-x-auto"}>
              {
                <table className={"w-full text-left border-collapse text-xs"}>
                  {
                    <thead>
                      {
                        <tr
                          className={
                            "border-b border-slate-200/80 bg-slate-50/70 text-xs font-medium text-slate-500"
                          }
                        >
                          {
                            <th className={"py-3 px-5 font-medium"}>
                              Campaign Name
                            </th>
                          }
                          {
                            <th className={"py-3 px-4 font-medium"}>
                              Audience Segment
                            </th>
                          }
                          {<th className={"py-3 px-4 font-medium"}>Status</th>}
                          {
                            <th className={"py-3 px-4 text-right font-medium"}>
                              Targeted
                            </th>
                          }
                          {
                            <th className={"py-3 px-4 text-right font-medium"}>
                              Delivered
                            </th>
                          }
                          {
                            <th className={"py-3 px-4 text-right font-medium"}>
                              Read
                            </th>
                          }
                          {
                            <th className={"py-3 px-4 text-right font-medium"}>
                              Replied
                            </th>
                          }
                          {
                            <th className={"py-3 px-5 text-right font-medium"}>
                              Date
                            </th>
                          }
                        </tr>
                      }
                    </thead>
                  }
                  {
                    <tbody className={"divide-y divide-slate-100"}>
                      {campaigns.map((camp) => (
                        <tr
                          className={"hover:bg-slate-50/80 transition-colors"}
                        >
                          {
                            <td
                              className={
                                "py-3.5 px-5 font-semibold text-slate-900"
                              }
                            >
                              {<div>{camp.name}</div>}
                              {
                                <div
                                  className={
                                    "text-[11px] text-slate-400 italic line-clamp-1 max-w-xs mt-0.5"
                                  }
                                >
                                  "{camp.templateMessage}"
                                </div>
                              }
                            </td>
                          }
                          {
                            <td
                              className={
                                "py-3.5 px-4 capitalize text-slate-600"
                              }
                            >
                              {camp.audienceFilter.replace("_", " ")}
                            </td>
                          }
                          {
                            <td className={"py-3.5 px-4"}>
                              {
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${camp.status === "completed" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : camp.status === "scheduled" ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-slate-100 text-slate-700"}`}
                                >
                                  {camp.status}
                                </span>
                              }
                            </td>
                          }
                          {
                            <td
                              className={
                                "py-3.5 px-4 text-right tabular-nums font-medium text-slate-800"
                              }
                            >
                              {camp.targetCount}
                            </td>
                          }
                          {
                            <td
                              className={
                                "py-3.5 px-4 text-right tabular-nums text-slate-600"
                              }
                            >
                              {camp.deliveredCount || "-"}
                            </td>
                          }
                          {
                            <td
                              className={
                                "py-3.5 px-4 text-right tabular-nums text-slate-600"
                              }
                            >
                              {camp.readCount || "-"}
                            </td>
                          }
                          {
                            <td
                              className={
                                "py-3.5 px-4 text-right tabular-nums text-emerald-700 font-semibold"
                              }
                            >
                              {camp.repliedCount || "-"}
                            </td>
                          }
                          {
                            <td
                              className={
                                "py-3.5 px-5 text-right text-slate-400 tabular-nums whitespace-nowrap"
                              }
                            >
                              {formatDate(camp.scheduledDate || camp.createdAt)}
                            </td>
                          }
                        </tr>
                      ))}
                    </tbody>
                  }
                </table>
              }
            </div>
          }
        </div>
      }
      {
        <Modal
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          title={"Create WhatsApp Broadcast Campaign"}
          description={
            "Broadcast customized messages to segmented leads without manual messaging."
          }
          maxWidth={"md"}
          footer={
            <Fragment>
              {
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => setWizardOpen(false)}
                >
                  Cancel
                </Button>
              }
              {
                <Button size={"sm"} onClick={handleCreate}>
                  Schedule Broadcast
                </Button>
              }
            </Fragment>
          }
        >
          {
            <form onSubmit={handleCreate} className={"space-y-4"}>
              {
                <Input
                  label={"Campaign Name *"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={"e.g. Black Friday VIP Early Access"}
                  required
                />
              }
              {
                <Select
                  label={"Target Audience Segment"}
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                >
                  {
                    <option value={"interested"}>
                      Interested Leads (High Intent)
                    </option>
                  }
                  {
                    <option value={"all_leads"}>
                      All Registered Inbound Leads
                    </option>
                  }
                  {
                    <option value={"converted"}>
                      Past Converted Customers (Upsell)
                    </option>
                  }
                  {
                    <option value={"inactive_30_days"}>
                      Cold Inactive Leads (&gt;30 days)
                    </option>
                  }
                </Select>
              }
              {
                <div
                  className={
                    "p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between"
                  }
                >
                  {<span>Estimated Audience:</span>}
                  {
                    <strong className={"text-slate-900 tabular-nums"}>
                      {estimatedAudienceSize} verified WhatsApp contacts
                    </strong>
                  }
                </div>
              }
              {
                <div>
                  {
                    <label
                      className={
                        "block text-xs font-medium text-slate-700 mb-1.5"
                      }
                    >
                      WhatsApp Approved Template Body *
                    </label>
                  }
                  {
                    <textarea
                      rows={4}
                      value={templateMessage}
                      onChange={(e) => setTemplateMessage(e.target.value)}
                      className={
                        "w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      }
                      required
                    />
                  }
                </div>
              }
            </form>
          }
        </Modal>
      }
    </div>
  );
};
export { CampaignsPage };

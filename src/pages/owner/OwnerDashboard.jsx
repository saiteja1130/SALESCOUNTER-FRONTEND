import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { LeadsChart } from "../../components/dashboard/LeadsChart";
import { ConversionFunnel } from "../../components/dashboard/ConversionFunnel";
import { OnboardingChecklist } from "../../components/dashboard/OnboardingChecklist";
import { LeadDrawer } from "../../components/leads/LeadDrawer";
import { LeadModal } from "../../components/leads/LeadModal";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Unauthorized } from "../../components/layout/Unauthorized";
import { formatRelativeTime } from "../../utils/formatters";
import {
  Users,
  MessageSquare,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { role } = useAuth();
  const { leads, organization, scheduledFollowUps } = useApp();
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");

  if (role !== "owner") {
    return <Unauthorized featureName="Sales Manager Performance Dashboard" />;
  }

  const totalLeads = leads.length;
  const activeConversations = leads.filter(
    (l) => l.status !== "Converted" && l.status !== "Lost",
  ).length;
  const scheduledCount = scheduledFollowUps.filter(
    (s) => s.status === "pending",
  ).length;
  const convertedLeads = leads.filter((l) => l.status === "Converted");
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads.length / totalLeads) * 100) : 0;
  const humanHandoffQueue = leads.filter(
    (l) => l.needsAttention || !l.aiHandled,
  );
  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.lastContactAt).getTime() -
        new Date(a.lastContactAt).getTime(),
    )
    .slice(0, 5);

  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const handleEditLead = (lead) => {
    setLeadToEdit(lead);
    setDrawerOpen(false);
    setModalOpen(true);
  };

  const timeRangeLabels = {
    today: "Today (Real-time)",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    all: "All Time",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Executive Sales Dashboard
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time WhatsApp sales performance and human handoff queue for{" "}
            <span className="font-semibold text-slate-800">
              {organization.name}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
            {["today", "7d", "30d", "all"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  timeRange === r
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r === "today"
                  ? "Today"
                  : r === "7d"
                    ? "7 Days"
                    : r === "30d"
                      ? "30 Days"
                      : "All"}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setLeadToEdit(null);
              setModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Human Handoff Alert */}
      {humanHandoffQueue.length > 0 && (
        <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-amber-950">
                  Priority Action Required: Human Handoff Queue (
                  {humanHandoffQueue.length})
                </h2>
                <p className="text-xs text-amber-800">
                  These leads requested human sales rep intervention or
                  triggered pricing discount limits.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/inbox")}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-300"
            >
              <span>View All in Shared Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3">
            {humanHandoffQueue.slice(0, 2).map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleOpenLead(lead)}
                role="button"
                tabIndex={0}
                aria-label={`Open lead details for ${lead.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenLead(lead);
                  }
                }}
                className="bg-white p-4 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">
                      {lead.name}
                    </span>
                    <Badge status={lead.status} size="sm" />
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Needs Rep Reply
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    Interest:{" "}
                    <strong className="text-slate-800">
                      {lead.collectedData?.interestedProduct ||
                        "Bespoke Inbound Consultation"}
                    </strong>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={lead.assignedToName} />
                      <span>
                        Owner:{" "}
                        <strong className="text-slate-700">
                          {lead.assignedToName}
                        </strong>
                      </span>
                    </div>
                    <span>•</span>
                    <span className="text-amber-900 font-medium">
                      Waiting: {formatRelativeTime(lead.lastContactAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/inbox");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Take Over in Inbox
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Leads Tracked"
          value={totalLeads}
          subValue="All inbound WhatsApp leads in CRM"
          trend={{ value: `${timeRangeLabels[timeRange]}`, isPositive: true }}
          icon={<Users className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/leads")}
          ariaLabel="View all leads"
        />
        <MetricCard
          label="Active WhatsApp Chats"
          value={activeConversations}
          subValue="Inbound qualified in pipeline"
          trend={{
            value: `${
              totalLeads > 0
                ? Math.round((activeConversations / totalLeads) * 100)
                : 0
            }% of total leads`,
            isPositive: true,
          }}
          icon={<MessageSquare className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate("/inbox")}
          ariaLabel="View active conversations in inbox"
        />
        <MetricCard
          label="Scheduled Follow-ups"
          value={scheduledCount}
          subValue="Queued for automated dispatch"
          trend={{ value: "Next 48h active", isPositive: true }}
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate("/follow-ups")}
          ariaLabel="View scheduled follow ups"
        />
        <MetricCard
          label="Converted Leads"
          value={convertedLeads.length}
          subValue={`${conversionRate}% close rate (${convertedLeads.length} of ${totalLeads})`}
          trend={{
            value: `${conversionRate >= 15 ? "Above target" : "In progress"}`,
            isPositive: conversionRate >= 15,
          }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/leads")}
          ariaLabel="View converted leads"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <LeadsChart timeRange={timeRange} />
        </div>
        <div className="lg:col-span-1">
          <ConversionFunnel />
        </div>
      </div>

      {/* Recent Inquiries + Onboarding Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent WhatsApp Inquiries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest prospect messages with assigned sales reps
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate("/leads")}
            >
              All Leads ({totalLeads})
            </Button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleOpenLead(lead)}
                role="button"
                tabIndex={0}
                aria-label={`View lead ${lead.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenLead(lead);
                  }
                }}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2.5 rounded-xl cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar name={lead.name} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {lead.name}
                      </span>
                      <Badge status={lead.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lead.collectedData?.interestedProduct ||
                        "General Catalog Inquiry"}{" "}
                      · {lead.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-slate-600 font-medium">
                        Assigned: {lead.assignedToName}
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(lead.lastContactAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/inbox");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLead(lead);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <OnboardingChecklist />
        </div>
      </div>

      {/* Drawers & Modals */}
      <LeadDrawer
        lead={selectedLead}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEditLead}
      />
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};

export { OwnerDashboard };

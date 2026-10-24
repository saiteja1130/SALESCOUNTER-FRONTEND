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
import { PageHeader } from "../../components/ui/PageHeader";
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
  Sparkles,
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
    (l) => l.status !== "Converted" && l.status !== "Lost"
  ).length;
  const scheduledCount = scheduledFollowUps.filter(
    (s) => s.status === "pending"
  ).length;
  const convertedLeads = leads.filter((l) => l.status === "Converted");
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads.length / totalLeads) * 100) : 0;
  const humanHandoffQueue = leads.filter(
    (l) => l.needsAttention || !l.aiHandled
  );
  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.lastContactAt).getTime() -
        new Date(a.lastContactAt).getTime()
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
    today: "Today",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    all: "All Time",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Executive Sales Dashboard"
        description={`Real-time WhatsApp sales pipeline, AI qualification, and team handoffs for ${organization.name}.`}
        badge={
          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
            Live Pipeline
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-xs">
              {["today", "7d", "30d", "all"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    timeRange === r
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
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
            >
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Priority 1: Human Handoff Queue (Highest urgency) */}
      {humanHandoffQueue.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-amber-950 tracking-tight">
                  Action Required: Human Handoff Queue ({humanHandoffQueue.length})
                </h2>
                <p className="text-xs text-amber-800 leading-relaxed">
                  These prospects asked for a sales agent or triggered pricing/custom consultation limits.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/inbox")}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-300/80 shadow-2xs"
            >
              <span>View All in Shared Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                      Takeover Needed
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    Interest:{" "}
                    <strong className="text-slate-800">
                      {lead.collectedData?.interestedProduct ||
                        "Bespoke Inbound Consultation"}
                    </strong>
                  </p>
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={lead.assignedToName} size="sm" />
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
                      navigate(`/inbox?leadId=${lead.id}`);
                    }}
                  >
                    Open Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority 2: Key Metrics Grid (Equal height cards in 4-column row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Leads Tracked"
          value={totalLeads}
          subValue="All inbound WhatsApp contacts in CRM"
          trend={{ value: timeRangeLabels[timeRange], isPositive: true }}
          icon={<Users className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/leads")}
          ariaLabel="View all leads"
        />
        <MetricCard
          label="Active WhatsApp Pipeline"
          value={activeConversations}
          subValue="Currently qualified & ongoing chats"
          trend={{
            value: `${
              totalLeads > 0
                ? Math.round((activeConversations / totalLeads) * 100)
                : 0
            }% active`,
            isPositive: true,
          }}
          icon={<MessageSquare className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate("/inbox")}
          ariaLabel="View active conversations in inbox"
        />
        <MetricCard
          label="Scheduled Follow-ups"
          value={scheduledCount}
          subValue="Automated AI cadence triggers"
          trend={{ value: "Next 48h active", isPositive: true }}
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate("/follow-ups")}
          ariaLabel="View scheduled follow ups"
        />
        <MetricCard
          label="Closed Deals"
          value={convertedLeads.length}
          subValue={`${conversionRate}% close rate (${convertedLeads.length} of ${totalLeads})`}
          trend={{
            value: conversionRate >= 15 ? "On Target" : "In Progress",
            isPositive: conversionRate >= 15,
          }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/leads")}
          ariaLabel="View converted leads"
        />
      </div>

      {/* Priority 3: 12-Column Grid (Trends & Conversion Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <LeadsChart timeRange={timeRange} />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <ConversionFunnel />
        </div>
      </div>

      {/* Priority 4: Recent Inbound Inquiries & Setup Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  Recent WhatsApp Inquiries
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest prospective customer conversations
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
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar name={lead.name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {lead.name}
                        </span>
                        <Badge status={lead.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {lead.collectedData?.interestedProduct ||
                          "General Catalog Inquiry"}{" "}
                        · <span className="font-mono text-slate-600">{lead.phone}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
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
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/inbox?leadId=${lead.id}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reply</span>
                    </button>
                    <button
                      type="button"
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
        </div>

        <div className="lg:col-span-4 flex flex-col">
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

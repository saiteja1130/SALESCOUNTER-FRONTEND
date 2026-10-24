import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { LeadDrawer } from "../../components/leads/LeadDrawer";
import { LeadModal } from "../../components/leads/LeadModal";
import { formatRelativeTime, formatDateTime } from "../../utils/formatters";
import {
  Users2,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  Send,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalespersonDashboard = () => {
  const { currentUser } = useAuth();
  const { filteredLeads, scheduledFollowUps, triggerScheduledNow } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [confirmTask, setConfirmTask] = useState(null);
  const [isTriggering, setIsTriggering] = useState(false);

  const myAssignedLeads = filteredLeads;
  const waitingForMe = [...myAssignedLeads]
    .filter((l) => l.needsAttention || !l.aiHandled)
    .sort(
      (a, b) =>
        new Date(a.lastContactAt).getTime() -
        new Date(b.lastContactAt).getTime()
    );
  const takeoverCount = waitingForMe.filter((l) => l.needsAttention).length;
  const manualCount = waitingForMe.filter(
    (l) => !l.needsAttention && !l.aiHandled
  ).length;
  const myScheduled = scheduledFollowUps.filter(
    (s) => s.assignedToId === currentUser.id && s.status === "pending"
  );
  const myConverted = myAssignedLeads.filter((l) => l.status === "Converted");
  const myConversionRate =
    myAssignedLeads.length > 0
      ? Math.round((myConverted.length / myAssignedLeads.length) * 100)
      : 0;

  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const handleConfirmTrigger = async () => {
    if (!confirmTask) return;
    try {
      setIsTriggering(true);
      const res = await triggerScheduledNow(confirmTask.id);
      showToast(res?.message || "Follow-up message dispatched immediately.");
    } catch (err) {
      showToast(err.message || "Failed to trigger follow-up message.", "error");
    } finally {
      setIsTriggering(false);
      setConfirmTask(null);
    }
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
        title="Sales Work Queue"
        description={`Personal queue, pending client replies, and follow-ups assigned to ${currentUser.name}.`}
        badge={
          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
            Personal Queue
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
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => navigate("/inbox")}
            >
              My Inbox ({waitingForMe.length})
            </Button>
          </div>
        }
      />

      {/* Metric Cards (Equal Height Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="My Active Leads"
          value={myAssignedLeads.length}
          subValue="Direct client assignments in CRM"
          trend={{ value: timeRangeLabels[timeRange], isPositive: true }}
          icon={<Users2 className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/leads")}
          ariaLabel="View my active leads"
        />
        <MetricCard
          label="Awaiting My Reply"
          value={waitingForMe.length}
          subValue={`${takeoverCount} takeover · ${manualCount} manual`}
          trend={{
            value: waitingForMe.length > 0 ? "Urgent attention" : "All clear",
            isPositive: waitingForMe.length === 0,
          }}
          icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate("/inbox")}
          ariaLabel="View conversations awaiting my reply"
        />
        <MetricCard
          label="Scheduled Follow-ups"
          value={myScheduled.length}
          subValue="Due in your personal queue"
          trend={{ value: "Cadences active", isPositive: true }}
          icon={<Clock className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate("/follow-ups")}
          ariaLabel="View my scheduled follow ups"
        />
        <MetricCard
          label="My Conversions"
          value={myConverted.length}
          subValue={`${myConverted.length} of ${myAssignedLeads.length} assigned leads closed`}
          trend={{
            value: `${myConversionRate}% win rate`,
            isPositive: myConversionRate >= 15,
          }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate("/leads")}
          ariaLabel="View converted leads"
        />
      </div>

      {/* Subtle Explanation Indicator */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">
            Queue Intelligence:
          </strong>{" "}
          Leads enter your priority queue if human takeover was triggered by a prospect question ({takeoverCount} leads) or if AI autopilot is paused for manual handling ({manualCount} leads).
        </div>
      </div>

      {/* Two Column Work Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Priority Response Queue */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                    Priority Response Queue
                  </h2>
                  {waitingForMe.length > 0 && (
                    <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                      {waitingForMe.length} pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sorted by oldest unanswered prospect message
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/inbox")}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer focus-visible:underline"
              >
                <span>Go to Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {waitingForMe.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Your Priority Queue is All Clear!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      All assigned customer messages have been answered. Check scheduled follow-ups or review leads.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => navigate("/follow-ups")}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Check Scheduled Follow-ups ({myScheduled.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/leads")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Review All Leads ({myAssignedLeads.length})
                    </button>
                  </div>
                </div>
              ) : (
                waitingForMe.map((lead, idx) => (
                  <div
                    key={lead.id}
                    onClick={() => handleOpenLead(lead)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Reply to lead ${lead.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenLead(lead);
                      }
                    }}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900">
                          {lead.name}
                        </span>
                        <Badge status={lead.status} size="sm" />
                        {idx === 0 && (
                          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Oldest
                          </span>
                        )}
                        {lead.needsAttention && (
                          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Takeover
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        Inquiry:{" "}
                        <strong className="text-slate-800">
                          {lead.collectedData?.interestedProduct ||
                            "Inbound sales consultation"}
                        </strong>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>
                          Waiting:{" "}
                          <strong className="text-slate-700">
                            {formatRelativeTime(lead.lastContactAt)}
                          </strong>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{lead.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Send className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/inbox?leadId=${lead.id}`);
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Scheduled Follow-up Reminders */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  Scheduled Follow-up Reminders
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated outreach and reminders in your queue
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/follow-ups")}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer focus-visible:underline"
              >
                <span>Cadence Rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {myScheduled.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      No Follow-ups Due Right Now
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Automated cadence rules trigger follow-up reminders as leads become inactive.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/follow-ups")}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Manage Follow-up Cadence Rules
                  </button>
                </div>
              ) : (
                myScheduled.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900">
                          {task.leadName}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-md font-semibold">
                          {task.ruleTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &quot;{task.messagePreview}&quot;
                      </p>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Scheduled:{" "}
                          <strong className="text-slate-700">
                            {formatDateTime(task.scheduledTime)}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setConfirmTask(task)}
                      >
                        Trigger Now
                      </Button>
                      <button
                        type="button"
                        onClick={() => navigate(`/inbox?leadId=${task.leadId}`)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Open lead conversation in Shared Inbox"
                        aria-label="Open chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Trigger Modal */}
      {confirmTask && (
        <Modal
          isOpen={Boolean(confirmTask)}
          onClose={() => setConfirmTask(null)}
          title="Send Scheduled Follow-up on WhatsApp?"
          description="Review the scheduled message template before dispatching it immediately to the customer."
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmTask(null)}
                disabled={isTriggering}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmTrigger} disabled={isTriggering}>
                {isTriggering ? "Sending Message..." : "Confirm & Send WhatsApp Message"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="text-slate-600">
                Recipient:{" "}
                <strong className="text-slate-900">{confirmTask.leadName}</strong>
              </div>
              <div className="text-slate-600">
                Automation Rule:{" "}
                <strong className="text-blue-700">{confirmTask.ruleTitle}</strong>
              </div>
              <div className="text-slate-600">
                Scheduled for:{" "}
                <strong>{formatDateTime(confirmTask.scheduledTime)}</strong>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Message Preview:
              </label>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-sm text-slate-900 leading-relaxed italic">
                &quot;{confirmTask.messagePreview}&quot;
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Triggering this will immediately send the message via your WhatsApp business channel and mark this follow-up as complete.
            </p>
          </div>
        </Modal>
      )}

      <LeadDrawer
        lead={selectedLead}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={(lead) => {
          setLeadToEdit(lead);
          setDrawerOpen(false);
          setModalOpen(true);
        }}
      />
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};

export { SalespersonDashboard };

import { useState, useMemo, Fragment } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { PageHeader } from "../../components/ui/PageHeader";
import { Unauthorized } from "../../components/layout/Unauthorized";
import {
  Plus,
  Crown,
  Play,
  Pause,
  Trash2,
  Shuffle,
  Shield,
  AlertTriangle,
  Info,
  Users,
  CheckCircle2,
  Mail,
  Clock,
  RotateCcw,
  XCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export const TeamPage = () => {
  const { role, salespersonCanViewAllLeads, setSalespersonCanViewAllLeads } = useAuth();
  const {
    teamMembers,
    invitations = [],
    seatUsage,
    roundRobinEnabled,
    setRoundRobinEnabled,
    inviteTeamMember,
    resendInvitation,
    revokeInvitation,
    changeTeamMemberStatus,
    toggleTeamMemberStatus,
    removeTeamMember,
    leads,
    fetchTeamMembers,
  } = useApp();
  const { showToast } = useToast();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const [revokingId, setRevokingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [pendingVisibilityState, setPendingVisibilityState] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [reassignOption, setReassignOption] = useState("reassign");
  const [reassignTargetId, setReassignTargetId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Eligible sales reps for reassignment (exclude the member to delete and EXCLUDE the owner)
  const eligibleReassignTargets = useMemo(() => {
    if (!memberToDelete) return [];
    return teamMembers.filter(
      (m) => m.id !== memberToDelete.id && m.role !== "owner" && m.status === "active"
    );
  }, [teamMembers, memberToDelete]);

  const leadsAssignedToMember = useMemo(() => {
    if (!memberToDelete) return [];
    return leads.filter((l) => {
      const repId = l.assignedToId?._id || l.assignedToId;
      return repId === memberToDelete.id;
    });
  }, [leads, memberToDelete]);

  if (role !== "owner") {
    return <Unauthorized featureName="Team & Sales Routing" />;
  }

  const salesReps = teamMembers.filter((m) => m.role === "salesperson");
  const activeReps = salesReps.filter((m) => m.status === "active");
  const pausedReps = salesReps.filter((m) => m.status === "paused");
  const disabledReps = salesReps.filter((m) => m.status === "disabled");
  const pendingInvites = invitations.filter((i) => i.status === "pending");

  const totalSeats = seatUsage?.maxAllowed ?? 5;
  const usedSeats = seatUsage?.currentUsed ?? (activeReps.length + pausedReps.length + pendingInvites.length);
  const availableSeats = seatUsage?.available ?? Math.max(0, totalSeats - usedSeats);
  const isSeatLimitReached = availableSeats <= 0;

  const initiateDeleteMember = (member) => {
    setMemberToDelete(member);
    const hasOtherActiveReps = eligibleReassignTargets.length > 0;
    if (hasOtherActiveReps) {
      setReassignOption("reassign");
      setReassignTargetId(eligibleReassignTargets[0].id);
    } else {
      setReassignOption("unassign");
      setReassignTargetId("");
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      const res = await removeTeamMember(memberToDelete.id, {
        reassignOption,
        reassignTargetId: reassignOption === "reassign" ? reassignTargetId : undefined,
      });

      if (res?.reassignedCount > 0) {
        showToast(
          `Reassigned ${res.reassignedCount} lead${res.reassignedCount > 1 ? "s" : ""} and removed ${memberToDelete.name}`
        );
      } else if (res?.unassignedCount > 0) {
        showToast(
          `Unassigned ${res.unassignedCount} lead${res.unassignedCount > 1 ? "s" : ""} and removed ${memberToDelete.name}`
        );
      } else {
        showToast(`Removed ${memberToDelete.name} from sales team`);
      }
      setMemberToDelete(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to remove team member";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setEmailError("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail) {
      showToast("Name and email are required", "error");
      return;
    }

    if (isSeatLimitReached) {
      setEmailError(`Seat limit reached (${totalSeats}/${totalSeats} in use). Upgrade plan to invite more.`);
      showToast("Seat limit reached for your organization", "error");
      return;
    }

    setIsInviting(true);
    try {
      await inviteTeamMember(trimmedName, trimmedEmail, trimmedPhone);
      setName("");
      setEmail("");
      setPhone("");
      setEmailError("");
      setInviteModalOpen(false);
      showToast(`Invitation sent to ${trimmedEmail}. A 7-day sign-in link was emailed.`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to send invitation";
      setEmailError(msg);
      showToast(msg, "error");
    } finally {
      setIsInviting(false);
    }
  };

  const handleResendInvite = async (invitationId, inviteEmail) => {
    setResendingId(invitationId);
    try {
      await resendInvitation(invitationId);
      showToast(`Refreshed invitation sent to ${inviteEmail}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to resend invitation";
      showToast(msg, "error");
    } finally {
      setResendingId(null);
    }
  };

  const handleRevokeInvite = async (invitationId, inviteEmail) => {
    setRevokingId(invitationId);
    try {
      await revokeInvitation(invitationId);
      showToast(`Invitation for ${inviteEmail} revoked. Seat released.`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to revoke invitation";
      showToast(msg, "error");
    } finally {
      setRevokingId(null);
    }
  };

  const handleToggleStatus = async (member) => {
    setTogglingId(member.id);
    const nextStatus = member.status === "active" ? "paused" : "active";
    try {
      await changeTeamMemberStatus(member.id, nextStatus);
      showToast(
        nextStatus === "active"
          ? `Resumed routing for ${member.name}. Enrolled in round-robin.`
          : `Paused routing for ${member.name}. Existing leads preserved.`
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status";
      showToast(msg, "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleVisibilityClick = () => {
    const nextState = !salespersonCanViewAllLeads;
    setPendingVisibilityState(nextState);
    setVisibilityModalOpen(true);
  };

  const handleConfirmVisibilityChange = async () => {
    try {
      await setSalespersonCanViewAllLeads(pendingVisibilityState);
      setVisibilityModalOpen(false);
      showToast(
        pendingVisibilityState
          ? "Global lead visibility enabled. Sales reps can view all organization leads."
          : "Global lead visibility restricted. Sales reps can only view their own assigned leads."
      );
    } catch (err) {
      showToast("Failed to update lead visibility", "error");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Team Management"
        description="Manage sales representatives, invitations, seat quotas, and automated WhatsApp lead distribution."
        badge={`${salesReps.length} Sales Reps`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => fetchTeamMembers()}
            >
              Sync
            </Button>
            <Button
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              disabled={isSeatLimitReached}
              onClick={() => {
                setEmailError("");
                setInviteModalOpen(true);
              }}
              title={isSeatLimitReached ? "Seat limit reached" : "Invite a sales rep"}
            >
              Add Team Member
            </Button>
          </div>
        }
      />

      {/* Seat Capacity & Plan Usage Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                Seat Usage &amp; Capacity
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                {seatUsage?.plan || "Trial"} Plan
              </span>
              {seatUsage?.repAddons > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  +{seatUsage.repAddons} Add-on Seats
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Workspace owners are not counted against sales representative seat limits. Active/paused reps and pending invites hold seats.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {usedSeats} <span className="text-xs font-normal text-slate-500">/ {totalSeats} Seats</span>
              </div>
              <div className="text-xs text-slate-500">
                {availableSeats > 0 ? (
                  <span className="text-emerald-600 font-medium">{availableSeats} available</span>
                ) : (
                  <span className="text-rose-600 font-medium">No seats remaining</span>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-32 hidden sm:block">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isSeatLimitReached
                      ? "bg-rose-500"
                      : usedSeats / totalSeats > 0.8
                      ? "bg-amber-500"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${Math.min(100, (usedSeats / Math.max(1, totalSeats)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0</span>
                <span>{totalSeats} max</span>
              </div>
            </div>
          </div>
        </div>

        {isSeatLimitReached && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Seat limit reached:</strong> You are currently using all {totalSeats} representative seats. To invite another rep, revoke pending invitations or upgrade your subscription.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Round Robin Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 shrink-0">
                <Shuffle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Round-Robin Lead Assignment
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      roundRobinEnabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {roundRobinEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Automatically distributes new qualified inbound leads sequentially (1:1 rotation) among all active representatives.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={roundRobinEnabled}
              aria-label="Toggle round-robin lead assignment"
              onClick={() => {
                const nextState = !roundRobinEnabled;
                setRoundRobinEnabled(nextState);
                showToast(
                  nextState
                    ? "Round-robin routing enabled. Inbound leads will rotate among active reps."
                    : "Round-robin routing paused. Incoming leads will remain unassigned."
                );
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                roundRobinEnabled ? "bg-emerald-600" : "bg-slate-200"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  roundRobinEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Global Lead Visibility Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Global Lead Visibility
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      salespersonCanViewAllLeads
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {salespersonCanViewAllLeads ? "Company-Wide" : "Assigned Only"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Controls whether sales representatives can view all company leads or only their personal assigned queue.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={salespersonCanViewAllLeads}
              aria-label="Toggle global lead visibility"
              onClick={handleToggleVisibilityClick}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                salespersonCanViewAllLeads ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  salespersonCanViewAllLeads ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Pending Invitations Section */}
      {pendingInvites.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-amber-50/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                Pending Invitations ({pendingInvites.length})
              </h3>
              <span className="text-[11px] text-amber-700 font-medium bg-amber-100/70 px-2 py-0.5 rounded-full">
                Holds {pendingInvites.length} Seat{pendingInvites.length > 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Links expire after 7 days
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500">
                  <th className="py-2.5 px-5 font-medium">Invitee</th>
                  <th className="py-2.5 px-4 font-medium">Role</th>
                  <th className="py-2.5 px-4 font-medium">Sent Date</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pendingInvites.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={inv.name} size="sm" />
                        <div>
                          <div className="font-semibold text-slate-900">{inv.name}</div>
                          <div className="text-xs text-slate-500">{inv.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                        Sales Representative
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting Acceptance
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          icon={<RotateCcw className={`w-3 h-3 ${resendingId === inv.id ? "animate-spin" : ""}`} />}
                          disabled={resendingId === inv.id}
                          onClick={() => handleResendInvite(inv.id, inv.email)}
                        >
                          {resendingId === inv.id ? "Sending..." : "Resend"}
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          icon={<XCircle className="w-3 h-3 text-rose-500" />}
                          disabled={revokingId === inv.id}
                          onClick={() => handleRevokeInvite(inv.id, inv.email)}
                          className="hover:border-rose-200 hover:text-rose-600"
                        >
                          {revokingId === inv.id ? "Revoking..." : "Revoke"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Roster Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-semibold text-sm text-slate-900">
                Team Roster ({teamMembers.length})
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {activeReps.length} in Active Routing
                </span>
                {pausedReps.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {pausedReps.length} Paused
                  </span>
                )}
                {disabledReps.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    {disabledReps.length} Disabled
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Performance metrics and lead assignment state across all organization members.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {teamMembers.slice(0, 4).map((m) => (
                <Avatar
                  key={m.id}
                  name={m.name}
                  size="sm"
                  className="border-2 border-white ring-1 ring-slate-200"
                />
              ))}
              {teamMembers.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                  +{teamMembers.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>

        {teamMembers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-slate-50/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              No Sales Representatives Yet
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Add your first sales representative to distribute inbound WhatsApp conversations. When round-robin is turned on, new leads will automatically rotate sequentially among active reps.
            </p>
            <div className="mt-5">
              <Button
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                disabled={isSeatLimitReached}
                onClick={() => {
                  setEmailError("");
                  setInviteModalOpen(true);
                }}
              >
                Invite First Representative
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-600">
                  <th className="py-3 px-5 font-medium">Team Member</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 text-center font-medium">
                    <div className="flex flex-col items-center">
                      <span>Leads Handled</span>
                      <span className="text-xs font-normal text-slate-400">Current</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center font-medium">
                    <div className="flex flex-col items-center">
                      <span>Conversion Rate</span>
                      <span className="text-xs font-normal text-slate-400">% Converted</span>
                    </div>
                  </th>
                  <th className="py-3 px-5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {teamMembers.map((member) => {
                  const isOwnerMember = member.role === "owner";
                  const memberAssignedLeads = leads.filter((l) => {
                    const repId = l.assignedToId?._id || l.assignedToId;
                    return repId === member.id;
                  });
                  const wonCount = memberAssignedLeads.filter(
                    (l) => l.status === "Converted"
                  ).length;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} size="md" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                              <span className="truncate">{member.name}</span>
                              {isOwnerMember && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  <Crown className="w-3 h-3 text-amber-600" />
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                              <span>{member.email}</span>
                              {member.phone && (
                                <Fragment>
                                  <span className="text-slate-300">•</span>
                                  <span>{member.phone}</span>
                                </Fragment>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                          {isOwnerMember ? "Workspace Owner" : "Sales Representative"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isOwnerMember ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active (No Seat)
                          </span>
                        ) : member.status === "active" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : member.status === "paused" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Paused
                          </span>
                        ) : member.status === "disabled" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {member.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="text-sm font-semibold text-slate-900 tabular-nums">
                          {memberAssignedLeads.length}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="text-sm font-semibold text-slate-900 tabular-nums">
                          {memberAssignedLeads.length > 0
                            ? Math.round((wonCount / memberAssignedLeads.length) * 100)
                            : 0}
                          %
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        {!isOwnerMember ? (
                          <div className="flex items-center justify-end gap-2">
                            {member.status === "active" ? (
                              <button
                                type="button"
                                disabled={togglingId === member.id}
                                onClick={() => handleToggleStatus(member)}
                                aria-label={`Pause lead routing for ${member.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                              >
                                <Pause className="w-3 h-3 text-amber-500" />
                                <span>{togglingId === member.id ? "Pausing..." : "Pause"}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={togglingId === member.id}
                                onClick={() => handleToggleStatus(member)}
                                aria-label={`Resume lead routing for ${member.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                <span>{togglingId === member.id ? "Resuming..." : "Resume"}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => initiateDeleteMember(member)}
                              aria-label={`Remove ${member.name} from sales team`}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors cursor-pointer"
                              title={`Remove ${member.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="pr-2">
                            <span className="text-xs text-slate-400 font-medium">
                              Organization Owner
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Seat Accounting:</strong> Pausing a representative keeps their seat reserved. Removing or revoking releases the seat immediately.
            </span>
          </div>
          <span className="text-slate-400 text-xs">
            Leads can be automatically reassigned to other active reps upon removal.
          </span>
        </div>
      </div>

      {/* Visibility Modal */}
      <Modal
        isOpen={visibilityModalOpen}
        onClose={() => setVisibilityModalOpen(false)}
        title={
          pendingVisibilityState
            ? "Enable Global Lead Visibility?"
            : "Restrict to Assigned Leads Only?"
        }
        maxWidth="md"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" onClick={() => setVisibilityModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmVisibilityChange}>
              {pendingVisibilityState
                ? "Enable Global Visibility"
                : "Restrict to Assigned Only"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              pendingVisibilityState
                ? "bg-blue-50 border-blue-200 text-blue-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-xs">
                {pendingVisibilityState
                  ? "Sales representatives will see all company conversations"
                  : "Sales representatives will only see their own assigned queue"}
              </p>
              <p className="text-xs leading-relaxed opacity-90">
                {pendingVisibilityState
                  ? "All sales representatives will have permission to read, search, and monitor customer chats and qualification data across the entire organization."
                  : "Sales representatives will no longer be able to see other representatives' leads or unassigned company conversations in their inbox or lead tables."}
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <p className="font-medium text-slate-800">What does not change:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                Workspace owners always retain complete visibility across all leads regardless of this setting.
              </li>
              <li>
                Representatives still only send replies to chats they are actively assigned to.
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Add Sales Representative"
        description="Invite a sales team member to manage and respond to inbound WhatsApp leads."
        maxWidth="md"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)} disabled={isInviting}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={isInviting || isSeatLimitReached}>
              {isInviting ? "Sending Invitation..." : "Send Invitation & Reserve Seat"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan Hayes"
            required
            disabled={isInviting}
          />
          <Input
            label="Work Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            placeholder="jordan@company.com"
            error={emailError}
            helper="A one-time invitation link will be emailed to this address."
            required
            disabled={isInviting}
          />
          <Input
            label="WhatsApp Mobile Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +1 (415) 555-0192"
            helper="Direct phone number for internal team communication."
            disabled={isInviting}
          />

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Invitation &amp; Seat Rules</span>
            </div>
            <ul className="text-xs space-y-1 list-disc list-inside text-blue-800/90 leading-relaxed">
              <li>Sending this invitation reserves <strong>1 seat</strong> on your plan.</li>
              <li>The recipient will receive an email to sign in or create their password.</li>
              <li>If they don't accept within 7 days or you revoke it, the seat is released automatically.</li>
            </ul>
          </div>
        </form>
      </Modal>

      {/* Delete / Reassign Modal */}
      {memberToDelete && (
        <Modal
          isOpen={Boolean(memberToDelete)}
          onClose={() => !isDeleting && setMemberToDelete(null)}
          title={
            leadsAssignedToMember.length > 0
              ? "Remove Representative & Reassign Leads"
              : "Remove Team Member"
          }
          maxWidth="md"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={() => setMemberToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting
                  ? "Processing..."
                  : leadsAssignedToMember.length > 0
                  ? reassignOption === "reassign"
                    ? "Reassign Leads & Remove"
                    : "Unassign Leads & Remove"
                  : "Remove Member"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {leadsAssignedToMember.length > 0 ? (
              <Fragment>
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs">
                      {memberToDelete.name} has {leadsAssignedToMember.length} assigned lead
                      {leadsAssignedToMember.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Choose whether to transfer these customer conversations to another active sales rep or return them to the unassigned pool. (The workspace owner cannot be assigned leads).
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-700 flex justify-between items-center">
                    <span>Assigned Leads ({leadsAssignedToMember.length})</span>
                    <span className="text-xs text-slate-400">Current status</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 text-xs bg-white">
                    {leadsAssignedToMember.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.phone}</p>
                        </div>
                        <span className="text-xs capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {lead.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                    {leadsAssignedToMember.length > 5 && (
                      <div className="px-3 py-1.5 bg-slate-50 text-center text-xs text-slate-500 font-medium">
                        +{leadsAssignedToMember.length - 5} additional leads
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <label className="text-xs font-semibold text-slate-900 block">
                    Choose lead destination:
                  </label>
                  <div
                    onClick={() => {
                      if (eligibleReassignTargets.length > 0) {
                        setReassignOption("reassign");
                      }
                    }}
                    className={`p-3 rounded-lg border transition-colors ${
                      eligibleReassignTargets.length === 0
                        ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
                        : reassignOption === "reassign"
                        ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 cursor-pointer"
                        : "border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="option-reassign"
                        name="reassign-choice"
                        disabled={eligibleReassignTargets.length === 0}
                        checked={reassignOption === "reassign" && eligibleReassignTargets.length > 0}
                        onChange={() => setReassignOption("reassign")}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="option-reassign"
                        className="text-xs font-medium text-slate-900 cursor-pointer"
                      >
                        Reassign all leads to another active representative (Recommended)
                      </label>
                    </div>
                    {reassignOption === "reassign" && eligibleReassignTargets.length > 0 && (
                      <div className="mt-2.5 pl-6">
                        <Select
                          value={reassignTargetId}
                          onChange={(e) => setReassignTargetId(e.target.value)}
                          options={eligibleReassignTargets.map((m) => ({
                            value: m.id,
                            label: `${m.name} (Active Sales Rep)`,
                          }))}
                        />
                      </div>
                    )}
                    {eligibleReassignTargets.length === 0 && (
                      <p className="text-xs text-slate-500 pl-6 mt-1">
                        No other active sales representatives are available on your team.
                      </p>
                    )}
                  </div>

                  <div
                    onClick={() => setReassignOption("unassign")}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      reassignOption === "unassign"
                        ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="option-unassign"
                        name="reassign-choice"
                        checked={reassignOption === "unassign"}
                        onChange={() => setReassignOption("unassign")}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="option-unassign"
                        className="text-xs font-medium text-slate-900 cursor-pointer"
                      >
                        Return leads to Unassigned Lead Pool
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 pl-6 mt-1">
                      Leads will be unassigned and available in the inbox for round-robin rotation or manual claim.
                    </p>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="text-xs text-slate-600 space-y-3">
                <p>
                  Are you sure you want to remove <strong>{memberToDelete.name}</strong> from your organization?
                </p>
                <p className="text-xs text-slate-500">
                  This representative currently has 0 assigned leads. Their seat will be freed immediately and their workspace access revoked.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

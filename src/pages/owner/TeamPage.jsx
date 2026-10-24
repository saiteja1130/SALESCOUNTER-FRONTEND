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
} from "lucide-react";

export const TeamPage = () => {
  const { role, salespersonCanViewAllLeads, setSalespersonCanViewAllLeads } = useAuth();
  const {
    teamMembers,
    roundRobinEnabled,
    setRoundRobinEnabled,
    inviteTeamMember,
    toggleTeamMemberStatus,
    removeTeamMember,
    leads,
    assignLead,
    updateLead,
  } = useApp();
  const { showToast } = useToast();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [pendingVisibilityState, setPendingVisibilityState] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [reassignOption, setReassignOption] = useState("reassign");
  const [reassignTargetId, setReassignTargetId] = useState("");

  // Hooks must be declared unconditionally at top level
  const leadsAssignedToMember = useMemo(() => {
    if (!memberToDelete) return [];
    return leads.filter((l) => l.assignedToId === memberToDelete.id);
  }, [leads, memberToDelete]);

  const otherTeamMembers = useMemo(() => {
    if (!memberToDelete) return [];
    return teamMembers.filter((m) => m.id !== memberToDelete.id);
  }, [teamMembers, memberToDelete]);

  if (role !== "owner") {
    return <Unauthorized featureName="Team & Sales Routing" />;
  }

  const totalCount = teamMembers.length;
  const salesReps = teamMembers.filter((m) => m.role === "salesperson");
  const activeReps = salesReps.filter((m) => m.status === "active");
  const pausedReps = salesReps.filter((m) => m.status === "paused");

  const initiateDeleteMember = (member) => {
    setMemberToDelete(member);
    setReassignOption("reassign");
    const eligibleTargets = teamMembers.filter((m) => m.id !== member.id);
    const activeTarget = eligibleTargets.find((m) => m.status === "active");
    setReassignTargetId(activeTarget ? activeTarget.id : eligibleTargets[0]?.id || "");
  };

  const handleConfirmDelete = () => {
    if (!memberToDelete) return;
    if (leadsAssignedToMember.length > 0) {
      if (reassignOption === "reassign" && reassignTargetId) {
        const targetMember = teamMembers.find((m) => m.id === reassignTargetId);
        leadsAssignedToMember.forEach((lead) => {
          assignLead(lead.id, reassignTargetId);
        });
        showToast(
          `Reassigned ${leadsAssignedToMember.length} lead${leadsAssignedToMember.length > 1 ? "s" : ""} to ${targetMember?.name || "team member"} and removed ${memberToDelete.name}`
        );
      } else {
        leadsAssignedToMember.forEach((lead) => {
          updateLead(lead.id, {
            assignedToId: undefined,
            assignedToName: undefined,
          });
        });
        showToast(
          `Returned ${leadsAssignedToMember.length} lead${leadsAssignedToMember.length > 1 ? "s" : ""} to unassigned pool and removed ${memberToDelete.name}`
        );
      }
    } else {
      showToast(`Removed ${memberToDelete.name} from sales team`);
    }
    removeTeamMember(memberToDelete.id);
    setMemberToDelete(null);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    setEmailError("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail) {
      showToast("Name and email are required", "error");
      return;
    }

    const isDuplicate = teamMembers.some(
      (m) => m.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (isDuplicate) {
      setEmailError("A team member with this email address is already on the team.");
      showToast("This email is already registered on your team", "error");
      return;
    }

    inviteTeamMember(trimmedName, trimmedEmail, trimmedPhone);
    setName("");
    setEmail("");
    setPhone("");
    setEmailError("");
    setInviteModalOpen(false);
    showToast(`Invitation sent to ${trimmedName}. Enrolled in round-robin routing.`);
  };

  const handleToggleVisibilityClick = () => {
    const nextState = !salespersonCanViewAllLeads;
    setPendingVisibilityState(nextState);
    setVisibilityModalOpen(true);
  };

  const handleConfirmVisibilityChange = () => {
    setSalespersonCanViewAllLeads(pendingVisibilityState);
    setVisibilityModalOpen(false);
    showToast(
      pendingVisibilityState
        ? "Global lead visibility enabled. Sales reps can view all organization leads."
        : "Global lead visibility restricted. Sales reps can only view their own assigned leads."
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Team Management"
        description="Manage sales representatives, automated WhatsApp lead distribution, and workspace access controls."
        badge={`${totalCount} Members`}
        actions={
          <Button
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEmailError("");
              setInviteModalOpen(true);
            }}
          >
            Add Team Member
          </Button>
        }
      />

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

      {/* Team Roster Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-semibold text-sm text-slate-900">
                Team Roster ({totalCount})
              </h3>
              <div className="flex items-center gap-1.5">
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

        {salesReps.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-slate-50/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              No Sales Representatives Yet
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Add your first sales representative to distribute inbound WhatsApp conversations. When round-robin is turned on, new leads will automatically be assigned sequentially to active reps.
            </p>
            <div className="mt-5">
              <Button
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
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
                  <th className="py-3 px-4 text-center font-medium">
                    <div className="flex flex-col items-center">
                      <span>Leads Handled</span>
                      <span className="text-xs font-normal text-slate-400">All-time</span>
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
                  const memberAssignedLeads = leads.filter(
                    (l) => l.assignedToId === member.id
                  );
                  // Conversly statuses: "New", "Interested", "In-followup", "Converted", "Lost"
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
                          {isOwnerMember ? "Sales Manager" : "Sales Representative"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="text-sm font-semibold text-slate-900 tabular-nums">
                          {memberAssignedLeads.length || member.assignedLeadsCount || 0}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="text-sm font-semibold text-slate-900 tabular-nums">
                          {memberAssignedLeads.length > 0
                            ? Math.round((wonCount / memberAssignedLeads.length) * 100)
                            : member.conversionRate || 0}
                          %
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        {!isOwnerMember ? (
                          <div className="flex items-center justify-end gap-2">
                            {member.status === "active" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  toggleTeamMemberStatus(member.id);
                                  showToast(
                                    `Paused routing for ${member.name}. Existing leads preserved.`
                                  );
                                }}
                                aria-label={`Pause lead routing for ${member.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                              >
                                <Pause className="w-3 h-3 text-amber-500" />
                                <span>Pause</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  toggleTeamMemberStatus(member.id);
                                  showToast(
                                    `Resumed lead routing for ${member.name}. Enrolled in round-robin.`
                                  );
                                }}
                                aria-label={`Resume lead routing for ${member.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                <span>Resume</span>
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
                              Workspace Owner
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
              <strong>Definitions:</strong> Leads Handled counts all leads assigned to the rep since joining. Conversion represents closed deals out of total handled leads.
            </span>
          </div>
          <span className="text-slate-400 text-xs">
            Data updates in real-time as leads advance through sales stages.
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
                Sales managers and workspace owners always retain complete visibility across all leads.
              </li>
              <li>
                Representatives still only take over or respond to chats they are assigned to.
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
        description="Invite a new sales team member to manage and respond to WhatsApp leads."
        maxWidth="md"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send Invitation &amp; Enroll</Button>
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
            helper="An invitation link with immediate workspace access will be sent."
            required
          />
          <Input
            label="WhatsApp Mobile Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +1 (415) 555-0192"
            helper="Optional direct phone number for internal notifications."
          />
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Invitation &amp; Routing Behavior</span>
            </div>
            <ul className="text-xs space-y-1 list-disc list-inside text-emerald-800/90 leading-relaxed">
              <li>A user account will be generated immediately with sales representative privileges.</li>
              <li>If <strong>Round-Robin Routing</strong> is active, this representative is automatically enrolled.</li>
              <li>You can pause their routing status at any time from this table without deleting the account.</li>
            </ul>
          </div>
        </form>
      </Modal>

      {/* Delete / Reassign Modal */}
      {memberToDelete && (
        <Modal
          isOpen={Boolean(memberToDelete)}
          onClose={() => setMemberToDelete(null)}
          title={
            leadsAssignedToMember.length > 0
              ? "Remove Representative & Reassign Leads"
              : "Remove Team Member"
          }
          maxWidth="md"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={() => setMemberToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                {leadsAssignedToMember.length > 0
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
                      To prevent customer conversations from falling through the cracks, choose what happens to these leads before removing this representative.
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
                    onClick={() => setReassignOption("reassign")}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      reassignOption === "reassign"
                        ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="option-reassign"
                        name="reassign-choice"
                        checked={reassignOption === "reassign"}
                        onChange={() => setReassignOption("reassign")}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="option-reassign"
                        className="text-xs font-medium text-slate-900 cursor-pointer"
                      >
                        Reassign all leads to another team member (Recommended)
                      </label>
                    </div>
                    {reassignOption === "reassign" && (
                      <div className="mt-2.5 pl-6">
                        {otherTeamMembers.length > 0 ? (
                          <Select
                            value={reassignTargetId}
                            onChange={(e) => setReassignTargetId(e.target.value)}
                            options={otherTeamMembers.map((m) => ({
                              value: m.id,
                              label: `${m.name} (${m.role === "owner" ? "Owner" : m.status === "active" ? "Active" : "Paused"})`,
                            }))}
                          />
                        ) : (
                          <p className="text-xs text-slate-500">
                            No other team members available. Leads will be returned to unassigned pool.
                          </p>
                        )}
                      </div>
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
                      Leads will be unassigned and available in the inbox for manual claim or re-routing.
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
                  This user currently has 0 assigned leads. They will immediately lose access to your Conversly workspace.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

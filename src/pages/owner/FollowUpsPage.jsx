import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { RuleBuilderModal } from "../../components/followups/RuleBuilderModal";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Calendar,
  Moon,
  Clock,
  Sparkles,
  Edit3,
  Copy,
  Sliders,
  Users,
  MessageSquare,
} from "lucide-react";
const FollowUpsPage = () => {
  const {
    followUpRules,
    toggleFollowUpRule,
    deleteFollowUpRule,
    scheduledFollowUps,
    leads,
  } = useApp();
  const { showToast } = useToast();
  const [modalMode, setModalMode] = useState("create");
  const [selectedRule, setSelectedRule] = useState(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [quietHoursModalOpen, setQuietHoursModalOpen] = useState(false);
  const [globalQuietStart, setGlobalQuietStart] = useState("21:00");
  const [globalQuietEnd, setGlobalQuietEnd] = useState("08:00");
  const [morningReleaseTime, setMorningReleaseTime] = useState("08:15");
  const userTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  const handleOpenCreate = () => {
    setSelectedRule(null);
    setModalMode("create");
    setIsRuleModalOpen(true);
  };
  const handleOpenEdit = (rule) => {
    setSelectedRule(rule);
    setModalMode("edit");
    setIsRuleModalOpen(true);
  };
  const handleOpenDuplicate = (rule) => {
    setSelectedRule(rule);
    setModalMode("duplicate");
    setIsRuleModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (!ruleToDelete) return;
    deleteFollowUpRule(ruleToDelete.id);
    showToast(`Removed follow-up rule "${ruleToDelete.title}"`);
    setRuleToDelete(null);
  };
  const handleSaveQuietHours = (e) => {
    e.preventDefault();
    setQuietHoursModalOpen(false);
    showToast(
      `Quiet hours schedule updated (${globalQuietStart} \u2013 ${globalQuietEnd}, release at ${morningReleaseTime})`,
    );
  };
  const getTimelineSentence = (rule) => {
    const stageText =
      rule.targetStatus === "Any" ? "any active" : rule.targetStatus;
    const actionText =
      rule.actionType === "ai_send_whatsapp"
        ? "send this WhatsApp follow-up message"
        : "notify the assigned salesperson to follow up";
    if (rule.triggerCondition === "inactive_hours") {
      return `If a lead in ${stageText} stage hasn't replied, ${actionText} ${rule.delayHours} hours later.`;
    } else if (rule.triggerCondition === "status_changed") {
      return `When a lead transitions to ${stageText} stage, ${actionText} after ${rule.delayHours} hours.`;
    } else {
      return `If a lead leaves AI unanswered, ${actionText} ${rule.delayHours} hours later.`;
    }
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
                  Follow-up Automations
                </h1>
              }
              {
                <p className={"text-xs sm:text-sm text-slate-500 mt-1"}>
                  Automated timing triggers and cadences that re-engage leads
                  before they go cold.
                </p>
              }
            </div>
          }
          {
            <Button
              size={"sm"}
              icon={<Plus className={"w-3.5 h-3.5"} />}
              onClick={handleOpenCreate}
              className={"shadow-xs"}
            >
              New Follow-up Rule
            </Button>
          }
        </div>
      }
      {
        <div
          className={
            "bg-slate-900 text-white p-4 sm:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs border border-slate-800"
          }
        >
          {
            <div className={"flex items-start gap-3.5"}>
              {
                <div
                  className={
                    "p-2 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20 shrink-0 mt-0.5"
                  }
                >
                  {<Moon className={"w-5 h-5"} />}
                </div>
              }
              {
                <div className={"space-y-1"}>
                  {
                    <div className={"flex items-center gap-2 flex-wrap"}>
                      {
                        <span
                          className={"font-semibold text-slate-100 text-sm"}
                        >
                          Quiet Hours Protection Active
                        </span>
                      }
                      {
                        <span
                          className={
                            "text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-800/80"
                          }
                        >
                          {userTimezone}
                        </span>
                      }
                    </div>
                  }
                  {
                    <p className={"text-slate-300 leading-relaxed text-xs"}>
                      Automated messages between{" "}
                      {<strong>{globalQuietStart}</strong>} and{" "}
                      {<strong>{globalQuietEnd}</strong>} ({userTimezone}) are
                      paused to respect customer sleep schedules. Queued
                      messages automatically resume and batch-release at{" "}
                      {<strong>{morningReleaseTime} AM local time</strong>}.
                    </p>
                  }
                </div>
              }
            </div>
          }
          {
            <div
              className={
                "flex items-center gap-2 self-start md:self-center shrink-0"
              }
            >
              {
                <Button
                  size={"xs"}
                  variant={"outline"}
                  className={
                    "text-slate-200 border-slate-700 hover:bg-slate-800 bg-slate-800/60"
                  }
                  icon={<Sliders className={"w-3 h-3 text-slate-300"} />}
                  onClick={() => setQuietHoursModalOpen(true)}
                >
                  Configure Schedule
                </Button>
              }
            </div>
          }
        </div>
      }
      {
        <div className={"flex items-center justify-between pt-1"}>
          {
            <div className={"flex items-center gap-2"}>
              {<Calendar className={"w-4 h-4 text-emerald-600"} />}
              {
                <h2 className={"text-sm font-semibold text-slate-900"}>
                  Automation Rules ({followUpRules.length})
                </h2>
              }
            </div>
          }
          {
            <span className={"text-xs text-slate-400"}>
              Rules run continuously in the background
            </span>
          }
        </div>
      }
      {followUpRules.length === 0 ? (
        <div
          className={
            "flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-slate-300"
          }
        >
          {
            <div
              className={
                "w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4"
              }
            >
              {<Sparkles className={"w-6 h-6"} />}
            </div>
          }
          {
            <h3 className={"text-sm font-semibold text-slate-900"}>
              No Automation Rules Configured
            </h3>
          }
          {
            <p
              className={"mt-1 text-xs text-slate-500 max-w-md leading-relaxed"}
            >
              Automated cadences ensure potential customers never slip through
              the cracks. Set timing triggers to follow up when leads go quiet
              or when their sales stage updates.
            </p>
          }
          {
            <div className={"mt-5"}>
              {
                <Button
                  size={"sm"}
                  icon={<Plus className={"w-3.5 h-3.5"} />}
                  onClick={handleOpenCreate}
                >
                  Create Your First Follow-up Rule
                </Button>
              }
            </div>
          }
        </div>
      ) : (
        /* Automation Rules Grid */
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
          {followUpRules.map((rule) => {
            const waitingCount = scheduledFollowUps.filter(
              (s) =>
                (s.ruleTitle === rule.title || s.ruleId === rule.id) &&
                s.status === "pending",
            ).length;
            const eligibleCount = leads.filter(
              (l) =>
                rule.targetStatus === "Any" || l.status === rule.targetStatus,
            ).length;
            return (
              <div
                className={`p-5 rounded-xl border bg-white shadow-xs flex flex-col justify-between transition-all ${rule.isActive ? "border-slate-200/90 hover:border-slate-300" : "border-slate-200 opacity-65 bg-slate-50/60"}`}
              >
                {
                  <div>
                    {
                      <div
                        className={
                          "flex items-start justify-between gap-2 mb-2.5"
                        }
                      >
                        {
                          <span
                            className={
                              "font-semibold text-xs text-slate-900 line-clamp-1"
                            }
                            title={rule.title}
                          >
                            {rule.title}
                          </span>
                        }
                        {
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${rule.isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                          >
                            {rule.isActive ? "Active" : "Paused"}
                          </span>
                        }
                      </div>
                    }
                    {
                      <div
                        className={
                          "p-2.5 mb-3 rounded-lg bg-emerald-50/60 border border-emerald-100/90 text-[11px] text-emerald-950 flex items-start gap-2"
                        }
                      >
                        {
                          <Clock
                            className={
                              "w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"
                            }
                          />
                        }
                        {
                          <p className={"leading-relaxed font-medium"}>
                            {getTimelineSentence(rule)}
                          </p>
                        }
                      </div>
                    }
                    {
                      <div
                        className={
                          "space-y-1.5 text-[11px] text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-100 mb-3"
                        }
                      >
                        {
                          <div className={"flex items-center gap-2"}>
                            {
                              <span
                                className={
                                  "w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0"
                                }
                              >
                                1
                              </span>
                            }
                            {
                              <span className={"truncate"}>
                                Trigger:{" "}
                                {<strong>{rule.delayHours}h delay</strong>}{" "}
                                after {rule.triggerCondition.replace("_", " ")}
                              </span>
                            }
                          </div>
                        }
                        {
                          <div className={"flex items-center gap-2"}>
                            {
                              <span
                                className={
                                  "w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0"
                                }
                              >
                                2
                              </span>
                            }
                            {
                              <span>
                                Stage Filter:{" "}
                                {<strong>{rule.targetStatus}</strong>}
                              </span>
                            }
                          </div>
                        }
                        {
                          <div className={"flex items-center gap-2"}>
                            {
                              <span
                                className={
                                  "w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0"
                                }
                              >
                                3
                              </span>
                            }
                            {
                              <span>
                                Action:{" "}
                                {
                                  <strong>
                                    {rule.actionType === "ai_send_whatsapp"
                                      ? "AI WhatsApp Outreach"
                                      : "Notify Salesperson"}
                                  </strong>
                                }
                              </span>
                            }
                          </div>
                        }
                      </div>
                    }
                    {
                      <div
                        className={
                          "p-2.5 bg-white rounded-lg text-xs text-slate-700 border border-slate-200/80 mb-3 italic leading-relaxed"
                        }
                      >
                        "{rule.messageTemplate}"
                      </div>
                    }
                    {
                      <div
                        className={
                          "flex items-center justify-between text-[11px] text-slate-500 py-1 border-t border-slate-100"
                        }
                      >
                        {
                          <div
                            className={"flex items-center gap-1.5"}
                            title={
                              "Leads currently queued under this automation"
                            }
                          >
                            {
                              <MessageSquare
                                className={"w-3.5 h-3.5 text-emerald-600"}
                              />
                            }
                            {
                              <span>
                                {<strong>{waitingCount}</strong>} queued
                              </span>
                            }
                          </div>
                        }
                        {
                          <div
                            className={"flex items-center gap-1.5"}
                            title={
                              "Active leads currently matching target stage"
                            }
                          >
                            {<Users className={"w-3.5 h-3.5 text-slate-400"} />}
                            {
                              <span>
                                {<strong>{eligibleCount}</strong>} eligible
                                leads
                              </span>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
                {
                  <div
                    className={
                      "pt-3 border-t border-slate-100 flex items-center justify-between gap-1"
                    }
                  >
                    {
                      <div className={"flex items-center gap-1.5"}>
                        {
                          <button
                            type={"button"}
                            onClick={() => {
                              toggleFollowUpRule(rule.id);
                              showToast(
                                rule.isActive
                                  ? `Paused rule "${rule.title}"`
                                  : `Reactivated rule "${rule.title}"`,
                              );
                            }}
                            aria-label={
                              rule.isActive
                                ? `Pause rule ${rule.title}`
                                : `Activate rule ${rule.title}`
                            }
                            className={
                              "inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                            }
                          >
                            {rule.isActive ? (
                              <Fragment>
                                {<Pause className={"w-3 h-3 text-amber-500"} />}
                                {<span>Pause</span>}
                              </Fragment>
                            ) : (
                              <Fragment>
                                {
                                  <Play
                                    className={"w-3 h-3 text-emerald-600"}
                                  />
                                }
                                {<span>Activate</span>}
                              </Fragment>
                            )}
                          </button>
                        }
                        {
                          <button
                            type={"button"}
                            onClick={() => handleOpenEdit(rule)}
                            aria-label={`Edit rule ${rule.title}`}
                            className={
                              "inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                            }
                          >
                            {<Edit3 className={"w-3 h-3 text-slate-500"} />}
                            {<span>Edit</span>}
                          </button>
                        }
                        {
                          <button
                            type={"button"}
                            onClick={() => handleOpenDuplicate(rule)}
                            aria-label={`Duplicate rule ${rule.title}`}
                            className={
                              "inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                            }
                            title={"Duplicate this rule"}
                          >
                            {<Copy className={"w-3 h-3 text-slate-500"} />}
                            {<span>Copy</span>}
                          </button>
                        }
                      </div>
                    }
                    {
                      <button
                        type={"button"}
                        onClick={() => setRuleToDelete(rule)}
                        aria-label={`Delete rule ${rule.title}`}
                        className={
                          "p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        }
                        title={"Delete rule"}
                      >
                        {<Trash2 className={"w-3.5 h-3.5"} />}
                      </button>
                    }
                  </div>
                }
              </div>
            );
          })}
        </div>
      )}
      {
        <RuleBuilderModal
          isOpen={isRuleModalOpen}
          onClose={() => setIsRuleModalOpen(false)}
          initialRule={selectedRule}
          mode={modalMode}
        />
      }
      {
        <ConfirmDialog
          isOpen={Boolean(ruleToDelete)}
          onClose={() => setRuleToDelete(null)}
          onConfirm={handleConfirmDelete}
          title={"Delete Follow-up Rule?"}
          message={`Are you sure you want to remove rule "${ruleToDelete?.title}"? Any future messages queued under this timing cadence will no longer be scheduled.`}
          confirmLabel={"Delete Rule"}
          isDestructive
        />
      }
      {
        <Modal
          isOpen={quietHoursModalOpen}
          onClose={() => setQuietHoursModalOpen(false)}
          title={"Configure Organization Quiet Hours"}
          description={
            "Set the overnight window during which automated WhatsApp messages are held to prevent customer disturbance."
          }
          maxWidth={"md"}
          footer={
            <div className={"flex gap-2 justify-end w-full"}>
              {
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => setQuietHoursModalOpen(false)}
                >
                  Cancel
                </Button>
              }
              {
                <Button size={"sm"} onClick={handleSaveQuietHours}>
                  Save Quiet Hours Schedule
                </Button>
              }
            </div>
          }
        >
          {
            <form onSubmit={handleSaveQuietHours} className={"space-y-4"}>
              {
                <div
                  className={
                    "p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1"
                  }
                >
                  {
                    <div
                      className={
                        "flex items-center gap-2 font-semibold text-slate-800"
                      }
                    >
                      {<Moon className={"w-4 h-4 text-amber-500"} />}
                      {<span>Quiet Window Mechanics</span>}
                    </div>
                  }
                  {
                    <p className={"text-[11px] leading-relaxed"}>
                      When a follow-up rule trigger fires between the quiet
                      start and end hours, the outbound WhatsApp message is
                      placed into the queue. At the morning release window, all
                      pending messages are safely dispatched.
                    </p>
                  }
                </div>
              }
              {
                <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                  {
                    <Input
                      label={"Quiet Hours Start (Evening)"}
                      type={"time"}
                      value={globalQuietStart}
                      onChange={(e) => setGlobalQuietStart(e.target.value)}
                      helper={"Overnight window begins"}
                    />
                  }
                  {
                    <Input
                      label={"Quiet Hours End (Morning)"}
                      type={"time"}
                      value={globalQuietEnd}
                      onChange={(e) => setGlobalQuietEnd(e.target.value)}
                      helper={"Overnight window ends"}
                    />
                  }
                </div>
              }
              {
                <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                  {
                    <Input
                      label={"Morning Release Batch Time"}
                      type={"time"}
                      value={morningReleaseTime}
                      onChange={(e) => setMorningReleaseTime(e.target.value)}
                      helper={
                        "When queued overnight messages fire (Default 8:15 AM)"
                      }
                    />
                  }
                  {
                    <div>
                      {
                        <label
                          className={
                            "block text-xs font-medium text-slate-700 mb-1.5"
                          }
                        >
                          Active Organization Timezone
                        </label>
                      }
                      {
                        <div
                          className={
                            "p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                          }
                        >
                          {userTimezone}
                        </div>
                      }
                    </div>
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
export { FollowUpsPage };

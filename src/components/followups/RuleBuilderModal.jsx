import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Sparkles } from "lucide-react";
const RuleBuilderModal = ({
  isOpen,
  onClose,
  initialRule,
  mode = "create"
}) => {
  const { addFollowUpRule, updateFollowUpRule } = useApp();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [triggerCondition, setTriggerCondition] = useState("inactive_hours");
  const [delayHours, setDelayHours] = useState(24);
  const [targetStatus, setTargetStatus] = useState("Interested");
  const [actionType, setActionType] = useState("ai_send_whatsapp");
  const [messageTemplate, setMessageTemplate] = useState(
    "Hi {{lead_name}}, checking in from Artisan Living! Did you have any further questions regarding {{interested_product}}?"
  );
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState("21:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");
  useEffect(() => {
    if (isOpen) {
      if (initialRule) {
        setTitle(mode === "duplicate" ? `${initialRule.title} (Copy)` : initialRule.title);
        setTriggerCondition(initialRule.triggerCondition);
        setDelayHours(initialRule.delayHours);
        setTargetStatus(initialRule.targetStatus);
        setActionType(initialRule.actionType);
        setMessageTemplate(initialRule.messageTemplate);
        setQuietHoursEnabled(initialRule.quietHoursEnabled ?? true);
        setQuietHoursStart(initialRule.quietHoursStart || "21:00");
        setQuietHoursEnd(initialRule.quietHoursEnd || "08:00");
      } else {
        setTitle("");
        setTriggerCondition("inactive_hours");
        setDelayHours(24);
        setTargetStatus("Interested");
        setActionType("ai_send_whatsapp");
        setMessageTemplate(
          "Hi {{lead_name}}, checking in from Artisan Living! Did you have any further questions regarding {{interested_product}}?"
        );
        setQuietHoursEnabled(true);
        setQuietHoursStart("21:00");
        setQuietHoursEnd("08:00");
      }
    }
  }, [isOpen, initialRule, mode]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !messageTemplate.trim()) {
      showToast("Rule title and message template are required", "error");
      return;
    }
    if (mode === "edit" && initialRule) {
      updateFollowUpRule(initialRule.id, {
        title: title.trim(),
        triggerCondition,
        delayHours: Number(delayHours),
        targetStatus,
        messageTemplate: messageTemplate.trim(),
        actionType,
        quietHoursEnabled,
        quietHoursStart,
        quietHoursEnd
      });
      showToast(`Updated follow-up rule "${title.trim()}"`);
    } else {
      addFollowUpRule({
        title: title.trim(),
        triggerCondition,
        delayHours: Number(delayHours),
        targetStatus,
        messageTemplate: messageTemplate.trim(),
        actionType,
        quietHoursEnabled,
        quietHoursStart,
        quietHoursEnd,
        isActive: true
      });
      showToast(
        mode === "duplicate" ? `Created duplicate rule "${title.trim()}"` : "Automated follow-up rule created"
      );
    }
    onClose();
  };
  const getModalTitle = () => {
    if (mode === "edit") return "Edit Follow-up Automation Rule";
    if (mode === "duplicate") return "Duplicate Follow-up Automation Rule";
    return "Create Follow-up Automation Rule";
  };
  const getButtonLabel = () => {
    if (mode === "edit") return "Save Rule Changes";
    if (mode === "duplicate") return "Create Duplicate Rule";
    return "Save Automation Rule";
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      description="Define timing triggers, lead conditions, quiet hours windows, and automated WhatsApp follow-up copy."
      maxWidth="md"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {getButtonLabel()}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Rule Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Interested Lead 24h Gentle Touchpoint"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Trigger Condition"
            value={triggerCondition}
            onChange={(e) => setTriggerCondition(e.target.value)}
          >
            <option value="inactive_hours">Lead Inactive (No reply from lead)</option>
            <option value="status_changed">When Lead Status Changes</option>
            <option value="ai_no_response">Customer Hasn't Answered AI Question</option>
          </Select>
          <Select
            label="Waiting Delay"
            value={delayHours}
            onChange={(e) => setDelayHours(Number(e.target.value))}
          >
            <option value={2}>2 Hours</option>
            <option value={4}>4 Hours</option>
            <option value={12}>12 Hours</option>
            <option value={24}>24 Hours (1 Day)</option>
            <option value={48}>48 Hours (2 Days)</option>
            <option value={72}>72 Hours (3 Days)</option>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Target Lead Stage"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value)}
          >
            <option value="Any">Any Active Stage</option>
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="In-followup">In-followup</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </Select>
          <Select
            label="Action Type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="ai_send_whatsapp">AI sends WhatsApp message automatically</option>
            <option value="notify_salesperson">Create reminder task for assigned rep</option>
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Follow-up Message Template *
          </label>
          <textarea
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            rows={3}
            className="w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans leading-relaxed"
            required
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Available dynamic tags:{" "}
            <code className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">
              {"{{lead_name}}"}
            </code>
            {", "}
            <code className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">
              {"{{interested_product}}"}
            </code>
            {", "}
            <code className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">
              {"{{delivery_city}}"}
            </code>
          </p>
        </div>
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
          <label className="flex items-start gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={quietHoursEnabled}
              onChange={(e) => setQuietHoursEnabled(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
            />
            <div>
              <span>Enable Quiet Hours Window</span>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                Overnight messages are paused and safely released at 8:15 AM local time to avoid disturbing clients.
              </p>
            </div>
          </label>
          {quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Input
                label="Quiet Start (Evening)"
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="text-xs"
              />
              <Input
                label="Quiet End (Morning)"
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="text-xs"
              />
            </div>
          )}
        </div>
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-emerald-950">
              Automation Plain-Language Timeline:
            </span>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              If a lead in <strong>{targetStatus}</strong> stage has no response for{" "}
              <strong>{delayHours} hours</strong>,{" "}
              {actionType === "ai_send_whatsapp"
                ? "Conversly AI will automatically send this WhatsApp message"
                : "a high-priority task will be dispatched to the assigned representative"}{" "}
              {quietHoursEnabled
                ? `(held overnight between ${quietHoursStart} and ${quietHoursEnd}, releasing at 8:15 AM).`
                : "(sending immediately at any hour)."}
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};
export {
  RuleBuilderModal
};
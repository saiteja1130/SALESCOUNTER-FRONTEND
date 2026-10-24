import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { formatRelativeTime } from "../../utils/formatters";
import {
  StickyNote,
  X,
  Sparkles,
  Check
} from "lucide-react";

export const LeadDetailsSidebar = ({ lead, onClose }) => {
  const { teamMembers, assignLead, changeLeadStatus, addLeadNote } = useApp();
  const { showToast } = useToast();
  const [newNote, setNewNote] = useState("");

  const handleStatusChange = (newStatus) => {
    changeLeadStatus(lead.id, newStatus);
    showToast(`Lead status updated to ${newStatus}`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote.trim());
    setNewNote("");
    showToast("Internal note saved");
  };

  const statusOptions = ["New", "Interested", "In-followup", "Converted", "Lost"];
  const hasBudget = Boolean(lead.collectedData?.budgetRange);
  const hasProduct = Boolean(lead.collectedData?.interestedProduct);
  const hasTimeline = Boolean(lead.collectedData?.preferredTimeline);

  let intentReason = "Qualified via WhatsApp conversation";
  if (hasBudget && hasProduct) {
    intentReason = "Product interest and budget confirmed in chat";
  } else if (hasProduct) {
    intentReason = "Specific product model identified";
  }

  return (
    <div className="w-full h-full bg-slate-50/60 overflow-y-auto flex flex-col shrink-0 text-slate-900 border-l border-slate-200">
      {/* Header */}
      <div className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Lead CRM Intelligence
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Contact info card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={lead.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {lead.name}
              </h2>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                {lead.phone}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-700 font-medium">
                  WhatsApp Verified Contact
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">
                Source
              </span>
              <span className="font-semibold text-slate-700 mt-0.5 block">
                {lead.source}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">
                First Contact
              </span>
              <span className="font-semibold text-slate-700 mt-0.5 block">
                {new Date(lead.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline stage & assignment */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900">Pipeline Stage</span>
            <Badge status={lead.status}>{lead.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {statusOptions.map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  lead.status === st
                    ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-700">
                Assigned Sales Representative
              </label>
              <span className="text-xs text-slate-400">Owns follow-ups</span>
            </div>
            <select
              value={lead.assignedToId}
              onChange={(e) => {
                assignLead(lead.id, e.target.value);
                const rep = teamMembers.find((m) => m.id === e.target.value);
                showToast(`Assigned lead to ${rep?.name || "salesperson"}`);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              {teamMembers.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name} ({rep.role === "owner" ? "Sales Manager" : "Sales Rep"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Extracted Lead Intelligence */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Extracted Lead Intelligence</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Last extracted {formatRelativeTime(lead.lastContactAt)}
              </p>
            </div>
            <div className="text-right">
              <span
                className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block"
                title={intentReason}
              >
                High Intent
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate max-w-[140px]">
                {intentReason}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 text-xs pt-1">
            <div className="pt-2 flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">
                Interested Product / Service
              </span>
              {lead.collectedData?.interestedProduct ? (
                <span className="font-semibold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {lead.collectedData.interestedProduct}
                </span>
              ) : (
                <span className="text-slate-400 italic text-xs bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                  Not mentioned by customer yet
                </span>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Estimated Budget</span>
              {lead.collectedData?.budgetRange ? (
                <span className="font-semibold text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  {lead.collectedData.budgetRange}
                </span>
              ) : (
                <span className="text-slate-400 italic text-xs bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                  Budget not requested or provided yet
                </span>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">
                Delivery Location / City
              </span>
              {lead.collectedData?.deliveryCity ? (
                <span className="font-medium text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {lead.collectedData.deliveryCity}
                </span>
              ) : (
                <span className="text-slate-400 italic text-xs bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                  Awaiting customer delivery address
                </span>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Project Timeline</span>
              {lead.collectedData?.preferredTimeline ? (
                <span className="font-medium text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {lead.collectedData.preferredTimeline}
                </span>
              ) : (
                <span className="text-slate-400 italic text-xs bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                  Timeline unconfirmed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Internal Sales Notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <StickyNote className="w-3.5 h-3.5 text-slate-400" />
              <span>Internal Sales Notes</span>
            </div>
            <span className="text-xs text-slate-400 tabular-nums">
              {lead.notes?.length || 0} notes
            </span>
          </div>

          <form onSubmit={handleAddNote} className="relative">
            <input
              type="text"
              placeholder="Add internal sales note (↵ to save)..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-colors"
              aria-label="Save note"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {!lead.notes || lead.notes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No internal notes recorded yet.</p>
            ) : (
              lead.notes.map((note, idx) => (
                <div
                  key={note.id || idx}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700">{note.authorName}</span>
                    <span className="tabular-nums">
                      {new Date(note.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs">{note.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
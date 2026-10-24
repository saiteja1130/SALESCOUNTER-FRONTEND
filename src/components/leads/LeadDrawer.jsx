import { Drawer } from "../ui/Drawer";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatDateTime } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Bot,
} from "lucide-react";

const LeadDrawer = ({ lead, isOpen, onClose, onEdit }) => {
  const navigate = useNavigate();
  if (!lead) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      subtitle={`WhatsApp Lead · Created ${formatDateTime(lead.createdAt)}`}
      width="md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
            Edit Details
          </Button>
          <Button
            size="sm"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => {
              onClose();
              navigate(`/inbox?leadId=${lead.id}`);
            }}
          >
            Open in Shared Inbox
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status & Assignee Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status & Assignee
            </div>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <Badge status={lead.status} size="md" />
              <span className="text-xs text-slate-700 font-medium">
                Assigned to: <strong className="text-slate-900">{lead.assignedToName}</strong>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">
              {lead.source}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Contact Details
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-mono text-slate-800">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{lead.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Channel: {lead.source}</span>
            </div>
          </div>
        </div>

        {/* AI Extracted Lead Intelligence */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            <Bot className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Extracted Requirements</span>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 space-y-3 text-xs">
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                Interested Product / Service:
              </span>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                {lead.collectedData?.interestedProduct || "Standard Inbound Catalog"}
              </div>
            </div>
            {lead.collectedData?.budgetRange && (
              <div>
                <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  Budget Category:
                </span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {lead.collectedData.budgetRange}
                </div>
              </div>
            )}
            {lead.collectedData?.deliveryCity && (
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Destination: {lead.collectedData.deliveryCity}</span>
              </div>
            )}
            {lead.collectedData?.preferredTimeline && (
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Target Timeline: {lead.collectedData.preferredTimeline}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Lead Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Internal Notes ({lead.notes?.length || 0})
          </h4>
          <div className="space-y-2">
            {!lead.notes || lead.notes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
            ) : (
              lead.notes.map((n, idx) => (
                <div
                  key={n.id || idx}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700">
                      {n.authorName}
                    </span>
                    <span className="tabular-nums">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export { LeadDrawer };
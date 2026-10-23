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
  Bot
} from "lucide-react";
const LeadDrawer = ({
  lead,
  isOpen,
  onClose,
  onEdit
}) => {
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
        <>
          <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
            Edit Details
          </Button>
          <Button
            size="sm"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => {
              onClose();
              navigate("/inbox");
            }}
          >
            Open in Shared Inbox
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Status & Assignee
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge status={lead.status} size="md" />
              <span className="text-xs text-slate-700">
                Assigned to: <strong>{lead.assignedToName}</strong>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-white text-slate-700 border border-slate-200">
              {lead.source}
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
            Contact Details
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-mono">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{lead.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Channel: {lead.source}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Extracted Requirements</span>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] text-emerald-800 font-semibold uppercase">
                Interested Product:
              </span>
              <div className="font-medium text-slate-800">
                {lead.collectedData?.interestedProduct || "Standard Inbound Catalog"}
              </div>
            </div>
            {lead.collectedData?.budgetRange && (
              <div>
                <span className="text-[10px] text-emerald-800 font-semibold uppercase">
                  Budget Range:
                </span>
                <div className="font-medium text-slate-800">
                  {lead.collectedData.budgetRange}
                </div>
              </div>
            )}
            {lead.collectedData?.deliveryCity && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Destination: {lead.collectedData.deliveryCity}</span>
              </div>
            )}
            {lead.collectedData?.preferredTimeline && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Target Timeline: {lead.collectedData.preferredTimeline}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
            Lead Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {lead.tags?.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
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
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700">{n.authorName}</span>
                    <span className="tabular-nums">{formatDateTime(n.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
export {
  LeadDrawer
};
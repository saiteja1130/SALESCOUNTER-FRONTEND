import { useState, useMemo, Fragment } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { formatRelativeTime } from "../../utils/formatters";
import {
  Search,
  Bot,
  UserCheck,
  CheckCheck,
  Clock,
  X,
  PhoneCall,
  Radio,
  SlidersHorizontal,
} from "lucide-react";

export const ConversationList = ({ selectedLeadId, onSelectLead }) => {
  const { filteredLeads, messages, qrConnected, whatsappConnections } = useApp();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [sortBy, setSortBy] = useState("recent_activity");

  // WhatsApp connection channels dynamically mapped from tenant connections
  const channels = useMemo(() => {
    const list = [{ id: "all", name: "All Channels", number: "All Lines" }];
    if (Array.isArray(whatsappConnections) && whatsappConnections.length > 0) {
      whatsappConnections.forEach((conn) => {
        list.push({
          id: conn._id,
          name: conn.displayName || "WhatsApp Line",
          number: conn.linkedPhone ? `+${conn.linkedPhone}` : "Pending QR Link",
        });
      });
    }
    return list;
  }, [whatsappConnections]);

  const getCustomerWaitInfo = (lead) => {
    const thread = messages[lead.id] || [];
    const lastMsg = thread[thread.length - 1];
    const isWaitingForReply =
      (lastMsg && lastMsg.sender === "lead") || lead.needsAttention;
    if (!isWaitingForReply || !lastMsg) {
      return { isWaiting: false, waitTimeMs: 0, waitLabel: "" };
    }
    const waitTimeMs = Math.max(0, Date.now() - new Date(lastMsg.timestamp).getTime());
    const minutes = Math.floor(waitTimeMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    let waitLabel = `${minutes}m`;
    if (days > 0) waitLabel = `${days}d ${hours % 24}h`;
    else if (hours > 0) waitLabel = `${hours}h ${minutes % 60}m`;
    return { isWaiting: true, waitTimeMs, waitLabel };
  };

  const allCount = filteredLeads.length;
  const needsReplyCount = useMemo(() => {
    return filteredLeads.filter((l) => {
      const info = getCustomerWaitInfo(l);
      return info.isWaiting;
    }).length;
  }, [filteredLeads, messages]);

  const aiActiveCount = useMemo(() => {
    return filteredLeads.filter((l) => l.aiHandled).length;
  }, [filteredLeads]);

  const displayedLeads = useMemo(() => {
    const list = filteredLeads.filter((lead) => {
      const thread = messages[lead.id] || [];
      const lastMsg = thread[thread.length - 1]?.text || "";
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        (lead.assignedToName &&
          lead.assignedToName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Channel filtering for multi-account WhatsApp
      if (selectedChannel !== "all") {
        const leadChannel = lead.whatsappConnectionId?.toString() || lead.whatsappConnectionId;
        if (leadChannel !== selectedChannel) return false;
      }

      if (activeFilter === "needs_reply") {
        const { isWaiting } = getCustomerWaitInfo(lead);
        return isWaiting;
      }
      if (activeFilter === "ai") return lead.aiHandled;
      if (activeFilter === "mine") return lead.assignedToId === currentUser.id;
      return true;
    });

    return list.sort((a, b) => {
      if (activeFilter === "needs_reply" || sortBy === "longest_wait") {
        const waitA = getCustomerWaitInfo(a).waitTimeMs;
        const waitB = getCustomerWaitInfo(b).waitTimeMs;
        if (waitA !== waitB) return waitB - waitA;
      }
      const threadA = messages[a.id] || [];
      const threadB = messages[b.id] || [];
      const timeA =
        threadA[threadA.length - 1]?.timestamp || a.lastContactAt || a.createdAt;
      const timeB =
        threadB[threadB.length - 1]?.timestamp || b.lastContactAt || b.createdAt;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  }, [filteredLeads, messages, searchQuery, activeFilter, selectedChannel, sortBy, currentUser.id]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setSelectedChannel("all");
  };

  return (
    <div className="flex flex-col h-full bg-white w-full shrink-0 select-none border-r border-slate-200">
      {/* Header & Controls */}
      <div className="p-3.5 border-b border-slate-200 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Conversations
            </h2>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              ({displayedLeads.length})
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setSortBy((prev) =>
                prev === "recent_activity" ? "longest_wait" : "recent_activity"
              )
            }
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-200/60 transition-colors"
            title={
              sortBy === "longest_wait"
                ? "Sorted by longest wait. Click to sort by recent activity."
                : "Sorted by recent activity. Click to prioritize longest wait."
            }
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">
              {sortBy === "longest_wait" ? "Longest Wait" : "Recent"}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads, phone, or rep..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-lg bg-white border border-slate-200 pl-9 pr-8 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* WhatsApp Channel Filter (Multi-Account WhatsApp Inbox) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar border-b border-slate-100 pb-2">
          <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            Line:
          </span>
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedChannel === ch.id
                  ? "bg-emerald-700 text-white font-semibold shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
              title={ch.number}
            >
              <span>{ch.name}</span>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              activeFilter === "all"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>All</span>
            <span
              className={`text-xs px-1 rounded-full tabular-nums ${
                activeFilter === "all" ? "bg-slate-700 text-white" : "text-slate-500"
              }`}
            >
              {allCount}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("needs_reply")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              activeFilter === "needs_reply"
                ? "bg-amber-600 text-white font-semibold shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>Needs Reply</span>
            {needsReplyCount > 0 && (
              <span
                className={`text-xs px-1.5 font-bold rounded-full tabular-nums ${
                  activeFilter === "needs_reply"
                    ? "bg-amber-800 text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {needsReplyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter("ai")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              activeFilter === "ai"
                ? "bg-emerald-700 text-white font-semibold shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Active</span>
            <span
              className={`text-xs px-1 rounded-full tabular-nums ${
                activeFilter === "ai" ? "bg-emerald-900 text-white" : "text-slate-500"
              }`}
            >
              {aiActiveCount}
            </span>
          </button>
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white" role="list">
        {displayedLeads.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <p>No conversations match your selected filters.</p>
            {(searchQuery || activeFilter !== "all") && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-emerald-700 hover:underline inline-block mt-1 cursor-pointer"
              >
                Clear all filters and search
              </button>
            )}
          </div>
        ) : (
          displayedLeads.map((lead) => {
            const thread = messages[lead.id] || [];
            const lastMsg = thread[thread.length - 1];
            const isSelected = selectedLeadId === lead.id;
            const { isWaiting, waitLabel } = getCustomerWaitInfo(lead);

            return (
              <div
                key={lead.id}
                role="button"
                tabIndex={0}
                aria-selected={isSelected}
                aria-label={`Conversation with ${lead.name}, assigned to ${lead.assignedToName || "Unassigned"}`}
                onClick={() => onSelectLead(lead.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectLead(lead.id);
                  }
                }}
                className={`flex items-start gap-3 p-3.5 cursor-pointer transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset ${
                  isSelected
                    ? "bg-emerald-50/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-600"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar name={lead.name} size="md" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {lead.name}
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums shrink-0">
                      {lastMsg ? formatRelativeTime(lastMsg.timestamp) : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    {isWaiting ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Wait {waitLabel}
                      </span>
                    ) : lead.aiHandled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        <Bot className="w-3 h-3 text-emerald-600" />
                        AI Autopilot
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        <UserCheck className="w-3 h-3 text-slate-500" />
                        Manual
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded max-w-[120px] truncate"
                      title={`Assigned to ${lead.assignedToName || "Unassigned"}`}
                    >
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{lead.assignedToName || "Unassigned"}</span>
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate">
                      {lead.status}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded truncate"
                      title={lead.id.charCodeAt(lead.id.length - 1) % 2 === 0 ? "Primary: +1 555-839-2041" : "Line 2: +1 555-912-3456"}
                    >
                      <PhoneCall className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      <span>{lead.id.charCodeAt(lead.id.length - 1) % 2 === 0 ? "Line 1" : "Line 2"}</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate flex items-center gap-1 leading-snug">
                    {lastMsg ? (
                      <Fragment>
                        {lastMsg.sender === "salesperson" && (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        )}
                        {lastMsg.sender === "ai" && (
                          <span className="text-emerald-700 font-semibold shrink-0">AI:</span>
                        )}
                        <span className="truncate">{lastMsg.text}</span>
                      </Fragment>
                    ) : (
                      <span className="text-slate-400 italic">No messages yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
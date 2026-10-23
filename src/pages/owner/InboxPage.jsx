import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ConversationList } from "../../components/inbox/ConversationList";
import { ChatThread } from "../../components/inbox/ChatThread";
import { MessageComposer } from "../../components/inbox/MessageComposer";
import { LeadDetailsSidebar } from "../../components/inbox/LeadDetailsSidebar";
import { MessageSquare, Sparkles } from "lucide-react";
const InboxPage = () => {
  const { filteredLeads } = useApp();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const urlLeadId = searchParams.get("leadId") || location.state?.leadId;
  const [selectedLeadId, setSelectedLeadId] = useState(
    urlLeadId || filteredLeads[0]?.id || null,
  );
  const [showDetails, setShowDetails] = useState(false);
  const [mobileView, setMobileView] = useState(urlLeadId ? "chat" : "list");
  const [draftsByLeadId, setDraftsByLeadId] = useState({});
  const selectedLead =
    filteredLeads.find((l) => l.id === selectedLeadId) || filteredLeads[0];
  useEffect(() => {
    if (urlLeadId && filteredLeads.some((l) => l.id === urlLeadId)) {
      setSelectedLeadId(urlLeadId);
      setMobileView("chat");
    } else if (filteredLeads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(filteredLeads[0].id);
    }
  }, [urlLeadId, filteredLeads, selectedLeadId]);
  const handleSelectLead = (leadId) => {
    setSelectedLeadId(leadId);
    setMobileView("chat");
  };
  const handleDraftChange = (text) => {
    if (!selectedLead) return;
    setDraftsByLeadId((prev) => ({
      ...prev,
      [selectedLead.id]: text,
    }));
  };
  return (
    <div
      className={
        "relative h-[calc(100vh-57px)] md:h-[calc(100vh-57px)] flex bg-white overflow-hidden z-0 border-t border-slate-200/80"
      }
    >
      {
        <div
          className={`h-full ${mobileView === "chat" ? "hidden md:flex" : "flex"} w-full md:w-72 lg:w-80 shrink-0 border-r border-slate-200/80`}
        >
          {
            <ConversationList
              selectedLeadId={selectedLead?.id || null}
              onSelectLead={handleSelectLead}
            />
          }
        </div>
      }
      {selectedLead ? (
        <div
          className={`h-full flex-1 flex min-w-0 relative ${mobileView === "list" ? "hidden md:flex" : "flex"}`}
        >
          {
            <div
              className={
                "flex-1 flex flex-col min-w-0 h-full relative bg-slate-50/50"
              }
            >
              {
                <ChatThread
                  lead={selectedLead}
                  onToggleDetails={() => setShowDetails(!showDetails)}
                  showDetail={showDetails}
                  onBackToList={() => setMobileView("list")}
                />
              }
              {
                <MessageComposer
                  leadId={selectedLead.id}
                  draft={draftsByLeadId[selectedLead.id] || ""}
                  onDraftChange={handleDraftChange}
                />
              }
            </div>
          }
          {showDetails && (
            <div
              className={
                "absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-20 2xl:hidden"
              }
              onClick={() => setShowDetails(false)}
            />
          )}
          {
            <div
              className={`absolute 2xl:relative inset-y-0 right-0 z-30 bg-white transition-all duration-200 ease-in-out border-l border-slate-200/90 shadow-2xl 2xl:shadow-none overflow-hidden ${showDetails ? "w-full sm:w-[380px] 2xl:w-[340px] translate-x-0 opacity-100" : "w-0 translate-x-full opacity-0 pointer-events-none 2xl:hidden"}`}
            >
              {showDetails && (
                <LeadDetailsSidebar
                  lead={selectedLead}
                  onClose={() => setShowDetails(false)}
                />
              )}
            </div>
          }
        </div>
      ) : (
        /* Empty State */
        <div
          className={
            "flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/70"
          }
        >
          {
            <div className={"w-full max-w-sm flex flex-col items-center"}>
              {
                <div
                  className={
                    "w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs mb-5"
                  }
                >
                  {<MessageSquare className={"w-7 h-7"} />}
                </div>
              }
              {
                <h2
                  className={
                    "text-lg font-semibold text-slate-900 tracking-tight mb-2"
                  }
                >
                  Select a conversation to begin
                </h2>
              }
              {
                <p
                  className={
                    "text-xs text-slate-500 leading-relaxed max-w-xs mb-6"
                  }
                >
                  Live WhatsApp sales messages with AI autopilot, qualification
                  intelligence, and instant human handover.
                </p>
              }
              {
                <div
                  className={
                    "flex items-center gap-2 text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs"
                  }
                >
                  {<Sparkles className={"w-3.5 h-3.5 text-emerald-600"} />}
                  {
                    <span>
                      AI co-pilot active and monitoring inbound inquiries
                    </span>
                  }
                </div>
              }
            </div>
          }
        </div>
      )}
    </div>
  );
};
export { InboxPage };

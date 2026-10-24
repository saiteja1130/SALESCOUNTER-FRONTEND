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
    urlLeadId || filteredLeads[0]?.id || null
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
    <div className="relative h-full flex bg-white overflow-hidden z-0 border-t border-slate-200/80">
      {/* Pane 1: Conversation List */}
      <div
        className={`h-full ${
          mobileView === "chat" ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-[340px] shrink-0 border-r border-slate-200/80 flex-col bg-white`}
      >
        <ConversationList
          selectedLeadId={selectedLead?.id || null}
          onSelectLead={handleSelectLead}
        />
      </div>

      {/* Pane 2: Active Chat Thread + Message Composer */}
      {selectedLead ? (
        <div
          className={`h-full flex-1 flex min-w-0 relative ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex-1 flex flex-col min-w-0 h-full relative bg-slate-50/50">
            {/* Bug fixed: showDetails={showDetails} */}
            <ChatThread
              lead={selectedLead}
              onToggleDetails={() => setShowDetails(!showDetails)}
              showDetails={showDetails}
              onBackToList={() => setMobileView("list")}
            />
            <MessageComposer
              leadId={selectedLead.id}
              draft={draftsByLeadId[selectedLead.id] || ""}
              onDraftChange={handleDraftChange}
            />
          </div>

          {/* Pane 3: Lead CRM Intelligence Sidebar */}
          {showDetails && (
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-20 2xl:hidden"
              onClick={() => setShowDetails(false)}
            />
          )}

          <div
            className={`fixed 2xl:relative inset-y-0 right-0 z-30 bg-white transition-all duration-200 ease-in-out border-l border-slate-200/90 shadow-2xl 2xl:shadow-none overflow-hidden ${
              showDetails
                ? "w-full sm:w-[380px] 2xl:w-[350px] translate-x-0 opacity-100"
                : "w-0 translate-x-full opacity-0 pointer-events-none 2xl:hidden"
            }`}
          >
            {showDetails && (
              <LeadDetailsSidebar
                lead={selectedLead}
                onClose={() => setShowDetails(false)}
              />
            )}
          </div>
        </div>
      ) : (
        /* Empty Inbox State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/70">
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs mb-5">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Shared WhatsApp Inbox
            </h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Select an active customer conversation to view live message history, review AI suggested replies, or take over manually.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { InboxPage };

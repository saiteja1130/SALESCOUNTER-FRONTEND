import { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Avatar } from "../ui/Avatar";
import {
  User,
  CheckCheck,
  Sparkles,
  UserCheck,
  PanelRightOpen,
  PanelRightClose,
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
const ChatThread = ({
  lead,
  onToggleDetails,
  showDetails,
  onBackToList
}) => {
  const { messages, toggleAiHandling, sendMessage, teamMembers, assignLead } = useApp();
  const { showToast } = useToast();
  const thread = messages[lead.id] || [];
  const messagesEndRef = useRef(null);
  const [showSimulateMenu, setShowSimulateMenu] = useState(false);
  const [showReassignDropdown, setShowReassignDropdown] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [thread.length, lead.id]);
  const handleToggleAi = () => {
    toggleAiHandling(lead.id);
    if (lead.aiHandled) {
      showToast("AI Autopilot paused. Manual sales representative takeover active.");
    } else {
      showToast("Conversly AI Autopilot resumed. AI will answer new inbound messages.");
    }
  };
  const handleSimulateQuestion = (question) => {
    sendMessage(lead.id, question, "lead");
    setShowSimulateMenu(false);
    showToast("Simulated customer WhatsApp message dispatched.");
  };
  const handleQuickReassign = (repId) => {
    assignLead(lead.id, repId);
    const rep = teamMembers.find((m) => m.id === repId);
    showToast(`Lead reassigned to ${rep?.name || "team member"}`);
    setShowReassignDropdown(false);
  };
  const sampleQuestions = [
    "Do you deliver to Austin, TX and what is the lead time?",
    "Can I customize the finish to dark walnut or white oak?",
    "What is the price for the 8-seater bespoke dining table?",
    "Do you offer designer or architectural trade volume discounts?"
  ];
  return  <div className={"flex-1 flex flex-col h-full bg-slate-50/60 min-w-0 relative overflow-hidden"}>{<div className={"h-14 px-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 gap-2"}>{<div className={"flex items-center gap-3 min-w-0"}>{onBackToList &&  <button onClick={onBackToList} className={"md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"} title={"Back to conversations"} aria-label={"Back to conversations list"}>{<ArrowLeft className={"w-4 h-4"} />}</button>}{<div className={"flex items-center gap-2.5 cursor-pointer group"} onClick={onToggleDetails} role={"button"} tabIndex={0} onKeyDown={(e) => e.key === "Enter" ? onToggleDetails() : null} aria-label={`Open details for ${lead.name}`}>{<div className={"relative"}>{<Avatar name={lead.name} size={"sm"} />}{<span className={"w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5"} />}</div>}{<div className={"min-w-0"}>{<div className={"flex items-center gap-2"}>{<h2 className={"text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors"}>{lead.name}</h2>}{<span className={"text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded hidden sm:inline"}>{lead.status}</span>}</div>}{<div className={"flex items-center gap-1.5 text-[11px] text-slate-500"}>{<span className={"font-mono text-[10px] text-slate-400"}>{lead.phone}</span>}{<span className={"text-slate-300"}>\u2022</span>}{<span className={"text-emerald-600 font-medium flex items-center gap-1"}>{<span className={"w-1.5 h-1.5 rounded-full bg-emerald-500"} />}WhatsApp</span>}</div>}</div>}</div>}</div>}{<div className={"flex items-center gap-1.5 sm:gap-2 shrink-0"}>{<button type={"button"} onClick={handleToggleAi} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${lead.aiHandled ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 focus:ring-emerald-600" : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 focus:ring-amber-600"}`} aria-label={lead.aiHandled ? "AI Autopilot is currently active. Click to switch to manual takeover." : "Manual takeover is active. Click to resume AI autopilot."} title={lead.aiHandled ? "AI Autopilot active: automatically drafting & sending WhatsApp replies. Click to take over manually." : "Manual takeover active: AI will not auto-reply. Click to resume AI autopilot."}>{lead.aiHandled ?  <Fragment>{<Sparkles className={"w-3.5 h-3.5 text-emerald-600 shrink-0 animate-pulse"} />}{<span className={"font-semibold text-emerald-900"}>AI Autopilot</span>}{<span className={"text-[10px] text-emerald-700 font-semibold underline hidden sm:inline ml-0.5"}>Pause</span>}</Fragment> :  <Fragment>{<UserCheck className={"w-3.5 h-3.5 text-amber-700 shrink-0"} />}{<span className={"font-semibold text-amber-900"}>Manual Takeover</span>}{<span className={"text-[10px] text-amber-700 font-semibold underline hidden sm:inline ml-0.5"}>Resume AI</span>}</Fragment>}</button>}{<div className={"relative"}>{showSimulateMenu &&  <Fragment>{<div className={"fixed inset-0 z-30"} onClick={() => setShowSimulateMenu(false)} />}{<div className={"absolute right-0 top-full mt-1.5 w-80 rounded-xl bg-white border border-slate-200 shadow-xl z-40 p-2.5 animate-in fade-in zoom-in-95"}>{<div className={"flex items-center justify-between pb-1.5 border-b border-slate-100"}>{<span className={"text-[10px] font-semibold text-slate-500 uppercase tracking-wider"}>Simulate Inbound Inquiry (Demo)</span>}{<span className={"text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium"}>Sandbox</span>}</div>}{<div className={"space-y-1.5 mt-2"}>{sampleQuestions.map((q, i) =>  <button type={"button"} onClick={() => handleSimulateQuestion(q)} className={"w-full text-left p-2 rounded-lg text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors cursor-pointer border border-transparent hover:border-emerald-200 leading-snug"}>"{q}"</button>)}</div>}</div>}</Fragment>}</div>}{<button type={"button"} onClick={onToggleDetails} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${showDetails ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`} title={"Toggle lead qualification & CRM panel"} aria-label={showDetails ? "Close qualification details" : "Open qualification details"}>{showDetails ?  <Fragment>{<PanelRightClose className={"w-3.5 h-3.5"} />}{<span className={"hidden sm:inline"}>Close</span>}</Fragment> :  <Fragment>{<PanelRightOpen className={"w-3.5 h-3.5"} />}{<span className={"hidden sm:inline"}>Qualification</span>}</Fragment>}</button>}</div>}</div>}{<div className={"flex-1 overflow-y-auto p-4 sm:p-6 lg:px-8 space-y-3 z-10"}>{lead.needsAttention &&  <div className={"p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-2xs"}>{<div className={"flex items-center gap-2"}>{<AlertTriangle className={"w-4 h-4 text-amber-600 shrink-0"} />}{<span>{<strong>Human Attention Needed:</strong>} Lead requested human assistance or asked a question outside automated AI rules.</span>}</div>}{<span className={"text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 shrink-0"}>Action Required</span>}</div>}{<div className={"flex justify-center mb-2"}>{<div className={"bg-slate-100 text-slate-500 text-[11px] px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs flex items-center gap-1.5"}>{<span className={"w-1.5 h-1.5 rounded-full bg-emerald-500"} />}{<span>Official WhatsApp Cloud API \u2022 End-to-end encrypted session</span>}</div>}</div>}{thread.map((msg) => {
        const isCustomer = msg.sender === "lead";
        const isAi = msg.sender === "ai";
        const isSalesperson = msg.sender === "salesperson";
        return  <div className={`flex ${isCustomer ? "justify-start" : "justify-end"} mb-2`}>{<div className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-xl shadow-2xs text-xs relative ${isCustomer ? "bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs" : isAi ? "bg-emerald-50/90 text-slate-900 border border-emerald-200/80 rounded-tr-xs" : "bg-slate-900 text-white rounded-tr-xs"}`}>{<div className={"flex items-center justify-between gap-3 mb-1"}>{isCustomer ?  <span className={"text-[10.5px] font-medium text-slate-500 flex items-center gap-1"}>{<User className={"w-3 h-3 text-slate-400"} />}{lead.name}</span> : isAi ?  <span className={"text-[10.5px] font-semibold text-emerald-800 flex items-center gap-1"}>{<Sparkles className={"w-3 h-3 text-emerald-600"} />}Conversly AI Autopilot</span> :  <span className={"text-[10.5px] font-medium text-slate-300 flex items-center gap-1"}>{<UserCheck className={"w-3 h-3 text-slate-400"} />}Sales Representative</span>}{<span className={`text-[10px] tabular-nums ${isSalesperson ? "text-slate-400" : "text-slate-400"}`}>{new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}</span>}</div>}{<div className={"whitespace-pre-wrap break-words leading-relaxed text-[13px]"}>{msg.text}</div>}{!isCustomer &&  <div className={"flex items-center justify-end gap-1 mt-1"}>{<CheckCheck className={`w-3.5 h-3.5 ${isSalesperson ? "text-emerald-400" : "text-sky-600"}`} />}</div>}</div>}</div>;
      })}{<div ref={messagesEndRef} className={"h-2"} />}</div>}</div>;
};
export {
  ChatThread
};
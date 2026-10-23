import { CheckCircle2, Circle, ArrowRight, Smartphone, Bot, Key, Users, AlertTriangle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const { qrConnected, geminiApiKey, teamMembers, aiConfig } = useApp();
  const isAiTrained = Boolean(aiConfig.welcomeMessage && (aiConfig.services?.length || 0) > 0);
  const steps = [
    {
      id: "whatsapp",
      label: "Connect WhatsApp Business",
      desc: qrConnected ? "Connected (+1 555-839-2041)" : "Action needed: Scan WhatsApp QR code to link number",
      done: qrConnected,
      icon:  <Smartphone className={"w-4 h-4"} />,
      action: () => navigate("/settings")
    },
    {
      id: "teach-ai",
      label: "Train Sales AI Knowledge Base",
      desc: isAiTrained ? `${aiConfig.services?.length || 0} services & ${aiConfig.rules?.length || 0} conversation rules active` : "Action needed: Configure services catalog and greeting",
      done: isAiTrained,
      icon:  <Bot className={"w-4 h-4"} />,
      action: () => navigate("/teach-ai")
    },
    {
      id: "gemini",
      label: "Gemini AI Model Key",
      desc: geminiApiKey ? "API Key verified (Gemini 2.5 Flash active)" : "Action needed: Enter Google Gemini API key",
      done: Boolean(geminiApiKey),
      icon:  <Key className={"w-4 h-4"} />,
      action: () => navigate("/settings")
    },
    {
      id: "team",
      label: "Sales Representatives & Routing",
      desc: teamMembers.length >= 2 ? `${teamMembers.length} active sales reps with round-robin lead distribution` : "Action needed: Add sales reps to handle escalations",
      done: teamMembers.length >= 2,
      icon:  <Users className={"w-4 h-4"} />,
      action: () => navigate("/team")
    }
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const isAllComplete = completedCount === steps.length;
  const remainingSteps = steps.filter((s) => !s.done);
  return  <div className={"bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between h-full"}>{<div>{<div className={"flex items-center justify-between gap-2 mb-3"}>{<div>{<h3 className={"text-sm font-semibold text-slate-900"}>Setup &amp; Verification</h3>}{<p className={"text-xs text-slate-500 mt-0.5"}>{completedCount} of {steps.length} milestones complete</p>}</div>}{isAllComplete ?  <span className={"inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"}>{<Check className={"w-3.5 h-3.5 text-emerald-600"} />}Ready for Inbound</span> :  <span className={"inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200"}>{<AlertTriangle className={"w-3.5 h-3.5 text-amber-600"} />}{remainingSteps.length}{" "}{remainingSteps.length === 1 ? "Step" : "Steps"} Remaining</span>}</div>}{<div className={"w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden"}>{<div className={`h-2 rounded-full transition-all duration-500 ${isAllComplete ? "bg-emerald-600" : "bg-amber-500"}`} style={{ width: `${completedCount / steps.length * 100}%` }} />}</div>}{!isAllComplete &&  <div className={"mb-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed"}>{<strong>Next needed setup:</strong>}{" "}{remainingSteps.map((s) => s.label).join(" \xB7 ")}</div>}{<div className={"space-y-2"}>{steps.map((step) =>  <div onClick={step.action} role={"button"} tabIndex={0} aria-label={`Configure ${step.label}`} onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              step.action();
            }
          }} className={"p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"}>{<div className={"flex items-center gap-3 min-w-0"}>{<div className={`p-2 rounded-lg shrink-0 border ${step.done ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" : "bg-white text-slate-500 border-slate-200/80"}`}>{step.icon}</div>}{<div className={"min-w-0"}>{<div className={"text-xs font-semibold text-slate-900 truncate"}>{step.label}</div>}{<div className={`text-xs truncate mt-0.5 ${step.done ? "text-slate-500" : "text-amber-800 font-medium"}`}>{step.desc}</div>}</div>}</div>}{<div className={"shrink-0 flex items-center"}>{step.done ?  <CheckCircle2 className={"w-4 h-4 text-emerald-600"} /> :  <Circle className={"w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors"} />}</div>}</div>)}</div>}</div>}{<div className={"mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"}>{<span>Status:{" "}{<strong className={isAllComplete ? "text-emerald-700" : "text-amber-700"}>{isAllComplete ? "Live & Accepting WhatsApp Chats" : "Setup Incomplete"}</strong>}</span>}{<button onClick={() => navigate("/settings")} className={"text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:underline"}>{<span>Workspace Settings</span>}{<ArrowRight className={"w-3.5 h-3.5"} />}</button>}</div>}</div>;
};
export {
  OnboardingChecklist
};
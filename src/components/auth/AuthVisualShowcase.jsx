import { useState, useEffect } from "react";
import {
  MessageSquare,
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const AuthVisualShowcase = () => {
  const [typingStep, setTypingStep] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setTypingStep((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white p-6 lg:p-8 xl:p-10 flex flex-col justify-between overflow-hidden select-none">
      {/* Concentric Aura Rings Background */}
      <div className="absolute -top-32 -right-32 w-[620px] h-[620px] rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-[480px] h-[480px] rounded-full border border-white/15 pointer-events-none" />
      <div className="absolute top-12 right-12 w-[340px] h-[340px] rounded-full border border-white/20 pointer-events-none" />
      <div className="absolute top-28 right-28 w-[200px] h-[200px] rounded-full border border-white/25 pointer-events-none" />

      {/* Floating Paper Airplane / Avatar Badge */}
      <div className="absolute top-8 right-12 hidden xl:flex items-center gap-2 z-20 animate-bounce duration-1000">
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md p-0.5 border border-white/30 shadow-md">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-slate-900 font-bold text-xs shadow-xs">
            EV
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md">
          <Send className="w-3.5 h-3.5 translate-x-[-1px] translate-y-[-1px]" />
        </div>
      </div>

      {/* Header Copy */}
      <div className="relative z-10 max-w-xl shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-blue-100 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>WhatsApp AI Sales Automation 2.5</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Delight Your Customer Effortlessly
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed max-w-md">
          Simplify every experience and put customers back in control by offering the instant WhatsApp AI sales support they expect.
        </p>
      </div>

      {/* Realistic Software Mockup UI Container - Anchored to bottom right like reference */}
      <div className="relative z-10 mt-6 flex-1 flex flex-col justify-end min-h-0">
        {/* Floating Top Lead Assignee Badges */}
        <div className="relative mb-2 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 bg-white text-slate-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">Live AI Autopilot</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">99.4% Qualified</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 text-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
              MC
            </div>
            <div>
              <span className="font-semibold text-slate-900">Marcus Chen</span>
              <span className="text-slate-400 mx-1">·</span>
              <span className="text-slate-500">Assigned</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Hot Lead
            </span>
          </div>
        </div>

        {/* Main Mockup Card - Anchored flush to bottom right */}
        <div className="bg-white rounded-tl-2xl shadow-2xl border-t border-l border-white/20 text-slate-800 overflow-hidden flex flex-col max-h-[360px] xl:max-h-[400px]">
          {/* Card Window Top Bar */}
          <div className="bg-slate-50/95 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <div className="h-3.5 w-[1px] bg-slate-200 mx-1" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Live Chat &amp; Lead Qualification</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>Active 24/7</span>
              </span>
            </div>
          </div>

          {/* Card Body: Mini Sidebar + Chat Automation Canvas */}
          <div className="grid grid-cols-12 flex-1 min-h-0 overflow-hidden">
            {/* Miniature Navigation Strip */}
            <div className="col-span-2 sm:col-span-1 bg-slate-100/70 border-r border-slate-200 p-2 flex flex-col items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <Zap className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-md bg-white text-slate-600 flex items-center justify-center shadow-2xs border border-slate-200">
                <MessageSquare className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-md text-slate-400 flex items-center justify-center hover:bg-slate-200">
                <User className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-md text-slate-400 flex items-center justify-center hover:bg-slate-200">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>

            {/* Conversation Flow Area */}
            <div className="col-span-10 sm:col-span-11 p-3.5 space-y-2.5 bg-slate-50/50 overflow-y-auto">
              {/* Customer Header info */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    SJ
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Sarah Jenkins</span>
                      <span className="text-xs font-normal text-slate-500">
                        (+1 555-839-2041)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span>WhatsApp Click-to-Chat</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">Verified Lead</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-md">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>Score: 96 / 100</span>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="space-y-2 text-xs">
                {/* Inbound Customer Message */}
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="p-2.5 rounded-xl rounded-tl-xs bg-white border border-slate-200 text-slate-800 shadow-2xs">
                    <p className="leading-relaxed">
                      Hi! We are remodeling 8 luxury suites and need custom walnut dining sets delivered by next month. Could you share specifications and volume pricing?
                    </p>
                    <span className="text-xs text-slate-400 mt-1 block text-right">
                      10:24 AM · Received
                    </span>
                  </div>
                </div>

                {/* AI Instant Qualification Response */}
                <div className="flex items-start gap-2 max-w-[90%] ml-auto flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded-xl rounded-tr-xs bg-emerald-600 text-white shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-semibold mb-0.5">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Conversly AI · Instant Response (&lt;1.8s)</span>
                    </div>
                    <p className="leading-relaxed text-white">
                      Hi Sarah! I&apos;ve reserved our 2026 Architectural Catalog for you. Estimated pricing is $1,250/unit with guaranteed 3-week expedited delivery. I&apos;ve assigned Marcus from our sales team to finalize your order details!
                    </p>
                    <span className="text-xs text-emerald-200 mt-1 block text-right">
                      10:24 AM · Sent automatically
                    </span>
                  </div>
                </div>

                {/* Simulated Real-Time Status / Routing Banner */}
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200/90 flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium truncate">
                      Automated Lead Routing: Assigned to <strong>Marcus Chen</strong> (Sales Rep)
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0 ml-2">
                    High Priority
                  </span>
                </div>

                {/* Live Typing Simulation */}
                {typingStep >= 2 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-600">
                        Conversly AI is preparing proposal
                      </span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metrics - Compact and inline */}
      <div className="relative z-10 pt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-blue-100/90 font-medium border-t border-white/10 shrink-0">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-300" />
          <span>Avg First Response: <strong>1.8s</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>Lead Conversion: <strong>+42%</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>WhatsApp Cloud Certified</span>
        </div>
      </div>
    </div>
  );
};

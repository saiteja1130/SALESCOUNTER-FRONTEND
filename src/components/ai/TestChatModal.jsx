import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useApp } from "../../context/AppContext";
import { Bot, Send, User, Sparkles, RefreshCw, Zap } from "lucide-react";

export const TestChatModal = ({ isOpen, onClose }) => {
  const { aiConfig } = useApp();
  const [messages, setMessages] = useState([
    {
      id: "init-1",
      sender: "ai",
      text: aiConfig.welcomeMessage || "Hello! Welcome to our showroom. How can we assist you today?",
      timestamp: "10:00 AM",
      feedback: {
        type: "service",
        title: "Step 2: Default Welcome Message",
        explanation: "Greeting sent automatically when a prospective client sends their first WhatsApp message.",
      },
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [turnCount, setTurnCount] = useState(1);

  const sampleScenarios = [
    { label: "Inquire about dining tables", text: "Hi! Do you make custom oak or marble dining tables?" },
    { label: "Ask for a 20% discount", text: "We are ordering for an office. Can you do a 20% bulk discount?" },
    { label: "Ask for human manager", text: "I need to speak with a human sales manager right away." },
    { label: "Provide budget & timeline", text: "My budget is around $12,000 and I need installation by next month." },
    { label: "Ask for booking link", text: "How can I schedule a consultation or visit your workshop?" },
  ];

  const handleSend = (textToSend) => {
    const q = textToSend || input;
    if (!q.trim()) return;
    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      let reply = `Thank you for asking! At ${aiConfig.companyName || "our showroom"}, our consultative team is dedicated to crafting exceptional bespoke pieces.`;
      let feedback = {
        type: "service",
        title: "Step 1: Brand Persona & Knowledge",
        explanation: `Answered using your Brand Description and response length limit (${aiConfig.maxWords} words).`,
      };

      if (/table|dining|marble|oak|furniture|catalog/i.test(q)) {
        reply = `We craft bespoke dining tables including solid white oak joinery and honed Carrara marble slabs. Each piece is made to your custom room dimensions. What measurements or seating count are you looking for?`;
        feedback = {
          type: "service",
          title: "Step 2: Services Catalog Matched",
          explanation: "Referenced your Services catalog to showcase custom tables and prompt for dimension details.",
        };
      } else if (/discount|price|deal|cheaper|quote/i.test(q)) {
        reply = `Our courtesy savings are strictly capped at 10% for confirmed multi-piece orders to maintain material quality. For larger commercial inquiries, I can connect you directly with Elena Vance.`;
        feedback = {
          type: "rule",
          title: "Step 3: Conversation Rule (Strict Discount Cap)",
          explanation: "Applied your rule forbidding discounts above 10% and offering manager escalation.",
        };
      } else if (/human|manager|call|speak|person/i.test(q)) {
        reply = `I am alerting our executive sales team right now. Elena Vance and Marcus Chen have been notified and will jump into this chat to assist you directly!`;
        feedback = {
          type: "rule",
          title: "Step 3: Conversation Rule (Human Rep Escalation)",
          explanation: "Detected request for a human specialist and initiated handoff response.",
        };
      } else if (/budget|timeline|month|dollar|\$|room/i.test(q)) {
        reply = `A $12,000 budget is well-suited for our custom dining tables and premium finishes! With a 4–5 week workshop schedule, we can certainly deliver next month. Would you like to review finish samples?`;
        feedback = {
          type: "qualification",
          title: "Step 4: Lead Details Extracted",
          explanation: "Extracted budget ($12,000) and timeline (next month) to update the lead profile card in CRM.",
        };
      } else if (/schedule|book|link|visit|appointment/i.test(q)) {
        if (nextTurn < aiConfig.minTurnsForCTA) {
          reply = `We would love to show you our craftsmanship! Before we book, what style of furniture or space are you designing?`;
          feedback = {
            type: "trigger",
            title: `Step 5: Message Timing Guard (Turn ${nextTurn} of ${aiConfig.minTurnsForCTA})`,
            explanation: `Withheld booking link because minimum turns (${aiConfig.minTurnsForCTA}) has not been reached yet to avoid rushing the client.`,
          };
        } else {
          reply = `You can easily pick a time for a 1-on-1 virtual or showroom consultation with our design team here: ${aiConfig.ctaLink || "https://calendly.com/artisan-living"}`;
          feedback = {
            type: "trigger",
            title: "Step 5: Booking Link Trigger (Turn Threshold Reached)",
            explanation: `Sent consultation booking link (${aiConfig.ctaLink || "Calendly"}) after meeting the turn pacing requirement.`,
          };
        }
      }

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedback,
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsThinking(false);
    }, 700);
  };

  const handleReset = () => {
    setTurnCount(1);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "ai",
        text: aiConfig.welcomeMessage || "Hello! Welcome to our showroom. How can we assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedback: {
          type: "service",
          title: "Step 2: Default Welcome Message",
          explanation: "Greeting sent automatically when a prospective client sends their first WhatsApp message.",
        },
      },
    ]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Test AI WhatsApp Simulator"
      description="Interactive sandbox to test how your configured rules, service catalog, and guardrails respond in real time."
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Conversation
          </Button>
          <Button size="sm" onClick={onClose}>
            Close Simulator
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Active agent pill */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Testing as: <strong>{aiConfig.agentName || "Elena Vance"}</strong> (
              {aiConfig.agentRole || "Sales Advisor"})
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md self-start sm:self-auto">
            Interactive Rule Inspector Active
          </span>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-600 block mb-1.5">
            Test with common customer questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleScenarios.map((s, idx) => (
              <button
                key={s.label || idx}
                type="button"
                onClick={() => handleSend(s.text)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Box */}
        <div className="h-80 overflow-y-auto bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={m.id || idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3 text-xs shadow-2xs ${
                  m.sender === "user"
                    ? "bg-emerald-600 text-white rounded-br-xs"
                    : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs space-y-2"
                }`}
              >
                <div className="font-semibold text-xs opacity-80 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1">
                    {m.sender === "ai" ? (
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {m.sender === "ai" ? aiConfig.agentName || "Conversly AI" : "Prospect (You)"}
                    </span>
                  </span>
                  <span className="text-xs opacity-70 tabular-nums">
                    {m.timestamp}
                  </span>
                </div>
                <p className="leading-relaxed text-xs sm:text-sm">{m.text}</p>
                {m.sender === "ai" && m.feedback && (
                  <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/80 -mx-3 -mb-3 p-2.5 rounded-b-xl text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-0.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{m.feedback.title}</span>
                    </div>
                    <p className="text-slate-500 leading-snug">
                      {m.feedback.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-white rounded-xl border border-slate-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>AI checking rules and knowledge base...</span>
            </div>
          )}
        </div>

        {/* Composer Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a custom customer question (e.g. Can you ship to Miami?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
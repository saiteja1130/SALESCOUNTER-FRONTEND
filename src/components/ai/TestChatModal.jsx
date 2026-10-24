import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Zap,
  Clock,
  Key,
  AlertCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";

export const TestChatModal = ({ isOpen, onClose, draftConfig }) => {
  const { aiConfig, testAiConversation, hasGeminiKey, saveGeminiKey } = useApp();
  const { showToast } = useToast();

  const activeConfig = draftConfig || aiConfig;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [apiError, setApiError] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: `init-${Date.now()}`,
          sender: "ai",
          text:
            activeConfig.welcomeMessage ||
            "Hello! Welcome to our WhatsApp service. How can we assist you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          feedback: {
            title: "Step 2: Welcome Greeting",
            explanation: "Greeting sent automatically when a prospective customer sends their first message.",
          },
        },
      ]);
      setTurnCount(1);
      setApiError(null);
    }
  }, [isOpen, activeConfig.welcomeMessage]);

  const sampleScenarios = [
    { label: "Inquire about custom services", text: "Hi! What bespoke services and products do you offer?" },
    { label: "Ask for a 20% discount", text: "We are ordering in bulk. Can you do a 20% discount on this order?" },
    { label: "Ask for human manager", text: "I need to speak with a human sales manager right away." },
    { label: "Provide budget & timeline", text: "Our budget is around $15,000 and we need installation within 6 weeks." },
    { label: "Ask for booking link", text: "How can I schedule a virtual consultation or workshop visit?" },
  ];

  const handleSaveInlineKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setIsSavingKey(true);
    try {
      await saveGeminiKey(apiKeyInput.trim());
      showToast("Gemini API key securely encrypted and stored!");
      setShowKeyForm(false);
      setApiKeyInput("");
      setApiError(null);
    } catch (err) {
      showToast(err.message || "Failed to save API key", "error");
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleSend = async (textToSend) => {
    const q = textToSend || input;
    if (!q.trim() || isThinking) return;

    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);
    setApiError(null);

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsThinking(true);

    try {
      // Execute test call to Gemini via backend
      const result = await testAiConversation(newHistory, activeConfig);

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: result?.text || "Thank you for asking! How else may I assist your project?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        latencyMs: result?.latencyMs,
        model: result?.model || "gemini-1.5-flash",
        extractedData: result?.extractedData,
        feedback: result?.extractedData
          ? {
              title: "Step 4: Real-time Lead Qualification Extracted",
              explanation: `Identified and extracted client details: ${Object.entries(result.extractedData)
                .map(([k, v]) => `${k} = "${v}"`)
                .join(", ")}`,
            }
          : {
              title: "Trained Persona & Constraints Applied",
              explanation: `Replied with active brand tone, word limit (${activeConfig.maxWords || 55} words), and conversation rules.`,
            },
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      if (err.code === "GEMINI_KEY_MISSING") {
        setApiError(
          "Google Gemini API key is not configured. Enter your API key below to test live Gemini responses, or configure it in Settings."
        );
        setShowKeyForm(true);
      } else {
        setApiError(err.message || "Failed to connect to Google Gemini API.");
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handleReset = () => {
    setTurnCount(1);
    setApiError(null);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "ai",
        text:
          activeConfig.welcomeMessage ||
          "Hello! Welcome to our showroom. How can we assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedback: {
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
      description="Interactive sandbox connected to Google Gemini to test your configured rules, service catalog, and guardrails."
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
        {/* Active agent pill & key status */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Testing as: <strong>{activeConfig.agentName || "Elena Vance"}</strong> (
              {activeConfig.agentRole || "Sales Advisor"})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Gemini 1.5 Flash Connected
            </span>
          </div>
        </div>

        {/* API Key Missing or Error Banner */}
        {apiError && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{apiError}</p>
                {showKeyForm && (
                  <form onSubmit={handleSaveInlineKey} className="mt-2.5 flex items-center gap-2">
                    <input
                      type="password"
                      placeholder="Paste your Google Gemini API key (AIzaSy...)"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <Button size="xs" type="submit" disabled={isSavingKey || !apiKeyInput.trim()}>
                      {isSavingKey ? "Securing..." : "Save Key & Retry"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

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
                disabled={isThinking}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
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
                      {m.sender === "ai" ? activeConfig.agentName || "Conversly AI" : "Prospect (You)"}
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {m.latencyMs && (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {m.latencyMs}ms
                      </span>
                    )}
                    <span className="text-xs opacity-70 tabular-nums">
                      {m.timestamp}
                    </span>
                  </div>
                </div>

                <p className="leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">{m.text}</p>

                {/* Extracted qualification badges */}
                {m.extractedData && Object.keys(m.extractedData).length > 0 && (
                  <div className="p-2 bg-emerald-50/80 rounded-lg border border-emerald-100 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-600" />
                      Extracted:
                    </span>
                    {Object.entries(m.extractedData).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-[11px] font-mono bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 font-semibold"
                      >
                        {k}: "{String(v)}"
                      </span>
                    ))}
                  </div>
                )}

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
              <span>Gemini evaluating rules &amp; formulating response...</span>
            </div>
          )}
        </div>

        {/* Composer Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a customer question (e.g. Can you do a 15% discount for 5 tables?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isThinking}
            className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
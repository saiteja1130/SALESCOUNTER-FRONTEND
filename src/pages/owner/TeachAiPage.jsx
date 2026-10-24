import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Unauthorized } from "../../components/layout/Unauthorized";
import { TestChatModal } from "../../components/ai/TestChatModal";
import {
  Bot,
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  HelpCircle,
  Save,
  Check,
  FileText,
} from "lucide-react";

export const TeachAiPage = () => {
  const { role } = useAuth();
  const { aiConfig, updateAiConfig } = useApp();
  const { showToast } = useToast();
  const [activeBlock, setActiveBlock] = useState(1);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [hasRecentChange, setHasRecentChange] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleInstruction, setNewRuleInstruction] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newShieldField, setNewShieldField] = useState("");

  const triggerAutoSave = () => {
    setHasRecentChange(true);
    setLastSavedTime("Just now");
    const timer = setTimeout(() => {
      setHasRecentChange(false);
    }, 1500);
    return () => clearTimeout(timer);
  };

  const handleExplicitSave = () => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLastSavedTime(`Saved at ${timeStr}`);
    setHasRecentChange(false);
    showToast("All 6 AI training sections saved successfully");
  };

  if (role !== "owner") {
    return <Unauthorized featureName="AI Training Center" />;
  }

  const isStep1Complete = Boolean(
    aiConfig.agentName && aiConfig.companyName && aiConfig.businessDescription
  );
  const isStep2Complete = Boolean(
    aiConfig.welcomeMessage && (aiConfig.services?.length || 0) > 0
  );
  const isStep3Complete = Boolean(
    (aiConfig.rules?.length || 0) > 0 && aiConfig.rules.some((r) => r.active)
  );
  const isStep4Complete = Boolean((aiConfig.fieldsToCollect?.length || 0) > 0);
  const isStep5Complete = Boolean(aiConfig.ctaLink);
  const isStep6Complete = Boolean((aiConfig.restrictedFields?.length || 0) > 0);

  const blocks = [
    {
      id: 1,
      title: "Brand Identity & Style",
      icon: <Bot className="w-4 h-4" />,
      description:
        "Who the AI introduces itself as, what your business does, and response length.",
      isComplete: isStep1Complete,
    },
    {
      id: 2,
      title: "Greetings & Services",
      icon: <MessageSquare className="w-4 h-4" />,
      description:
        "The first welcome message prospects receive and the services or products you offer.",
      isComplete: isStep2Complete,
    },
    {
      id: 3,
      title: "Conversation Rules",
      icon: <Zap className="w-4 h-4" />,
      description:
        "Specific guidelines for pricing, discounts, qualification, and sales pacing.",
      isComplete: isStep3Complete,
    },
    {
      id: 4,
      title: "Lead Details to Extract",
      icon: <FileText className="w-4 h-4" />,
      description:
        "Information the AI listens for and automatically saves to the customer profile.",
      isComplete: isStep4Complete,
    },
    {
      id: 5,
      title: "Booking Links & Timing",
      icon: <Clock className="w-4 h-4" />,
      description:
        "Your scheduling link and the minimum conversation turns before offering it.",
      isComplete: isStep5Complete,
    },
    {
      id: 6,
      title: "Information to Avoid",
      icon: <Shield className="w-4 h-4" />,
      description:
        "Sensitive or confidential topics the AI is strictly forbidden from requesting.",
      isComplete: isStep6Complete,
    },
  ];

  const completedCount = blocks.filter((b) => b.isComplete).length;
  const progressPercent = Math.round((completedCount / blocks.length) * 100);

  const buildCompiledPrompt = () => {
    let prompt = `[IDENTITY]\n`;
    prompt += `You are ${aiConfig.agentName}, a ${aiConfig.agentRole} for ${aiConfig.companyName}.\n`;
    prompt += `${aiConfig.businessDescription}\n\n`;
    prompt += `[GUARDRAILS & STYLE]\n`;
    prompt += `${aiConfig.antiAiGuardrails}\n`;
    prompt += `Keep responses brief, ideally under ${aiConfig.maxWords} words. Use natural human texting style on WhatsApp.\n\n`;
    prompt += `[SERVICES]\n`;
    prompt += `Opening Greeting: "${aiConfig.welcomeMessage}"\n`;
    prompt += `Services offered:\n`;
    (aiConfig.services || []).forEach((s) => {
      prompt += `- ${s.name}: ${s.description}\n`;
    });
    prompt += `\n`;
    prompt += `[CONVERSATION RULES]\n`;
    (aiConfig.rules || [])
      .filter((r) => r.active)
      .forEach((r) => {
        prompt += `- ${r.title}: ${r.instruction}\n`;
      });
    prompt += `\n`;
    prompt += `[LEAD DETAILS TO EXTRACT]\n`;
    prompt += `At the end of EVERY message, append a hidden JSON comment: <!-- QUALIFICATION: {...} -->\n`;
    prompt += `Fields to track: ${(aiConfig.fieldsToCollect || []).map((f) => f.key).join(", ")}\n\n`;
    prompt += `[BOOKING LINKS & TIMING]\n`;
    prompt += `Do not provide the booking link (${aiConfig.ctaLink}) until Turn ${aiConfig.minTurnsForCTA} or later.\n\n`;
    prompt += `[INFORMATION TO AVOID]\n`;
    prompt += `NEVER ask for: ${(aiConfig.restrictedFields || []).join(", ")}. If user provides them, acknowledge receipt safely but never prompt for them.\n`;
    return prompt;
  };

  const handleAddService = (name, desc) => {
    const sName = name || newServiceName.trim();
    const sDesc = desc || newServiceDesc.trim();
    if (!sName) return;
    const newService = {
      id: `s-${Date.now()}`,
      name: sName,
      description: sDesc || "High-end custom service crafted to client specifications.",
    };
    updateAiConfig({ services: [...(aiConfig.services || []), newService] });
    setNewServiceName("");
    setNewServiceDesc("");
    triggerAutoSave();
    showToast(`Added service: ${sName}`);
  };

  const handleRemoveService = (id) => {
    updateAiConfig({
      services: (aiConfig.services || []).filter((s) => s.id !== id),
    });
    triggerAutoSave();
  };

  const handleAddRule = (title, instruction) => {
    const rTitle = title || newRuleTitle.trim();
    const rInstruction = instruction || newRuleInstruction.trim();
    if (!rTitle || !rInstruction) return;
    const newRule = {
      id: `r-${Date.now()}`,
      title: rTitle,
      instruction: rInstruction,
      active: true,
    };
    updateAiConfig({ rules: [...(aiConfig.rules || []), newRule] });
    setNewRuleTitle("");
    setNewRuleInstruction("");
    triggerAutoSave();
    showToast(`Added rule: ${rTitle}`);
  };

  const handleToggleRule = (id) => {
    updateAiConfig({
      rules: (aiConfig.rules || []).map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      ),
    });
    triggerAutoSave();
  };

  const handleRemoveRule = (id) => {
    updateAiConfig({
      rules: (aiConfig.rules || []).filter((r) => r.id !== id),
    });
    triggerAutoSave();
  };

  const handleAddField = (label, key) => {
    const fLabel = label || newFieldLabel.trim();
    const fKey = key || newFieldKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (!fLabel || !fKey) return;
    const newField = {
      id: `f-${Date.now()}`,
      label: fLabel,
      key: fKey,
      required: true,
    };
    updateAiConfig({
      fieldsToCollect: [...(aiConfig.fieldsToCollect || []), newField],
    });
    setNewFieldLabel("");
    setNewFieldKey("");
    triggerAutoSave();
    showToast(`Added field: ${fLabel}`);
  };

  const handleRemoveField = (id) => {
    updateAiConfig({
      fieldsToCollect: (aiConfig.fieldsToCollect || []).filter((f) => f.id !== id),
    });
    triggerAutoSave();
  };

  const handleAddShield = (field) => {
    const sField = field || newShieldField.trim();
    if (!sField) return;
    updateAiConfig({
      restrictedFields: [...(aiConfig.restrictedFields || []), sField],
    });
    setNewShieldField("");
    triggerAutoSave();
    showToast(`Added restriction: ${sField}`);
  };

  const handleRemoveShield = (field) => {
    updateAiConfig({
      restrictedFields: (aiConfig.restrictedFields || []).filter((f) => f !== field),
    });
    triggerAutoSave();
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Teach Your AI"
        description="Configure how your WhatsApp sales assistant greets prospects, answers questions, and qualifies leads."
        badge="AI Knowledge Center"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasRecentChange ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span>{hasRecentChange ? "Saving..." : `Auto-saved (${lastSavedTime})`}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => setIsPreviewModalOpen(true)}
              title="Inspect full system prompt compiled by the AI"
            >
              Preview Prompt
            </Button>
            <Button
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsTestModalOpen(true)}
            >
              Test Simulator
            </Button>
          </div>
        }
      />

      {/* Progress Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900">Setup Progress</span>
            <span className="text-xs text-slate-500">
              ({completedCount} of {blocks.length} sections ready · {progressPercent}%)
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto">
            Currently on Step {activeBlock} of {blocks.length}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {blocks.map((block) => {
            const isActive = activeBlock === block.id;
            return (
              <button
                key={block.id}
                onClick={() => setActiveBlock(block.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                  isActive
                    ? "bg-emerald-50/80 border-emerald-400 text-slate-900 shadow-2xs ring-1 ring-emerald-400/20"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <div
                  className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {block.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Step {block.id} of {blocks.length}
                    </span>
                    {block.isComplete ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Needs setup
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isActive ? "text-emerald-950 font-bold" : "text-slate-900"
                    }`}
                  >
                    {block.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-emerald-600 self-center shrink-0 ml-1" />
                )}
              </button>
            );
          })}

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>How this works</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Each section contributes directly to the AI's dynamic system prompt. All changes update automatically as you type. Use the <strong>Test Simulator</strong> to test sample scenarios anytime.
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-h-[540px]">
            {/* Step 1: Brand Identity */}
            {activeBlock === 1 && (
              <div className="p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span>Step 1 of 6</span>
                    <span>•</span>
                    <span>Identity &amp; Voice</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Brand Identity &amp; Texting Style
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Introduce who the AI represents, your core business, and how concise its WhatsApp replies should be.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Agent Name"
                    required
                    placeholder="e.g. Elena Vance"
                    value={aiConfig.agentName}
                    onChange={(e) => {
                      updateAiConfig({ agentName: e.target.value });
                      triggerAutoSave();
                    }}
                    helper="The name the AI uses when greeting customers."
                  />
                  <Input
                    label="Agent Role"
                    required
                    placeholder="e.g. Design Consultant & Sales Advisor"
                    value={aiConfig.agentRole}
                    onChange={(e) => {
                      updateAiConfig({ agentRole: e.target.value });
                      triggerAutoSave();
                    }}
                    helper="Job title used to establish credibility."
                  />
                  <Input
                    label="Company Name"
                    required
                    placeholder="e.g. Artisan Living Decor"
                    value={aiConfig.companyName}
                    onChange={(e) => {
                      updateAiConfig({ companyName: e.target.value });
                      triggerAutoSave();
                    }}
                    helper="Your registered brand or showroom name."
                  />
                  <Input
                    label="Response Word Limit (Words)"
                    type="number"
                    placeholder="55"
                    value={aiConfig.maxWords}
                    onChange={(e) => {
                      updateAiConfig({ maxWords: Number(e.target.value) || 55 });
                      triggerAutoSave();
                    }}
                    helper="Recommended: 40–60 words for snappy WhatsApp chats."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Business Description &amp; Value Proposition{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">Used for domain knowledge</span>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                    rows={3}
                    placeholder="e.g. Artisan Living designs bespoke residential furniture and handcrafted architectural millwork for homeowners and interior architects across New York and California."
                    value={aiConfig.businessDescription}
                    onChange={(e) => {
                      updateAiConfig({ businessDescription: e.target.value });
                      triggerAutoSave();
                    }}
                  />
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Helpful example:</strong> Mention your specialty products, key client types, and service areas so the AI answers inquiries with context.
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Negative Guidelines &amp; Phrases to Avoid
                    </label>
                    <span className="text-xs text-slate-400">Prevents robotic text</span>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-700 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                    rows={3}
                    placeholder="e.g. NEVER say 'As an AI language model'. Never use corporate apologies like 'I apologize for any inconvenience'. Speak concisely like a busy professional sales rep."
                    value={aiConfig.antiAiGuardrails}
                    onChange={(e) => {
                      updateAiConfig({ antiAiGuardrails: e.target.value });
                      triggerAutoSave();
                    }}
                  />
                  <p className="text-xs text-slate-500">
                    These negative constraints ensure the AI stays natural and avoids sounding like a generic automated chatbot.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExplicitSave}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={() => setActiveBlock(2)}>
                    Next: Greetings &amp; Services <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Greetings & Services */}
            {activeBlock === 2 && (
              <div className="p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span>Step 2 of 6</span>
                    <span>•</span>
                    <span>Customer Welcome &amp; Catalog</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Greetings &amp; Services Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Customize your opening conversation starter and educate the AI on your service offerings.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Default Welcome Message <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">Triggered on first inbound WhatsApp message</span>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                    rows={2}
                    value={aiConfig.welcomeMessage}
                    onChange={(e) => {
                      updateAiConfig({ welcomeMessage: e.target.value });
                      triggerAutoSave();
                    }}
                  />
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Example:</strong> "Hi! Welcome to Artisan Living. Are you searching for custom furniture for an upcoming home project or looking for our catalog?"
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Services Catalog ({aiConfig.services?.length || 0} active)
                    </label>
                    <p className="text-xs text-slate-500">
                      Add services with brief descriptions. When prospects ask what you offer, the AI references these items.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-semibold text-slate-600">Quick starter templates:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          name: "Bespoke Dining Tables",
                          desc: "Custom solid oak and Carrara marble dining tables made to measure.",
                        },
                        {
                          name: "Architectural Millwork",
                          desc: "Built-in library shelving, cabinetry, and custom wood panels.",
                        },
                        {
                          name: "Interior Design Consultation",
                          desc: "1-on-1 virtual or on-site space planning and material curation.",
                        },
                        {
                          name: "White-Glove Delivery",
                          desc: "Full room placement, uncrating, and debris removal nationwide.",
                        },
                      ].map((tmpl) => (
                        <button
                          key={tmpl.name}
                          type="button"
                          onClick={() => handleAddService(tmpl.name, tmpl.desc)}
                          className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{tmpl.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Service title (e.g. Custom Credenzas)..."
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddService()}
                      />
                      <input
                        type="text"
                        placeholder="Short description for the AI..."
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddService()}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleAddService()}
                        disabled={!newServiceName.trim()}
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Add Service
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {(aiConfig.services || []).map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{s.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(s.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none transition-all leading-relaxed"
                          rows={2}
                          value={s.description}
                          onChange={(e) => {
                            const nextServices = aiConfig.services.map((serv) =>
                              serv.id === s.id ? { ...serv, description: e.target.value } : serv
                            );
                            updateAiConfig({ services: nextServices });
                            triggerAutoSave();
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBlock(1)}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setActiveBlock(3)}>
                    Next: Conversation Rules <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Conversation Rules */}
            {activeBlock === 3 && (
              <div className="p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span>Step 3 of 6</span>
                    <span>•</span>
                    <span>Rules &amp; Playbook</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Conversation Rules</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Set explicit boundaries for how the AI negotiates discounts, answers pricing questions, and paces customer replies.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-600">Starter rule templates:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        title: "Strict Discount Cap",
                        inst: "Never offer more than a 10% courtesy discount. For larger project requests, offer to connect them with a human sales manager.",
                      },
                      {
                        title: "One Question Pacing",
                        inst: "Ask only one qualifying question at a time to keep WhatsApp messages easy and quick to answer.",
                      },
                      {
                        title: "Price Transparency",
                        inst: "Always provide realistic starting estimates (e.g. starting at $2,500) rather than refusing to discuss costs.",
                      },
                      {
                        title: "Human Rep Escalation",
                        inst: "If a client expresses frustration or asks to speak with a manager, immediately state that a human rep is taking over.",
                      },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.title}
                        type="button"
                        onClick={() => handleAddRule(tmpl.title, tmpl.inst)}
                        className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{tmpl.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800">Add a New Rule</span>
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Rule title (e.g. Delivery Area Policy)..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                      value={newRuleTitle}
                      onChange={(e) => setNewRuleTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="Specific instruction for the AI..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                      rows={2}
                      value={newRuleInstruction}
                      onChange={(e) => setNewRuleInstruction(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleAddRule()}
                        disabled={!newRuleTitle.trim() || !newRuleInstruction.trim()}
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {(aiConfig.rules || []).map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRule(rule.id)}
                            className={`w-9 h-5 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                              rule.active ? "bg-emerald-600" : "bg-slate-200"
                            }`}
                            title={rule.active ? "Rule is active" : "Rule is paused"}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                                rule.active ? "translate-x-4" : ""
                              }`}
                            />
                          </button>
                          <span
                            className={`font-semibold text-xs sm:text-sm ${
                              rule.active ? "text-slate-900" : "text-slate-400 line-through"
                            }`}
                          >
                            {rule.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(rule.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none transition-all leading-relaxed"
                        rows={2}
                        value={rule.instruction}
                        onChange={(e) => {
                          const nextRules = aiConfig.rules.map((r) =>
                            r.id === rule.id ? { ...r, instruction: e.target.value } : r
                          );
                          updateAiConfig({ rules: nextRules });
                          triggerAutoSave();
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBlock(2)}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setActiveBlock(4)}>
                    Next: Lead Details <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Lead Details to Extract */}
            {activeBlock === 4 && (
              <div className="p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span>Step 4 of 6</span>
                    <span>•</span>
                    <span>Automatic Qualification</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Lead Details to Collect
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    As clients chat on WhatsApp, the AI quietly identifies these key details and saves them directly into your CRM.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex gap-3 text-xs text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">How Automatic Qualification Works:</p>
                    <p className="text-emerald-800 leading-relaxed text-xs">
                      No questionnaires needed. As prospects mention their budget, room type, or timeframe naturally in conversation, Conversly extracts them automatically for your sales reps.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-600">Common lead detail fields:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Estimated Budget", key: "budget" },
                      { label: "Project Timeline", key: "timeline" },
                      { label: "Room or Property Type", key: "room_type" },
                      { label: "Delivery City & State", key: "location" },
                      { label: "Room Dimensions", key: "dimensions" },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.key}
                        type="button"
                        onClick={() => handleAddField(tmpl.label, tmpl.key)}
                        className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{tmpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800">Add a Custom Lead Field</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Field Label"
                      placeholder="e.g. Move-in Date"
                      value={newFieldLabel}
                      onChange={(e) => {
                        setNewFieldLabel(e.target.value);
                        if (!newFieldKey) {
                          setNewFieldKey(e.target.value.toLowerCase().replace(/\s+/g, "_"));
                        }
                      }}
                    />
                    <Input
                      label="Internal Name (Key)"
                      placeholder="e.g. move_in_date"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleAddField()}
                      disabled={!newFieldLabel.trim()}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Add Field
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Active Fields to Extract ({aiConfig.fieldsToCollect?.length || 0})
                  </label>
                  {(aiConfig.fieldsToCollect || []).map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {field.label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          key: {field.key}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                        title="Delete field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBlock(3)}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setActiveBlock(5)}>
                    Next: Booking Links &amp; Timing <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Booking Links & Timing */}
            {activeBlock === 5 && (
              <div className="p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span>Step 5 of 6</span>
                    <span>•</span>
                    <span>Link Timing &amp; CTAs</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Booking Links &amp; Message Timing
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Prevent the AI from pushing links prematurely. Keep the conversation engaging and natural first.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">
                          Minimum Messages Before Sharing Links
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          The AI will not send calendar booking links until at least this many user messages have occurred.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            updateAiConfig({
                              minTurnsForCTA: Math.max(1, aiConfig.minTurnsForCTA - 1),
                            });
                            triggerAutoSave();
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-base w-7 text-center text-slate-900 tabular-nums">
                          {aiConfig.minTurnsForCTA}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            updateAiConfig({
                              minTurnsForCTA: aiConfig.minTurnsForCTA + 1,
                            });
                            triggerAutoSave();
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <Input
                    label="Primary Consultation Booking Link"
                    required
                    placeholder="https://calendly.com/your-business/design-consultation"
                    value={aiConfig.ctaLink}
                    onChange={(e) => {
                      updateAiConfig({ ctaLink: e.target.value });
                      triggerAutoSave();
                    }}
                    helper="Your scheduling URL (Calendly, Cal.com, or booking page). The AI will offer this when a prospect is qualified."
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBlock(4)}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setActiveBlock(6)}>
                    Next: Information to Avoid <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6: Information to Avoid */}
            {activeBlock === 6 && (
              <div className="p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span>Step 6 of 6</span>
                    <span>•</span>
                    <span>Privacy &amp; Sensitive Fields</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Information to Avoid</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Strict privacy boundaries. Topics and sensitive data the AI must never prompt for or request over WhatsApp.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-600">Common sensitive fields:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Credit card numbers",
                      "Bank routing & account numbers",
                      "Account passwords or PINs",
                      "Social Security or Tax IDs",
                      "Internal wholesale supplier pricing",
                    ].map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => handleAddShield(field)}
                        className="text-xs bg-white hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{field}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Forbidden field (e.g. Credit Card numbers)..."
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      value={newShieldField}
                      onChange={(e) => setNewShieldField(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddShield()}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddShield()}
                      disabled={!newShieldField.trim()}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Protect
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(aiConfig.restrictedFields || []).map((f) => (
                      <div
                        key={f}
                        className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-rose-950">
                            {f}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveShield(f)}
                          className="text-rose-400 hover:text-rose-700 transition-colors cursor-pointer p-1.5"
                          title="Remove restriction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Privacy Safeguard Active</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If a prospect voluntarily texts sensitive details like a credit card number, the AI acknowledges receipt safely without echoing the number, and immediately flags the conversation for human sales rep review.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBlock(5)}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExplicitSave}
                      icon={<Check className="w-4 h-4" />}
                    >
                      Save All Changes
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsTestModalOpen(true)}
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      Test in Simulator
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Prompt Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Compiled System Prompt</h3>
                  <p className="text-xs text-slate-500">
                    This is the dynamic instruction set sent to Gemini when answering WhatsApp messages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 font-mono text-xs leading-relaxed text-slate-800">
              <pre className="whitespace-pre-wrap">{buildCompiledPrompt()}</pre>
            </div>
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(buildCompiledPrompt());
                  showToast("System prompt copied to clipboard");
                }}
              >
                Copy to Clipboard
              </Button>
              <Button size="sm" onClick={() => setIsPreviewModalOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      <TestChatModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
};

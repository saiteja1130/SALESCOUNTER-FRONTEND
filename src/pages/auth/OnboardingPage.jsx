import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { apiClient } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import {
  MessageSquare,
  CheckCircle2,
  Key,
  Users,
  Smartphone,
  Bot,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { role, organization, updateOrganizationOnboarding } = useAuth();
  const { showToast } = useToast();

  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [stepError, setStepError] = useState(null);

  // Step 1: AI Personality
  const [companyName, setCompanyName] = useState("");
  const [tone, setTone] = useState("Professional & Courteous");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! Welcome to our WhatsApp service. How can we assist you today?"
  );
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState([]);

  // Step 2: Gemini
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);

  // Step 3: Sales Rep
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [invitedReps, setInvitedReps] = useState([]);
  const [repCapacity, setRepCapacity] = useState({
    maxAllowed: 1,
    currentUsed: 0,
    hasAvailableSeats: true,
  });

  // Backend Onboarding Meta
  const [onboardingMeta, setOnboardingMeta] = useState(null);

  // Redirect non-owners away from onboarding wizard
  useEffect(() => {
    if (role && role !== "owner" && role !== "admin") {
      navigate("/my-dashboard", { replace: true });
    }
  }, [role, navigate]);

  // Fetch Onboarding Status from Backend
  const fetchStatus = useCallback(async () => {
    try {
      setIsLoadingStatus(true);
      setLoadError(null);
      const res = await apiClient.get("/onboarding/status");
      if (res.success && res.onboarding) {
        const ob = res.onboarding;
        setOnboardingMeta(ob);

        // Populate step 1
        setCompanyName(ob.aiPersonality?.companyName || organization?.name || "");
        setTone(ob.aiPersonality?.tone || "Professional & Courteous");
        setWelcomeMessage(
          ob.aiPersonality?.welcomeMessage ||
            "Hello! Welcome to our WhatsApp service. How can we assist you today?"
        );
        setServices(ob.aiPersonality?.services || []);

        // Populate step 2
        setIsGeminiConfigured(Boolean(ob.geminiSetup?.isConfigured));

        // Populate step 3
        setInvitedReps(ob.inviteRep?.invitedReps || []);
        if (ob.repCapacity) {
          setRepCapacity(ob.repCapacity);
        }

        // Set resume step: first incomplete step (1..4)
        const resumeStep = ob.firstIncompleteStep || 1;
        setCurrentStep(resumeStep);
      }
    } catch (err) {
      setLoadError(err.message || "Failed to load onboarding progress from server.");
    } finally {
      setIsLoadingStatus(false);
    }
  }, [organization?.name]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const steps = [
    { num: 1, title: "AI Personality", icon: <Bot className="w-4 h-4" /> },
    { num: 2, title: "Gemini Setup", icon: <Key className="w-4 h-4" /> },
    { num: 3, title: "Invite Sales Rep", icon: <Users className="w-4 h-4" /> },
    { num: 4, title: "WhatsApp (Deferred)", icon: <Smartphone className="w-4 h-4" /> },
  ];

  const handleAddService = (e) => {
    e.preventDefault();
    if (!serviceInput.trim()) return;
    if (!services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
    }
    setServiceInput("");
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Save Step 1
  const handleSaveAiPersonality = async () => {
    setStepError(null);
    setIsSaving(true);
    try {
      const res = await apiClient.post("/onboarding/step/ai-personality", {
        companyName,
        tone,
        welcomeMessage,
        services,
      });
      if (res.success) {
        updateOrganizationOnboarding(res.onboarding);
        setOnboardingMeta(res.onboarding);
        showToast("AI personality settings saved successfully.");
        setCurrentStep(2);
      }
    } catch (err) {
      setStepError(err.message || "Failed to save AI settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Step 2
  const handleSaveGemini = async () => {
    setStepError(null);
    if (!apiKeyInput.trim() && !isGeminiConfigured) {
      setStepError("Please provide a valid Google Gemini API key to continue.");
      return;
    }

    if (!apiKeyInput.trim() && isGeminiConfigured) {
      // Key already configured on backend, proceed
      setCurrentStep(3);
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiClient.post("/onboarding/step/gemini", {
        apiKey: apiKeyInput.trim(),
      });
      if (res.success) {
        setIsGeminiConfigured(true);
        setApiKeyInput(""); // Never keep raw key in component state
        updateOrganizationOnboarding(res.onboarding);
        setOnboardingMeta(res.onboarding);
        showToast("Gemini credentials securely stored.");
        setCurrentStep(3);
      }
    } catch (err) {
      setStepError(err.message || "Failed to secure Gemini credentials. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Step 3
  const handleInviteRep = async () => {
    setStepError(null);
    if (!repName.trim() || !repEmail.trim()) {
      setStepError("Please fill in both the representative's name and work email.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiClient.post("/onboarding/step/invite-rep", {
        name: repName.trim(),
        email: repEmail.trim(),
        phone: repPhone.trim(),
      });
      if (res.success) {
        updateOrganizationOnboarding(res.onboarding);
        setOnboardingMeta(res.onboarding);
        if (res.rep) {
          setInvitedReps((prev) => {
            const filtered = prev.filter((r) => r.email !== res.rep.email);
            return [...filtered, res.rep];
          });
        }
        showToast(
          res.alreadyInvited
            ? "Sales representative information updated."
            : "Sales representative invited successfully."
        );
        setRepName("");
        setRepEmail("");
        setRepPhone("");
        setCurrentStep(4);
      }
    } catch (err) {
      setStepError(err.message || "Failed to invite sales representative.");
    } finally {
      setIsSaving(false);
    }
  };

  // Skip Step 3 without reserving seat
  const handleSkipRepStep = async () => {
    setStepError(null);
    setIsSaving(true);
    try {
      const res = await apiClient.post("/onboarding/step/skip-rep");
      if (res.success) {
        updateOrganizationOnboarding(res.onboarding);
        setOnboardingMeta(res.onboarding);
        showToast("Sales representative setup skipped. No seat reserved.");
        setCurrentStep(4);
      }
    } catch (err) {
      setStepError(err.message || "Failed to skip representative step.");
    } finally {
      setIsSaving(false);
    }
  };

  // Finish Step 4 / Complete Onboarding
  const handleComplete = async () => {
    setStepError(null);
    setIsSaving(true);
    try {
      const res = await apiClient.post("/onboarding/complete");
      if (res.success) {
        updateOrganizationOnboarding(res.onboarding);
        showToast("Onboarding completed! Welcome to your Conversly workspace.");
        navigate("/dashboard");
      }
    } catch (err) {
      setStepError(err.message || "Failed to complete onboarding.");
    } finally {
      setIsSaving(false);
    }
  };

  // Skip All to Dashboard
  const handleSkipAll = async () => {
    setStepError(null);
    setIsSaving(true);
    try {
      const res = await apiClient.post("/onboarding/skip");
      if (res.success) {
        updateOrganizationOnboarding(res.onboarding);
        showToast("Onboarding skipped. You can review or complete setup anytime from Settings.");
        navigate("/dashboard");
      }
    } catch (err) {
      setStepError(err.message || "Failed to skip onboarding.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-medium">Restoring workspace onboarding progress...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">Failed to Load Onboarding</h3>
          <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">{loadError}</p>
          <Button onClick={fetchStatus} icon={<ArrowRight className="w-4 h-4" />}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  const isStep1Done = onboardingMeta?.aiPersonality?.status === "completed";
  const isStep2Done = onboardingMeta?.geminiSetup?.status === "completed" || isGeminiConfigured;
  const isStep3Done =
    onboardingMeta?.inviteRep?.status === "completed" ||
    onboardingMeta?.inviteRep?.status === "skipped" ||
    invitedReps.length > 0;
  const allRequiredStepsDone = isStep1Done && isStep2Done && isStep3Done;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-base text-slate-900 block">
                Conversly AI Workspace Onboarding
              </span>
              <span className="text-xs text-slate-400">
                Organization: {organization?.name || "My Business"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkipAll}
            disabled={isSaving}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer disabled:opacity-50"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {steps.map((s) => {
            const isCompleted =
              (s.num === 1 && isStep1Done) ||
              (s.num === 2 && isStep2Done) ||
              (s.num === 3 && isStep3Done) ||
              (s.num === 4 && onboardingMeta?.status === "completed");
            const isCurrent = s.num === currentStep;

            const canAccess =
              s.num === 1 ||
              (s.num === 2 && isStep1Done) ||
              (s.num === 3 && isStep1Done && isStep2Done) ||
              (s.num === 4 && allRequiredStepsDone);

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => canAccess && setCurrentStep(s.num)}
                disabled={!canAccess || isSaving}
                className={`text-left group focus:outline-none ${
                  canAccess ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <div
                  className={`h-1.5 rounded-full mb-2 transition-all ${
                    isCurrent
                      ? "bg-emerald-600"
                      : isCompleted
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-medium hidden sm:flex items-center gap-1 ${
                      isCurrent
                        ? "text-slate-900 font-bold"
                        : isCompleted
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                    {s.num}. {s.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {stepError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed flex-1">{stepError}</div>
            </div>
          )}

          {/* Step 1: AI Personality */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 1: Teach Your Sales AI
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Define how Conversly AI greets prospective customers and communicates your brand tone on WhatsApp.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Business / Brand Name"
                  placeholder="e.g. Artisan Living Decor"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />

                <Select
                  label="Sales Communication Tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="Consultative Expert">
                    Consultative Expert (Polite, structured, premium advice)
                  </option>
                  <option value="Professional & Courteous">
                    Professional &amp; Courteous (Classic corporate)
                  </option>
                  <option value="High-Energy Sales">
                    High-Energy Sales (Direct closing, fast responses)
                  </option>
                  <option value="Casual & Friendly">
                    Casual &amp; Friendly (Warm, modern WhatsApp style)
                  </option>
                </Select>

                <Textarea
                  label="Welcome Message (First WhatsApp response)"
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Hello! Welcome to our store..."
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Core Products &amp; Services
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Custom Dining Tables, Interior Design"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddService(e);
                        }
                      }}
                      className="flex-1 text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <Button size="sm" variant="outline" onClick={handleAddService}>
                      Add
                    </Button>
                  </div>

                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {services.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => handleRemoveService(idx)}
                            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Step 1 of 4</span>
                <Button size="sm" onClick={handleSaveAiPersonality} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                  Save &amp; Continue
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Gemini Setup */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 2: Google Gemini AI Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Conversly AI is powered by Google Gemini for intelligent sales dialog. Credentials are encrypted on the server and never exposed in browser storage.
                </p>
              </div>

              {isGeminiConfigured && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold">Gemini API Key Securely Configured</div>
                    <div className="text-emerald-700 text-xs mt-0.5">
                      Your workspace has active encrypted credentials on file. You may provide a new key below to update it, or continue.
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>Google AI Studio Gemini API Key</span>
                </div>
                <Input
                  label="API Key"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={isGeminiConfigured ? "••••••••••••••••••••••••" : "AIzaSy..."}
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-xs text-slate-400">
                    Encrypted with AES-256 on central platform cluster.
                  </span>
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-700 hover:underline font-medium"
                  >
                    Get Free Key from Google AI Studio ↗
                  </a>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  disabled={isSaving}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  {isGeminiConfigured && !apiKeyInput.trim() ? (
                    <Button size="sm" onClick={() => setCurrentStep(3)}>
                      Continue with Stored Key
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleSaveGemini} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                      Save &amp; Continue
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Invite Sales Rep */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Step 3: Invite Your Sales Representative
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Add team members so Conversly can automatically route qualified inbound leads.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold shrink-0">
                  Seats: {repCapacity.currentUsed} / {repCapacity.maxAllowed} used
                </span>
              </div>

              {invitedReps.length > 0 && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-slate-800">
                    Provisioned Sales Representatives ({invitedReps.length}):
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {invitedReps.map((rep, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between">
                        <span className="font-medium text-slate-900">{rep.name}</span>
                        <span className="text-slate-500">{rep.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Input
                  label="Salesperson Full Name"
                  placeholder="e.g. Marcus Chen"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Work Email"
                    type="email"
                    placeholder="marcus@example.com"
                    value={repEmail}
                    onChange={(e) => setRepEmail(e.target.value)}
                  />
                  <Input
                    label="WhatsApp Mobile"
                    placeholder="+1 (555) 345-6789"
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(2)}
                  disabled={isSaving}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkipRepStep}
                    disabled={isSaving}
                  >
                    Skip Rep Setup
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleInviteRep}
                    disabled={isSaving || (!repName.trim() && !repEmail.trim())}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    Invite Representative
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: WhatsApp Connection (Deferred) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 4: WhatsApp Connection (Planned Step)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  WhatsApp direct pairing is deferred for this version and does not block your onboarding or dashboard access.
                </p>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-950">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Deferred Channel Integration</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Your core AI configuration, Gemini credentials, and team routing seats have been provisioned in the central platform. You can link your physical WhatsApp Business line at any time from <strong>Settings &gt; WhatsApp Lines</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                <div className="font-semibold text-slate-800">Setup Summary:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Brand Tone &amp; Welcome Message Configured</span>
                </div>
                <div className="flex items-center gap-2">
                  {isStep2Done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" />
                  )}
                  <span>Google Gemini 2.5 API Credentials Configured</span>
                </div>
                <div className="flex items-center gap-2">
                  {isStep3Done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" />
                  )}
                  <span>
                    {invitedReps.length > 0
                      ? `Sales Representative Seat Provisioned (${invitedReps.length} active)`
                      : "Sales Representative Routing (Skipped or Configured)"}
                  </span>
                </div>
              </div>

              {!allRequiredStepsDone && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Prerequisite setup steps are incomplete. Please finish AI Personality and Gemini API Key first, or click <strong>Skip to Dashboard</strong> above to finish later.
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(3)}
                  disabled={isSaving}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleComplete}
                  disabled={isSaving || !allRequiredStepsDone}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                  Complete Setup &amp; Launch Dashboard
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

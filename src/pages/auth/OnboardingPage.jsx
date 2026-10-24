import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import {
  MessageSquare,
  CheckCircle2,
  QrCode,
  Key,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const {
    setQrConnected,
    setGeminiApiKey,
    inviteTeamMember,
    aiConfig,
    updateAiConfig,
  } = useApp();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("AIzaSyA8_DEMO_KEY_CONVERSLY_2026");
  const [repName, setRepName] = useState("Marcus Chen");
  const [repEmail, setRepEmail] = useState("marcus@artisanliving.com");
  const [repPhone, setRepPhone] = useState("+1 (555) 345-6789");

  const steps = [
    { num: 1, title: "Connect WhatsApp" },
    { num: 2, title: "AI Personality" },
    { num: 3, title: "Gemini Setup" },
    { num: 4, title: "Invite Sales Rep" },
  ];

  const handleSimulateQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setQrScanned(true);
      setQrConnected(true);
      showToast("WhatsApp Business Account Connected (Simulated: +1 555-839-2041)");
    }, 1200);
  };

  const handleFinish = () => {
    setGeminiApiKey(apiKeyInput);
    if (repName && repEmail) {
      inviteTeamMember(repName, repEmail, repPhone);
    }
    localStorage.setItem("conversly_onboarding_completed", "true");
    showToast("Onboarding completed! Welcome to your Conversly workspace.");
    navigate("/dashboard");
  };

  const handleSkip = () => {
    localStorage.setItem("conversly_onboarding_completed", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg text-slate-900">
              Conversly AI Onboarding
            </span>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {steps.map((s) => (
            <div key={s.num} className="text-left">
              <div
                className={`h-1.5 rounded-full mb-2 transition-all ${
                  s.num < currentStep
                    ? "bg-emerald-600"
                    : s.num === currentStep
                    ? "bg-emerald-600"
                    : "bg-slate-200"
                }`}
              />
              <span
                className={`text-xs font-medium hidden sm:block ${
                  s.num === currentStep ? "text-slate-900 font-semibold" : "text-slate-400"
                }`}
              >
                {s.num}. {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Step 1: Link WhatsApp */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 1: Link WhatsApp Business
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect your business WhatsApp number so Conversly AI can listen for inbound messages and reply on your behalf.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-44 h-44 bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center shadow-xs relative shrink-0">
                  {qrScanned ? (
                    <div className="text-center text-emerald-700 animate-in zoom-in">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-600" />
                      <div className="text-xs font-semibold text-slate-900">
                        Device Linked!
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        +1 555-839-2041
                      </div>
                    </div>
                  ) : isScanning ? (
                    <div className="text-center text-slate-600">
                      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <div className="text-xs font-medium">
                        Authorizing Webhook...
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-900/5 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                      <QrCode className="w-24 h-24 text-slate-800 opacity-80" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">
                    How to link your WhatsApp:
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-500">
                    <li>Open WhatsApp on your phone.</li>
                    <li>Go to Settings &gt; Linked Devices.</li>
                    <li>Tap "Link a Device" and point your phone at this screen.</li>
                  </ol>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={handleSimulateQRScan}
                      disabled={isScanning || qrScanned}
                    >
                      {qrScanned
                        ? "Connected (+1 555-839-2041)"
                        : isScanning
                        ? "Connecting..."
                        : "Simulate QR Code Scan"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button size="sm" onClick={() => setCurrentStep(2)}>
                  Continue to AI Setup
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: AI Personality */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 2: Teach Your Sales AI
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Define how Conversly AI greets prospective customers and communicates your brand tone.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Business Name"
                  value={aiConfig.companyName}
                  onChange={(e) => updateAiConfig({ companyName: e.target.value })}
                />

                <Select
                  label="Sales Communication Tone"
                  value={aiConfig.tone}
                  onChange={(e) => updateAiConfig({ tone: e.target.value })}
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
                  value={aiConfig.welcomeMessage}
                  onChange={(e) => updateAiConfig({ welcomeMessage: e.target.value })}
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button size="sm" onClick={() => setCurrentStep(3)}>
                  Continue to Gemini API
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Gemini API */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 3: Gemini AI API Key
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Conversly AI is powered by Google Gemini 2.5 Flash for natural sales dialog and lead extraction.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>Google AI Studio Gemini API Key</span>
                </div>
                <Input
                  label="API Key"
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-xs text-slate-400">
                    Preloaded with simulated interactive demo credentials.
                  </span>
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-700 hover:underline font-medium"
                  >
                    Get Free Key ↗
                  </a>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(2)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button size="sm" onClick={() => setCurrentStep(4)}>
                  Continue to Team Setup
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Invite Rep */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Step 4: Invite Your First Sales Rep
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add team members so Conversly can automatically route qualified leads via round-robin.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Salesperson Full Name"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Work Email"
                    type="email"
                    value={repEmail}
                    onChange={(e) => setRepEmail(e.target.value)}
                  />
                  <Input
                    label="WhatsApp Mobile"
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <strong>Round-Robin Routing:</strong> Leads will automatically be assigned alternately between account owner (Elena Vance) and sales team members.
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(3)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button size="sm" onClick={handleFinish}>
                  Launch Dashboard
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

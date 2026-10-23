import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Modal } from "../../components/ui/Modal";
import {
  Smartphone,
  Key,
  Building2,
  User,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
const SettingsPage = () => {
  const { currentUser, updateCurrentUser, isOwner, role } = useAuth();
  const {
    organization,
    updateOrganization,
    qrConnected,
    setQrConnected,
    geminiApiKey,
    setGeminiApiKey,
    resetDemoData,
    leads,
    messages,
    teamMembers,
    followUpRules,
    scheduledFollowUps,
    campaigns,
    aiConfig,
  } = useApp();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || "");
  useEffect(() => {
    setProfileName(currentUser.name);
    setProfileEmail(currentUser.email);
    setProfilePhone(currentUser.phone || "");
  }, [currentUser]);
  const [orgName, setOrgName] = useState(organization.name);
  const [orgIndustry, setOrgIndustry] = useState(organization.industry);
  const [orgPhone, setOrgPhone] = useState(organization.whatsappPhone);
  useEffect(() => {
    setOrgName(organization.name);
    setOrgIndustry(organization.industry);
    setOrgPhone(organization.whatsappPhone);
  }, [organization]);
  const [apiKey, setApiKey] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const isProfileDirty =
    profileName.trim() !== currentUser.name ||
    profileEmail.trim() !== currentUser.email ||
    profilePhone.trim() !== (currentUser.phone || "");
  const isBusinessDirty =
    orgName.trim() !== organization.name ||
    orgIndustry.trim() !== organization.industry ||
    orgPhone.trim() !== organization.whatsappPhone;
  const handleTabClick = (tab) => {
    if (tab === activeTab) return;
    if (activeTab === "profile" && isProfileDirty) {
      setPendingTab(tab);
      setUnsavedModalOpen(true);
      return;
    }
    if (activeTab === "business" && isBusinessDirty) {
      setPendingTab(tab);
      setUnsavedModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };
  const handleDiscardChanges = () => {
    if (activeTab === "profile") {
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
      setProfilePhone(currentUser.phone || "");
    } else if (activeTab === "business") {
      setOrgName(organization.name);
      setOrgIndustry(organization.industry);
      setOrgPhone(organization.whatsappPhone);
    }
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setUnsavedModalOpen(false);
  };
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      showToast("Name and email are required", "error");
      return;
    }
    updateCurrentUser({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
    });
    showToast("Profile information saved and synchronized across workspace");
  };
  const handleSaveBusiness = (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      showToast("Organization name is required", "error");
      return;
    }
    updateOrganization({
      name: orgName.trim(),
      industry: orgIndustry.trim(),
      whatsappPhone: orgPhone.trim(),
    });
    showToast("Business details updated successfully");
  };
  const handleTestApiKey = () => {
    setTestingKey(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingKey(false);
      setTestResult(
        "Simulated Ping Successful: Gemini 2.5 Flash responded in 138ms with valid parameter schema (Demo Mode).",
      );
      showToast("Simulated connection verified! Latency: 138ms");
    }, 850);
  };
  const handleExportJson = () => {
    const exportPayload = {
      organization,
      leads,
      // includes each lead's notes and qualification details
      messages,
      teamMembers,
      followUpRules,
      scheduledFollowUps,
      campaigns,
      aiConfig,
      exportedAt: new Date().toISOString(),
      exportDescription:
        "Complete Conversly AI Workspace Snapshot including organization, leads with notes, WhatsApp messages, team roster, automation rules, and AI configurations.",
      version: "2.0-complete",
    };
    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversly-export-${organization.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      "Workspace backup exported successfully (leads, notes, rules, messages)",
    );
  };
  const handleResetData = () => {
    resetDemoData();
    setConfirmResetOpen(false);
    showToast("Demo data restored to initial pristine seed values");
  };
  return (
    <div className={"space-y-6"}>
      {
        <div>
          {
            <h1
              className={"text-2xl font-semibold text-slate-900 tracking-tight"}
            >
              {isOwner
                ? "Workspace & Account Settings"
                : "My Personal Profile Settings"}
            </h1>
          }
          {
            <p className={"text-xs sm:text-sm text-slate-500 mt-1"}>
              {isOwner
                ? "Configure WhatsApp simulation, Gemini AI demo credentials, organization profile, and data controls."
                : "Manage personal contact information and sales signature preferences."}
            </p>
          }
        </div>
      }
      {
        <div
          className={
            "flex items-center gap-1 overflow-x-auto border-b border-slate-200 text-xs"
          }
        >
          {
            <button
              type={"button"}
              onClick={() => handleTabClick("profile")}
              className={`flex items-center gap-2 px-3.5 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 -mb-[1px] cursor-pointer ${activeTab === "profile" ? "border-emerald-600 text-emerald-800 font-semibold bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              {<User className={"w-4 h-4"} />}
              {<span>My Profile</span>}
              {isProfileDirty && (
                <span
                  className={"w-2 h-2 rounded-full bg-amber-500"}
                  title={"Unsaved changes"}
                />
              )}
            </button>
          }
          {isOwner && (
            <Fragment>
              {
                <button
                  type={"button"}
                  onClick={() => handleTabClick("business")}
                  className={`flex items-center gap-2 px-3.5 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 -mb-[1px] cursor-pointer ${activeTab === "business" ? "border-emerald-600 text-emerald-800 font-semibold bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  {<Building2 className={"w-4 h-4"} />}
                  {<span>Business Profile</span>}
                  {isBusinessDirty && (
                    <span
                      className={"w-2 h-2 rounded-full bg-amber-500"}
                      title={"Unsaved changes"}
                    />
                  )}
                </button>
              }
              {
                <button
                  type={"button"}
                  onClick={() => handleTabClick("integrations")}
                  className={`flex items-center gap-2 px-3.5 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 -mb-[1px] cursor-pointer ${activeTab === "integrations" ? "border-emerald-600 text-emerald-800 font-semibold bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  {<Smartphone className={"w-4 h-4"} />}
                  {<span>WhatsApp &amp; Gemini (Demo)</span>}
                </button>
              }
              {
                <button
                  type={"button"}
                  onClick={() => handleTabClick("danger")}
                  className={`flex items-center gap-2 px-3.5 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 -mb-[1px] cursor-pointer ${activeTab === "danger" ? "border-rose-600 text-rose-700 font-semibold bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  {<RotateCcw className={"w-4 h-4"} />}
                  {<span>Data Controls &amp; Export</span>}
                </button>
              }
            </Fragment>
          )}
        </div>
      }
      {activeTab === "profile" && (
        <div
          className={
            "bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-5 shadow-xs"
          }
        >
          {
            <div className={"flex items-start justify-between gap-4"}>
              {
                <div>
                  {
                    <h3 className={"text-sm font-semibold text-slate-900"}>
                      Personal Account Details
                    </h3>
                  }
                  {
                    <p className={"text-xs text-slate-500 mt-0.5"}>
                      Saved updates persist in your account and update your name
                      on team assignments.
                    </p>
                  }
                </div>
              }
              {isProfileDirty && (
                <span
                  className={
                    "text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md"
                  }
                >
                  Unsaved edits pending
                </span>
              )}
            </div>
          }
          {
            <form onSubmit={handleSaveProfile} className={"space-y-4"}>
              {
                <Input
                  label={"Full Name *"}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder={"e.g. Elena Vance"}
                  required
                />
              }
              {
                <Input
                  label={"Email Address *"}
                  type={"email"}
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder={"elena@company.com"}
                  required
                />
              }
              {
                <Input
                  label={"Direct Mobile Phone"}
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder={"+1 (555) 019-2831"}
                  helper={
                    "Used for internal direct notifications and salesperson attribution."
                  }
                />
              }
              {
                <div className={"pt-2 flex items-center gap-3"}>
                  {
                    <Button
                      size={"sm"}
                      type={"submit"}
                      disabled={!isProfileDirty}
                    >
                      Save Profile Changes
                    </Button>
                  }
                  {isProfileDirty && (
                    <button
                      type={"button"}
                      onClick={() => {
                        setProfileName(currentUser.name);
                        setProfileEmail(currentUser.email);
                        setProfilePhone(currentUser.phone || "");
                      }}
                      className={
                        "text-xs text-slate-500 hover:text-slate-800 font-medium"
                      }
                    >
                      Discard Edits
                    </button>
                  )}
                </div>
              }
            </form>
          }
        </div>
      )}
      {isOwner && activeTab === "business" && (
        <div
          className={
            "bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-5 shadow-xs"
          }
        >
          {
            <div className={"flex items-start justify-between gap-4"}>
              {
                <div>
                  {
                    <h3 className={"text-sm font-semibold text-slate-900"}>
                      Organization Information
                    </h3>
                  }
                  {
                    <p className={"text-xs text-slate-500 mt-0.5"}>
                      Global business profile displayed on WhatsApp catalogs and
                      AI qualification responses.
                    </p>
                  }
                </div>
              }
              {isBusinessDirty && (
                <span
                  className={
                    "text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md"
                  }
                >
                  Unsaved edits pending
                </span>
              )}
            </div>
          }
          {
            <form onSubmit={handleSaveBusiness} className={"space-y-4"}>
              {
                <Input
                  label={"Organization Legal / Trading Name *"}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder={"e.g. Artisan Living Decor"}
                  required
                />
              }
              {
                <Input
                  label={"Industry Classification"}
                  value={orgIndustry}
                  onChange={(e) => setOrgIndustry(e.target.value)}
                  placeholder={
                    "e.g. Luxury Handcrafted Furniture & Architectural Fixtures"
                  }
                />
              }
              {
                <Input
                  label={"Primary WhatsApp Business Phone Number"}
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  placeholder={"+1 (555) 839-2041"}
                  helper={
                    "Number presented to customer inquiries on WhatsApp Click-to-Chat buttons."
                  }
                />
              }
              {
                <div className={"pt-2 flex items-center gap-3"}>
                  {
                    <Button
                      size={"sm"}
                      type={"submit"}
                      disabled={!isBusinessDirty}
                    >
                      Update Business Details
                    </Button>
                  }
                  {isBusinessDirty && (
                    <button
                      type={"button"}
                      onClick={() => {
                        setOrgName(organization.name);
                        setOrgIndustry(organization.industry);
                        setOrgPhone(organization.whatsappPhone);
                      }}
                      className={
                        "text-xs text-slate-500 hover:text-slate-800 font-medium"
                      }
                    >
                      Discard Edits
                    </button>
                  )}
                </div>
              }
            </form>
          }
        </div>
      )}
      {isOwner && activeTab === "integrations" && (
        <div className={"space-y-5 max-w-3xl"}>
          {
            <div
              className={
                "p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-3"
              }
            >
              {<Info className={"w-5 h-5 text-blue-600 shrink-0 mt-0.5"} />}
              {
                <div className={"space-y-1"}>
                  {
                    <p className={"font-semibold text-xs"}>
                      Demonstration Sandbox Environment
                    </p>
                  }
                  {
                    <p
                      className={"text-[11px] leading-relaxed text-blue-800/95"}
                    >
                      The WhatsApp Webhook Bridge and Google Gemini API below
                      run in client-side demonstration mode with simulated
                      responses. Actions simulate linking hardware and testing
                      model latency without calling external live endpoints.
                    </p>
                  }
                </div>
              }
            </div>
          }
          {
            <div
              className={
                "bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs"
              }
            >
              {
                <div
                  className={
                    "flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row"
                  }
                >
                  {
                    <div className={"flex items-center gap-3"}>
                      {
                        <div
                          className={
                            "p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"
                          }
                        >
                          {<Smartphone className={"w-5 h-5"} />}
                        </div>
                      }
                      {
                        <div>
                          {
                            <div className={"flex items-center gap-2"}>
                              {
                                <h3
                                  className={
                                    "text-sm font-semibold text-slate-900"
                                  }
                                >
                                  WhatsApp Business Gateway
                                </h3>
                              }
                              {
                                <span
                                  className={
                                    "text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                                  }
                                >
                                  Demo Simulation
                                </span>
                              }
                            </div>
                          }
                          {
                            <p className={"text-xs text-slate-500 mt-0.5"}>
                              Simulates real-time inbound chat events and
                              webhook dispatch.
                            </p>
                          }
                        </div>
                      }
                    </div>
                  }
                  {
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border self-start sm:self-center ${qrConnected ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}
                    >
                      {qrConnected
                        ? "Simulated Sandbox Linked"
                        : "Simulated Disconnected"}
                    </span>
                  }
                </div>
              }
              {
                <div
                  className={
                    "p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  }
                >
                  {
                    <div>
                      {
                        <div className={"font-semibold text-slate-800"}>
                          Apple iPhone 15 Pro \xB7 WhatsApp Business Cloud Mock
                          v24.2
                        </div>
                      }
                      {
                        <div className={"text-slate-500 mt-0.5"}>
                          Simulated Gateway: +1 (555) 839-2041 \xB7 Sandbox
                          Bridge Active \xB7 Mock Webhooks Enabled
                        </div>
                      }
                    </div>
                  }
                  {
                    <Button
                      variant={qrConnected ? "outline" : "primary"}
                      size={"sm"}
                      onClick={() => {
                        setQrConnected(!qrConnected);
                        showToast(
                          !qrConnected
                            ? "WhatsApp mock gateway linked (simulation mode)"
                            : "WhatsApp mock gateway unlinked",
                        );
                      }}
                      aria-label={
                        qrConnected
                          ? "Disconnect simulated WhatsApp gateway"
                          : "Connect simulated WhatsApp gateway"
                      }
                    >
                      {qrConnected
                        ? "Disconnect Mock Gateway"
                        : "Simulate Connect"}
                    </Button>
                  }
                </div>
              }
            </div>
          }
          {
            <div
              className={
                "bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs"
              }
            >
              {
                <div
                  className={
                    "flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row"
                  }
                >
                  {
                    <div className={"flex items-center gap-3"}>
                      {
                        <div
                          className={
                            "p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100"
                          }
                        >
                          {<Key className={"w-5 h-5"} />}
                        </div>
                      }
                      {
                        <div>
                          {
                            <div className={"flex items-center gap-2"}>
                              {
                                <h3
                                  className={
                                    "text-sm font-semibold text-slate-900"
                                  }
                                >
                                  Google Gemini AI Model Key
                                </h3>
                              }
                              {
                                <span
                                  className={
                                    "text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                                  }
                                >
                                  Local Demo Key
                                </span>
                              }
                            </div>
                          }
                          {
                            <p className={"text-xs text-slate-500 mt-0.5"}>
                              Provides conversational qualification logic and
                              product extraction.
                            </p>
                          }
                        </div>
                      }
                    </div>
                  }
                  {
                    <span
                      className={
                        "text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-center"
                      }
                    >
                      Gemini 2.5 Flash
                    </span>
                  }
                </div>
              }
              {
                <div
                  className={
                    "p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1"
                  }
                >
                  {
                    <div className={"flex items-center gap-2 font-semibold"}>
                      {
                        <ShieldAlert
                          className={"w-4 h-4 text-amber-600 shrink-0"}
                        />
                      }
                      {<span>Browser Demo Storage Limitation</span>}
                    </div>
                  }
                  {
                    <p className={"text-[11px] leading-relaxed text-amber-800"}>
                      In this demo environment, API keys are held strictly in
                      your browser's unencrypted local storage.{" "}
                      {
                        <strong>
                          Do not enter confidential production keys.
                        </strong>
                      }{" "}
                      Production deployments store and rotate secrets via Google
                      Cloud Secret Manager.
                    </p>
                  }
                </div>
              }
              {
                <div>
                  {
                    <label
                      className={
                        "block text-xs font-medium text-slate-700 mb-1.5"
                      }
                      htmlFor={"gemini-key-input"}
                    >
                      Gemini API Key (Local Demo Storage)
                    </label>
                  }
                  {
                    <div className={"relative"}>
                      {
                        <input
                          id={"gemini-key-input"}
                          type={showKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => {
                            setApiKey(e.target.value);
                            setGeminiApiKey(e.target.value);
                            setTestResult(null);
                          }}
                          aria-label={"Google Gemini API Key"}
                          className={
                            "w-full text-xs font-mono rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                          }
                        />
                      }
                      {
                        <button
                          type={"button"}
                          onClick={() => setShowKey(!showKey)}
                          aria-label={
                            showKey
                              ? "Hide Gemini API key"
                              : "Show Gemini API key"
                          }
                          className={
                            "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          }
                        >
                          {showKey ? (
                            <EyeOff className={"w-4 h-4"} />
                          ) : (
                            <Eye className={"w-4 h-4"} />
                          )}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
              {testResult && (
                <div
                  className={
                    "p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2"
                  }
                >
                  {
                    <CheckCircle2
                      className={"w-4 h-4 text-emerald-600 shrink-0 mt-0.5"}
                    />
                  }
                  {
                    <p className={"leading-relaxed font-medium"}>
                      {testResult}
                    </p>
                  }
                </div>
              )}
              {
                <div
                  className={
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2"
                  }
                >
                  {
                    <button
                      type={"button"}
                      onClick={() => {
                        setApiKey("AIzaSyA8_DEMO_KEY_CONVERSLY_2026");
                        setGeminiApiKey("AIzaSyA8_DEMO_KEY_CONVERSLY_2026");
                        setTestResult(null);
                        showToast("Populated standard demo test API key");
                      }}
                      className={
                        "text-xs text-emerald-700 hover:underline font-medium text-left cursor-pointer"
                      }
                    >
                      Use Standard Demo Key
                    </button>
                  }
                  {
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      isLoading={testingKey}
                      onClick={handleTestApiKey}
                      aria-label={"Test Gemini API connection latency"}
                    >
                      Test Latency &amp; Connection
                    </Button>
                  }
                </div>
              }
            </div>
          }
        </div>
      )}
      {isOwner && activeTab === "danger" && (
        <div className={"space-y-4 max-w-2xl"}>
          {
            <div
              className={
                "bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              }
            >
              {
                <div>
                  {
                    <h4 className={"text-xs font-semibold text-slate-900"}>
                      Export Complete Workspace Data (JSON)
                    </h4>
                  }
                  {
                    <p
                      className={"text-xs text-slate-500 mt-1 leading-relaxed"}
                    >
                      Downloads a complete snapshot of organization profile,
                      leads &amp; notes, chat transcripts, sales team roster,
                      follow-up automation rules, and AI guardrails.
                    </p>
                  }
                </div>
              }
              {
                <Button
                  size={"sm"}
                  variant={"outline"}
                  icon={<Download className={"w-4 h-4"} />}
                  onClick={handleExportJson}
                  aria-label={"Export complete workspace data as JSON"}
                  className={"shrink-0"}
                >
                  Export JSON
                </Button>
              }
            </div>
          }
          {
            <div
              className={
                "bg-rose-50/60 rounded-xl border border-rose-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              }
            >
              {
                <div>
                  {
                    <h4 className={"text-xs font-semibold text-rose-950"}>
                      Reset Demo Data to Initial Seed
                    </h4>
                  }
                  {
                    <p className={"text-xs text-rose-800 mt-1 leading-relaxed"}>
                      Clears localStorage and restores the initial seed leads,
                      messages, follow-up automations, and organization profile.
                    </p>
                  }
                </div>
              }
              {
                <Button
                  size={"sm"}
                  variant={"danger"}
                  icon={<RotateCcw className={"w-4 h-4"} />}
                  onClick={() => setConfirmResetOpen(true)}
                  aria-label={"Reset all demo data"}
                  className={"shrink-0"}
                >
                  Reset Demo
                </Button>
              }
            </div>
          }
        </div>
      )}
      {
        <ConfirmDialog
          isOpen={confirmResetOpen}
          onClose={() => setConfirmResetOpen(false)}
          onConfirm={handleResetData}
          title={"Reset Demo Data"}
          message={
            "This will clear all changes made in your local browser demo and restore the initial seed conversations, rules, and leads. Continue?"
          }
          confirmLabel={"Reset Everything"}
          isDestructive
        />
      }
      {
        <Modal
          isOpen={unsavedModalOpen}
          onClose={() => setUnsavedModalOpen(false)}
          title={"Discard Unsaved Changes?"}
          maxWidth={"md"}
          footer={
            <div className={"flex gap-2 justify-end w-full"}>
              {
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => setUnsavedModalOpen(false)}
                >
                  Stay on Page
                </Button>
              }
              {
                <Button
                  variant={"danger"}
                  size={"sm"}
                  onClick={handleDiscardChanges}
                >
                  Discard Changes
                </Button>
              }
            </div>
          }
        >
          {
            <div className={"space-y-3 text-xs text-slate-600"}>
              {
                <div
                  className={
                    "p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5"
                  }
                >
                  {
                    <AlertTriangle
                      className={"w-4 h-4 text-amber-600 shrink-0 mt-0.5"}
                    />
                  }
                  {
                    <p className={"leading-relaxed"}>
                      You have unsaved edits in your{" "}
                      {
                        <strong>
                          {activeTab === "profile"
                            ? "Profile"
                            : "Business Details"}
                        </strong>
                      }{" "}
                      tab. Navigating away will discard these modifications.
                    </p>
                  }
                </div>
              }
              {
                <p>
                  Choose {<strong>Stay on Page</strong>} to save your changes,
                  or {<strong>Discard Changes</strong>} to proceed without
                  saving.
                </p>
              }
            </div>
          }
        </Modal>
      }
    </div>
  );
};
export { SettingsPage };

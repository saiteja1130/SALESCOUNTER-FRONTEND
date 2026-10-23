import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SEED_LEADS,
  SEED_MESSAGES,
  SEED_USERS,
  SEED_ORG,
  SEED_FOLLOW_UP_RULES,
  SEED_SCHEDULED_FOLLOW_UPS,
  SEED_CAMPAIGNS,
  SEED_AI_CONFIG,
  SEED_ADMIN_ORGS,
  SEED_ACTIVITY_LOGS
} from "../data/seedData";
import { useAuth } from "./AuthContext";
const AppContext = createContext(void 0);
const STORAGE_KEYS = {
  LEADS: "conversly_leads_v2",
  MESSAGES: "conversly_messages_v2",
  TEAM: "conversly_team_v2",
  RULES: "conversly_rules_v2",
  SCHEDULED: "conversly_scheduled_v2",
  CAMPAIGNS: "conversly_campaigns_v2",
  ORG: "conversly_org_v2",
  AI_CONFIG: "conversly_ai_config_v2",
  ROUND_ROBIN: "conversly_round_robin_v2",
  ADDON: "conversly_addon_v2",
  QR: "conversly_qr_connected_v2",
  GEMINI_KEY: "conversly_gemini_key_v2"
};
const normalizeLeadStatus = (raw) => {
  if (raw === "Contacted") return "Interested";
  if (raw === "Follow-up" || raw === "in-followup") return "In-followup";
  if (raw === "intrested" || raw === "Intrested") return "Interested";
  if (raw === "new") return "New";
  if (raw === "converted") return "Converted";
  if (raw === "lost") return "Lost";
  if (["New", "Interested", "In-followup", "Converted", "Lost"].includes(raw)) {
    return raw;
  }
  return "Interested";
};
const AppProvider = ({ children }) => {
  const { currentUser, role, salespersonCanViewAllLeads } = useAuth();
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      const rawLeads = saved ? JSON.parse(saved) : SEED_LEADS;
      return rawLeads.map((l) => ({
        ...l,
        status: normalizeLeadStatus(l.status)
      }));
    } catch {
      return SEED_LEADS.map((l) => ({
        ...l,
        status: normalizeLeadStatus(l.status)
      }));
    }
  });
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : SEED_MESSAGES;
    } catch {
      return SEED_MESSAGES;
    }
  });
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
      return saved ? JSON.parse(saved) : SEED_USERS.filter((u) => u.organizationId === "org-artisan");
    } catch {
      return SEED_USERS.filter((u) => u.organizationId === "org-artisan");
    }
  });
  const [followUpRules, setFollowUpRules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RULES);
      return saved ? JSON.parse(saved) : SEED_FOLLOW_UP_RULES;
    } catch {
      return SEED_FOLLOW_UP_RULES;
    }
  });
  const [scheduledFollowUps, setScheduledFollowUps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULED);
      return saved ? JSON.parse(saved) : SEED_SCHEDULED_FOLLOW_UPS;
    } catch {
      return SEED_SCHEDULED_FOLLOW_UPS;
    }
  });
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return saved ? JSON.parse(saved) : SEED_CAMPAIGNS;
    } catch {
      return SEED_CAMPAIGNS;
    }
  });
  const [organization, setOrganization] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORG);
      return saved ? JSON.parse(saved) : SEED_ORG;
    } catch {
      return SEED_ORG;
    }
  });
  const [aiConfig, setAiConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
      if (!saved) return SEED_AI_CONFIG;
      const parsed = JSON.parse(saved);
      return {
        ...SEED_AI_CONFIG,
        ...parsed,
        // Explicitly handle nested arrays to avoid overwriting with undefined if not present in old storage
        services: parsed.services || SEED_AI_CONFIG.services,
        rules: parsed.rules || SEED_AI_CONFIG.rules,
        fieldsToCollect: parsed.fieldsToCollect || SEED_AI_CONFIG.fieldsToCollect,
        restrictedFields: parsed.restrictedFields || SEED_AI_CONFIG.restrictedFields,
        documents: parsed.documents || SEED_AI_CONFIG.documents,
        products: parsed.products || SEED_AI_CONFIG.products
      };
    } catch {
      return SEED_AI_CONFIG;
    }
  });
  const [roundRobinEnabled, setRoundRobinEnabledState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUND_ROBIN);
    return saved !== null ? saved === "true" : true;
  });
  const [campaignsAddonUnlocked, setCampaignsAddonUnlockedState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADDON);
    return saved !== null ? saved === "true" : true;
  });
  const [qrConnected, setQrConnectedState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QR);
    return saved !== null ? saved === "true" : true;
  });
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || "AIzaSyA8_DEMO_KEY_CONVERSLY_2026";
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
  }, [teamMembers]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(followUpRules));
  }, [followUpRules]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(scheduledFollowUps));
  }, [scheduledFollowUps]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(organization));
  }, [organization]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(aiConfig));
  }, [aiConfig]);
  useEffect(() => {
    if (!currentUser) return;
    setTeamMembers(
      (prev) => prev.map(
        (m) => m.id === currentUser.id ? {
          ...m,
          name: currentUser.name || m.name,
          email: currentUser.email || m.email,
          phone: currentUser.phone !== void 0 ? currentUser.phone : m.phone
        } : m
      )
    );
  }, [currentUser.name, currentUser.email, currentUser.phone, currentUser.id]);
  const setRoundRobinEnabled = (val) => {
    setRoundRobinEnabledState(val);
    localStorage.setItem(STORAGE_KEYS.ROUND_ROBIN, String(val));
  };
  const setCampaignsAddonUnlocked = (val) => {
    setCampaignsAddonUnlockedState(val);
    localStorage.setItem(STORAGE_KEYS.ADDON, String(val));
  };
  const setQrConnected = (val) => {
    setQrConnectedState(val);
    localStorage.setItem(STORAGE_KEYS.QR, String(val));
  };
  const filteredLeads = React.useMemo(() => {
    if (role === "owner") {
      return leads;
    }
    if (salespersonCanViewAllLeads) {
      return leads;
    }
    return leads.filter((l) => l.assignedToId === currentUser.id);
  }, [leads, role, currentUser.id, salespersonCanViewAllLeads]);
  const addLead = (leadData) => {
    const newId = `lead-${Date.now()}`;
    const newLead = {
      ...leadData,
      id: newId,
      createdAt: ( new Date()).toISOString(),
      lastContactAt: ( new Date()).toISOString(),
      notes: []
    };
    setLeads((prev) => [newLead, ...prev]);
    const welcomeMsg = {
      id: `msg-${Date.now()}`,
      leadId: newId,
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: aiConfig.welcomeMessage.replace("{{lead_name}}", newLead.name),
      timestamp: ( new Date()).toISOString(),
      isDelivered: true,
      isRead: true
    };
    setMessages((prev) => ({
      ...prev,
      [newId]: [welcomeMsg]
    }));
    return newLead;
  };
  const updateLead = (id, updates) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...updates } : l));
  };
  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };
  const assignLead = (leadId, assigneeId) => {
    const assignee = teamMembers.find((t) => t.id === assigneeId);
    if (!assignee) return;
    setLeads(
      (prev) => prev.map(
        (l) => l.id === leadId ? {
          ...l,
          assignedToId: assignee.id,
          assignedToName: assignee.name
        } : l
      )
    );
  };
  const changeLeadStatus = (leadId, status) => {
    setLeads(
      (prev) => prev.map((l) => l.id === leadId ? { ...l, status, lastContactAt: ( new Date()).toISOString() } : l)
    );
  };
  const addLeadNote = (leadId, text) => {
    const newNote = {
      id: `note-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      text,
      createdAt: ( new Date()).toISOString()
    };
    setLeads(
      (prev) => prev.map((l) => l.id === leadId ? { ...l, notes: [newNote, ...l.notes] } : l)
    );
  };
  const toggleAiHandling = (leadId) => {
    setLeads(
      (prev) => prev.map((l) => l.id === leadId ? { ...l, aiHandled: !l.aiHandled } : l)
    );
  };
  const sendMessage = (leadId, text, senderOverride) => {
    const targetLead = leads.find((l) => l.id === leadId);
    const sender = senderOverride || (role === "owner" || role === "salesperson" ? "salesperson" : "lead");
    const senderName = sender === "lead" ? targetLead?.name || "Customer" : currentUser.name;
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      leadId,
      sender,
      senderName,
      text,
      timestamp: ( new Date()).toISOString(),
      isDelivered: true,
      isRead: false
    };
    setMessages((prev) => ({
      ...prev,
      [leadId]: [...prev[leadId] || [], newMsg]
    }));
    setLeads(
      (prev) => prev.map(
        (l) => l.id === leadId ? { ...l, lastContactAt: ( new Date()).toISOString(), needsAttention: false } : l
      )
    );
    if (sender === "lead" && targetLead?.aiHandled) {
      setTimeout(() => {
        simulateAiResponse(leadId, text);
      }, 1200);
    }
  };
  const simulateAiResponse = (leadId, customQuestion) => {
    const targetLead = leads.find((l) => l.id === leadId);
    let reply = `Thank you for your message! Our consultative sales specialist has logged this detail for the ${targetLead?.collectedData?.interestedProduct || "Artisan Living Collection"}.`;
    if (customQuestion && /price|cost|quote|budget/i.test(customQuestion)) {
      reply = `Our trade pricing for this handcrafted collection starts at $3,250 with commercial volume tiers available. Would you like me to reserve a priority design slot for you?`;
    } else if (customQuestion && /delivery|ship|timeline|when/i.test(customQuestion)) {
      reply = `Standard white-glove transit to your location takes 4\u20136 business days once released from our workshop. Would you prefer a weekday or Saturday morning delivery slot?`;
    }
    const aiMsg = {
      id: `ai-${Date.now()}`,
      leadId,
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: reply,
      timestamp: ( new Date()).toISOString(),
      isDelivered: true,
      isRead: true
    };
    setMessages((prev) => ({
      ...prev,
      [leadId]: [...prev[leadId] || [], aiMsg]
    }));
  };
  const addFollowUpRule = (ruleData) => {
    const newRule = {
      ...ruleData,
      id: `rule-${Date.now()}`
    };
    setFollowUpRules((prev) => [...prev, newRule]);
  };
  const updateFollowUpRule = (ruleId, updates) => {
    setFollowUpRules(
      (prev) => prev.map((r) => r.id === ruleId ? { ...r, ...updates } : r)
    );
  };
  const toggleFollowUpRule = (ruleId) => {
    setFollowUpRules(
      (prev) => prev.map((r) => r.id === ruleId ? { ...r, isActive: !r.isActive } : r)
    );
  };
  const deleteFollowUpRule = (ruleId) => {
    setFollowUpRules((prev) => prev.filter((r) => r.id !== ruleId));
  };
  const triggerScheduledNow = (id) => {
    setScheduledFollowUps(
      (prev) => prev.map((s) => s.id === id ? { ...s, status: "completed" } : s)
    );
    const target = scheduledFollowUps.find((s) => s.id === id);
    if (target) {
      sendMessage(target.leadId, target.messagePreview, "salesperson");
    }
  };
  const postponeScheduled = (id) => {
    setScheduledFollowUps(
      (prev) => prev.map((s) => {
        if (s.id !== id) return s;
        const current = new Date(s.scheduledTime);
        current.setHours(current.getHours() + 24);
        return { ...s, scheduledTime: current.toISOString() };
      })
    );
  };
  const cancelScheduled = (id) => {
    setScheduledFollowUps(
      (prev) => prev.map((s) => s.id === id ? { ...s, status: "cancelled" } : s)
    );
  };
  const inviteTeamMember = (name, email, phone) => {
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
    const newMember = {
      id: `user-rep-${Date.now()}`,
      name,
      email,
      phone,
      role: "salesperson",
      avatar: initials,
      assignedLeadsCount: 0,
      conversionRate: 0,
      status: "active",
      organizationId: "org-artisan"
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };
  const toggleTeamMemberStatus = (userId) => {
    setTeamMembers(
      (prev) => prev.map((u) => u.id === userId ? { ...u, status: u.status === "active" ? "paused" : "active" } : u)
    );
  };
  const removeTeamMember = (userId) => {
    setTeamMembers((prev) => prev.filter((u) => u.id !== userId));
  };
  const createCampaign = (campaignData) => {
    const newCamp = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      deliveredCount: 0,
      readCount: 0,
      repliedCount: 0,
      convertedCount: 0,
      createdAt: ( new Date()).toISOString()
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };
  const updateAiConfig = (updates) => {
    setAiConfig((prev) => ({ ...prev, ...updates }));
  };
  const updateOrganization = (updates) => {
    setOrganization((prev) => ({ ...prev, ...updates }));
  };
  const resetDemoData = () => {
    localStorage.clear();
    setLeads(SEED_LEADS);
    setMessages(SEED_MESSAGES);
    setTeamMembers(SEED_USERS.filter((u) => u.organizationId === "org-artisan"));
    setFollowUpRules(SEED_FOLLOW_UP_RULES);
    setScheduledFollowUps(SEED_SCHEDULED_FOLLOW_UPS);
    setCampaigns(SEED_CAMPAIGNS);
    setOrganization(SEED_ORG);
    setAiConfig(SEED_AI_CONFIG);
    setRoundRobinEnabledState(true);
    setCampaignsAddonUnlockedState(true);
    setQrConnectedState(true);
  };
  return (
    <AppContext.Provider
      value={{
        leads,
        filteredLeads,
        messages,
        teamMembers,
        followUpRules,
        scheduledFollowUps,
        campaigns,
        organization,
        aiConfig,
        adminOrgs: SEED_ADMIN_ORGS,
        activityLogs: SEED_ACTIVITY_LOGS,
        roundRobinEnabled,
        campaignsAddonUnlocked,
        qrConnected,
        geminiApiKey,
        setGeminiApiKey,
        setQrConnected,
        setRoundRobinEnabled,
        setCampaignsAddonUnlocked,
        addLead,
        updateLead,
        deleteLead,
        assignLead,
        changeLeadStatus,
        addLeadNote,
        toggleAiHandling,
        sendMessage,
        simulateAiResponse,
        addFollowUpRule,
        updateFollowUpRule,
        toggleFollowUpRule,
        deleteFollowUpRule,
        triggerScheduledNow,
        postponeScheduled,
        cancelScheduled,
        inviteTeamMember,
        toggleTeamMemberStatus,
        removeTeamMember,
        createCampaign,
        updateAiConfig,
        updateOrganization,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
export {
  AppProvider,
  useApp
};
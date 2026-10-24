import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "../api/client";
import { whatsappApi } from "../api/whatsapp";
import { getSocket } from "../utils/socket";

const AppContext = createContext(undefined);

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

const EMPTY_AI_CONFIG = {
  companyName: "",
  tone: "Professional & Courteous",
  welcomeMessage: "Hello! Welcome to our WhatsApp service. How can we assist you today?",
  services: [],
  rules: [],
  fieldsToCollect: [],
  restrictedFields: [],
  documents: [],
  products: []
};

const EMPTY_ORG = {
  name: "",
  industry: "",
  timezone: "Asia/Kolkata",
  logo: ""
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
  const {
    currentUser,
    role,
    salespersonCanViewAllLeads,
    isAuthenticated,
    organization: authOrganization,
    updateOrganizationState,
  } = useAuth();

  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [messages,setMessages]=useState([])
  const [seatUsage, setSeatUsage] = useState({
    maxAllowed: 1,
    currentUsed: 0,
    available: 1,
    plan: "trial",
    repAddons: 0,
  });

  const [followUpRules, setFollowUpRules] = useState([]);
  const [scheduledFollowUps, setScheduledFollowUps] = useState([]);
  const [quietHoursSettings, setQuietHoursSettings] = useState({
    enabled: true,
    quietStart: "21:00",
    quietEnd: "08:00",
    morningReleaseTime: "08:15",
    timezone: "Asia/Kolkata",
  });
  const [isFollowUpsLoading, setIsFollowUpsLoading] = useState(false);

  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [organization, setOrganization] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORG);
      return saved ? JSON.parse(saved) : EMPTY_ORG;
    } catch {
      return EMPTY_ORG;
    }
  });

  const [aiConfig, setAiConfig] = useState(EMPTY_AI_CONFIG);
  const [isAiConfigLoading, setIsAiConfigLoading] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  const [roundRobinEnabled, setRoundRobinEnabledState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUND_ROBIN);
    return saved !== null ? saved === "true" : true;
  });
  const [campaignsAddonUnlocked, setCampaignsAddonUnlockedState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADDON);
    return saved !== null ? saved === "true" : false;
  });
  const [qrConnected, setQrConnectedState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QR);
    return saved !== null ? saved === "true" : false;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(organization));
  }, [organization]);

  useEffect(() => {
    if (authOrganization) {
      setOrganization((prev) => ({
        ...prev,
        ...authOrganization,
        name: authOrganization.name || prev.name,
        industry: authOrganization.industry || prev.industry || "",
        whatsappPhone: authOrganization.whatsappPhone || prev.whatsappPhone || "",
        timezone: authOrganization.timezone || prev.timezone || "Asia/Kolkata",
        logo: authOrganization.logo || prev.logo || "",
      }));
    }
  }, [authOrganization]);
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
  }, [currentUser?.name, currentUser?.email, currentUser?.phone, currentUser?.id]);
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
  const [entitlementUsage, setEntitlementUsage] = useState(null);

  const refreshUsage = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get("/entitlements/usage");
      if (res.success) {
        setEntitlementUsage(res.usage);
      }
    } catch {
      // Backend offline or starting up
    }
  }, [isAuthenticated]);

  const fetchLeads = useCallback(async () => {
    if (!isAuthenticated) {
      setLeads([]);
      return;
    }
    try {
      let allLeads = [];
      let page = 1;
      let totalPages = 1;

      do {
        const res = await apiClient.get(`/leads?page=${page}&limit=200`);
        if (res.success && Array.isArray(res.leads)) {
          allLeads = allLeads.concat(res.leads);
          totalPages = res.totalPages || res.pagination?.totalPages || 1;
          page++;
        } else {
          break;
        }
      } while (page <= totalPages);

      setLeads(allLeads);
    } catch {
      // Backend offline or starting up
    }
  }, [isAuthenticated]);

  const fetchTeamMembers = useCallback(async () => {
    if (!isAuthenticated) {
      setTeamMembers([]);
      setInvitations([]);
      return;
    }
    try {
      if (role === "owner" || role === "admin") {
        const res = await apiClient.get("/team");
        if (res.success) {
          if (Array.isArray(res.members)) setTeamMembers(res.members);
          if (Array.isArray(res.invitations)) setInvitations(res.invitations);
          if (res.seatUsage) setSeatUsage(res.seatUsage);
          return;
        }
      }

      // Sales representative fallback
      const res = await apiClient.get("/leads/team-members");
      if (res.success && Array.isArray(res.teamMembers)) {
        setTeamMembers(res.teamMembers);
      }
    } catch {
      // Backend offline or starting up
    }
  }, [isAuthenticated, role]);

  const fetchAiConfig = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsAiConfigLoading(true);
      const res = await apiClient.get("/ai/config");
      if (res.success && res.config) {
        setAiConfig(res.config);
        setHasGeminiKey(Boolean(res.config.hasGeminiKey));
      }
    } catch {
      // Backend offline or starting up
    } finally {
      setIsAiConfigLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFollowUps = useCallback(async () => {
    if (!isAuthenticated) {
      setFollowUpRules([]);
      setScheduledFollowUps([]);
      return;
    }
    try {
      setIsFollowUpsLoading(true);
      const [rulesRes, scheduledRes, quietRes] = await Promise.all([
        apiClient.get("/follow-ups/rules").catch(() => ({ success: false })),
        apiClient.get("/follow-ups/scheduled").catch(() => ({ success: false })),
        apiClient.get("/follow-ups/quiet-hours").catch(() => ({ success: false })),
      ]);

      if (rulesRes?.success && Array.isArray(rulesRes.rules)) {
        setFollowUpRules(rulesRes.rules);
      }
      if (scheduledRes?.success && Array.isArray(scheduledRes.scheduled)) {
        setScheduledFollowUps(scheduledRes.scheduled);
      }
      if (quietRes?.success && quietRes.quietHours) {
        setQuietHoursSettings(quietRes.quietHours);
      }
    } catch {
      // Backend offline or starting up
    } finally {
      setIsFollowUpsLoading(false);
    }
  }, [isAuthenticated]);

  const [whatsappConnections, setWhatsappConnections] = useState([]);
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);


  const fetchWhatsAppConnections = useCallback(async () => {
    if (!isAuthenticated) {
      setWhatsappConnections([]);
      return;
    }
    try {
      setIsWhatsAppLoading(true);
      const res = await whatsappApi.getConnections();
      if (res?.success && Array.isArray(res.connections)) {
        setWhatsappConnections(res.connections);
        const anyConnected = res.connections.some((c) => c.status === "connected");
        setQrConnectedState(anyConnected);
      }
    } catch {
      // Backend offline or starting up
    } finally {
      setIsWhatsAppLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshUsage();
    fetchLeads();
    fetchTeamMembers();
    fetchAiConfig();
    fetchFollowUps();
    fetchWhatsAppConnections();
  }, [refreshUsage, fetchLeads, fetchTeamMembers, fetchAiConfig, fetchFollowUps, fetchWhatsAppConnections]);

  const fetchMessages = useCallback(async (leadId) => {
    if (!isAuthenticated || !leadId) return;
    try {
      const res = await apiClient.get(`/leads/${leadId}/messages`);
      if (res?.success && Array.isArray(res.messages)) {
        setMessages((prev) => ({
          ...prev,
          [leadId]: res.messages,
        }));
      }
    } catch {
      // Backend offline or starting up
    }
  }, [isAuthenticated]);

  // Real-time Socket.IO subscriptions for WhatsApp events
  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = getSocket();
    const handleSocketConnect = () => {
      // Socket events are transient; refetch authoritative state after reconnect.
      fetchWhatsAppConnections();
      fetchLeads();
      refreshUsage();
    };

    const handleConnStatus = (data) => {
      setWhatsappConnections((prev) => {
        const index = prev.findIndex((c) => c._id === data.connectionId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...data };
          const anyConnected = updated.some((c) => c.status === "connected");
          setQrConnectedState(anyConnected);
          return updated;
        } else {
          fetchWhatsAppConnections();
          return prev;
        }
      });
    };

    const handleLeadUpdate = () => {
      fetchLeads();
      refreshUsage();
    };

    const handleMessageReceived = (data) => {
      if (data?.leadId) {
        fetchMessages(data.leadId);
      }
      fetchLeads();
    };

    const handleMessageUpdated = (data) => {
      if (data?.leadId) {
        fetchMessages(data.leadId);
      }
    };

    socket.on("connect", handleSocketConnect);
    socket.on("whatsapp:connection_status", handleConnStatus);
    socket.on("whatsapp:lead_updated", handleLeadUpdate);
    socket.on("whatsapp:message_received", handleMessageReceived);
    socket.on("whatsapp:message_updated", handleMessageUpdated);

    return () => {
      socket.off("connect", handleSocketConnect);
      socket.off("whatsapp:connection_status", handleConnStatus);
      socket.off("whatsapp:lead_updated", handleLeadUpdate);
      socket.off("whatsapp:message_received", handleMessageReceived);
      socket.off("whatsapp:message_updated", handleMessageUpdated);
    };
  }, [isAuthenticated, fetchWhatsAppConnections, fetchLeads, refreshUsage, fetchMessages]);

  const filteredLeads = React.useMemo(() => {
    if (role === "owner" || role === "admin") {
      return leads;
    }
    if (salespersonCanViewAllLeads) {
      return leads;
    }
    return leads.filter((l) => {
      const repId = l.assignedToId?._id || l.assignedToId;
      return repId === currentUser?.id || l.email === currentUser?.email;
    });
  }, [leads, role, currentUser?.id, currentUser?.email, salespersonCanViewAllLeads]);

  const addLead = async (leadData) => {
    let serverLead = null;
    let quotaInfo = null;

    if (isAuthenticated) {
      const targetAssignee =
        leadData.assignedToId === "unassigned" || leadData.assignedToId === null || leadData.assignedToId === ""
          ? "unassigned"
          : leadData.assignedToId || "round-robin";

      const res = await apiClient.post("/leads", {
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        status: leadData.status || "New",
        source: leadData.source || "WhatsApp Inbound",
        assignedToId: targetAssignee,
        collectedData: leadData.collectedData || {},
        whatsappPhoneNumber: leadData.whatsappPhoneNumber || "+1 (555) 839-2041",
      });
      serverLead = res.lead;
      quotaInfo = res.quota;
      refreshUsage();
      fetchTeamMembers();
    }

    const newId = serverLead?.id || serverLead?._id || `lead-${Date.now()}`;
    const newLead = serverLead || {
      ...leadData,
      id: newId,
      createdAt: new Date().toISOString(),
      lastContactAt: new Date().toISOString(),
      notes: [],
    };
    setLeads((prev) => [newLead, ...prev.filter((l) => l.id !== newId)]);

    const welcomeMsg = {
      id: `msg-${Date.now()}`,
      leadId: newId,
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: (aiConfig?.welcomeMessage || "Hello! Welcome to our WhatsApp service.").replace("{{lead_name}}", newLead.name),
      timestamp: new Date().toISOString(),
      isDelivered: true,
      isRead: true,
    };
    setMessages((prev) => ({
      ...prev,
      [newId]: [welcomeMsg],
    }));
    return { newLead, quotaInfo };
  };

  const updateLead = async (id, updates) => {
    if (isAuthenticated) {
      try {
        const res = await apiClient.put(`/leads/${id}`, updates);
        if (res.success && res.lead) {
          setLeads((prev) => prev.map((l) => (l.id === id ? res.lead : l)));
          return res.lead;
        }
      } catch (err) {
        throw err;
      }
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLead = async (id) => {
    if (isAuthenticated) {
      try {
        await apiClient.delete(`/leads/${id}`);
        refreshUsage();
      } catch (err) {
        throw err;
      }
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const assignLead = async (leadId, assigneeId) => {
    if (isAuthenticated) {
      try {
        const res = await apiClient.post(`/leads/${leadId}/assign`, {
          assignedToId: assigneeId,
        });
        if (res.success && res.lead) {
          setLeads((prev) => prev.map((l) => (l.id === leadId ? res.lead : l)));
          fetchTeamMembers();
          return res.lead;
        }
      } catch (err) {
        throw err;
      }
    }
    const assignee = teamMembers.find((t) => t.id === assigneeId);
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedToId: assignee ? assignee.id : null,
              assignedToName: assignee ? assignee.name : "Unassigned",
            }
          : l
      )
    );
  };

  const changeLeadStatus = async (leadId, status) => {
    return updateLead(leadId, { status });
  };

  const bulkAssignLeads = async (leadIds, assigneeId) => {
    if (isAuthenticated) {
      try {
        const res = await apiClient.post("/leads/bulk-assign", {
          leadIds,
          assignedToId: assigneeId,
        });
        fetchLeads();
        fetchTeamMembers();
        return res;
      } catch (err) {
        throw err;
      }
    }
  };

  const bulkStatusUpdate = async (leadIds, status) => {
    if (isAuthenticated) {
      try {
        const res = await apiClient.post("/leads/bulk-status", {
          leadIds,
          status,
        });
        fetchLeads();
        return res;
      } catch (err) {
        throw err;
      }
    }
  };
  const addLeadNote = (leadId, text) => {
    const newNote = {
      id: `note-${Date.now()}`,
      authorId: currentUser?.id,
      authorName: currentUser?.name || "User",
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
  const sendMessage = async (leadId, text, senderOverride) => {
    const targetLead = leads.find((l) => l.id === leadId);
    const sender = senderOverride || (role === "owner" || role === "salesperson" ? "salesperson" : "lead");
    const senderName = sender === "lead" ? targetLead?.name || "Customer" : currentUser?.name || "Sales Representative";
    const tempId = `msg-${Date.now()}`;
    const newMsg = {
      id: tempId,
      leadId,
      sender,
      senderName,
      text,
      timestamp: (new Date()).toISOString(),
      isDelivered: false,
      isRead: false,
      sendStatus: sender === "lead" ? "sent" : "queued",
    };

    setMessages((prev) => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), newMsg],
    }));

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, lastContactAt: (new Date()).toISOString(), needsAttention: false } : l
      )
    );

    if (isAuthenticated && sender !== "lead") {
      try {
        const res = await apiClient.post(`/leads/${leadId}/messages`, { text });
        if (!res?.success || !res.message) {
          throw new Error(res?.message || "WhatsApp did not accept the message.");
        }
        setMessages((prev) => ({
          ...prev,
          [leadId]: (() => {
            const current = prev[leadId] || [];
            const alreadySynced = current.find((m) => m.id === res.message.id);
            if (alreadySynced) {
              return current.filter((m) => m.id !== tempId);
            }
            return current.map((m) => (m.id === tempId ? res.message : m));
          })(),
        }));
        return res.message;
      } catch (err) {
        console.error("[SendMessage Error]", err);
        setMessages((prev) => ({
          ...prev,
          [leadId]: (prev[leadId] || []).map((m) =>
            m.id === tempId ? { ...m, sendStatus: "failed", isDelivered: false } : m
          ),
        }));
        throw err;
      }
    } else if (sender === "lead" && targetLead?.aiHandled) {
      setTimeout(() => {
        simulateAiResponse(leadId, text);
      }, 1200);
    }
    return newMsg;
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

  const addFollowUpRule = async (ruleData) => {
    if (isAuthenticated) {
      const res = await apiClient.post("/follow-ups/rules", ruleData);
      await fetchFollowUps();
      return res;
    }
  };

  const updateFollowUpRule = async (ruleId, updates) => {
    if (isAuthenticated) {
      const res = await apiClient.put(`/follow-ups/rules/${ruleId}`, updates);
      await fetchFollowUps();
      return res;
    }
  };

  const toggleFollowUpRule = async (ruleId) => {
    if (isAuthenticated) {
      const res = await apiClient.patch(`/follow-ups/rules/${ruleId}/status`);
      await fetchFollowUps();
      return res;
    }
  };

  const deleteFollowUpRule = async (ruleId) => {
    if (isAuthenticated) {
      const res = await apiClient.delete(`/follow-ups/rules/${ruleId}`);
      await fetchFollowUps();
      return res;
    }
  };

  const saveQuietHours = async (settings) => {
    if (isAuthenticated) {
      const res = await apiClient.put("/follow-ups/quiet-hours", settings);
      if (res.success && res.quietHours) {
        setQuietHoursSettings(res.quietHours);
      }
      return res;
    }
  };

  const triggerScheduledNow = async (id) => {
    if (isAuthenticated) {
      const res = await apiClient.post(`/follow-ups/scheduled/${id}/trigger`);
      await fetchFollowUps();
      await fetchLeads();
      return res;
    }
  };

  const postponeScheduled = async (id) => {
    if (isAuthenticated) {
      const res = await apiClient.post(`/follow-ups/scheduled/${id}/postpone`);
      await fetchFollowUps();
      return res;
    }
  };

  const cancelScheduled = async (id) => {
    if (isAuthenticated) {
      const res = await apiClient.post(`/follow-ups/scheduled/${id}/cancel`);
      await fetchFollowUps();
      return res;
    }
  };
  const inviteTeamMember = async (name, email, phone) => {
    if (isAuthenticated) {
      const res = await apiClient.post("/team/invitations", { name, email, phone });
      await fetchTeamMembers();
      return res;
    }
  };

  const resendInvitation = async (invitationId) => {
    if (isAuthenticated) {
      const res = await apiClient.post(`/team/invitations/${invitationId}/resend`);
      await fetchTeamMembers();
      return res;
    }
  };

  const revokeInvitation = async (invitationId) => {
    if (isAuthenticated) {
      const res = await apiClient.post(`/team/invitations/${invitationId}/revoke`);
      await fetchTeamMembers();
      return res;
    }
  };

  const changeTeamMemberStatus = async (userId, newStatus) => {
    if (isAuthenticated) {
      const res = await apiClient.patch(`/team/${userId}/status`, { status: newStatus });
      await fetchTeamMembers();
      return res;
    }
  };

  const toggleTeamMemberStatus = async (userId) => {
    const member = teamMembers.find((m) => m.id === userId);
    if (!member) return;
    const nextStatus = member.status === "active" ? "paused" : "active";
    return changeTeamMemberStatus(userId, nextStatus);
  };

  const removeTeamMember = async (userId, options = {}) => {
    if (isAuthenticated) {
      const res = await apiClient.delete(`/team/${userId}`, {
        data: {
          reassignOption: options.reassignOption || "unassign",
          reassignTargetId: options.reassignTargetId,
        },
      });
      await fetchTeamMembers();
      await fetchLeads();
      return res;
    }
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

  const saveAiConfig = async (configOverride) => {
    if (isAuthenticated) {
      const payload = {
        ...(configOverride || aiConfig),
        expectedRevision: (configOverride || aiConfig)?.revision,
      };
      const res = await apiClient.put("/ai/config", payload);
      if (res.success && res.config) {
        setAiConfig(res.config);
        setHasGeminiKey(Boolean(res.config.hasGeminiKey));
        return res.config;
      }
    }
  };

  const publishAiConfig = async () => {
    if (isAuthenticated) {
      const res = await apiClient.post("/ai/publish");
      if (res.success && res.config) {
        setAiConfig(res.config);
        setHasGeminiKey(Boolean(res.config.hasGeminiKey));
        return res.config;
      }
    }
  };

  const testAiConversation = async (messages, configOverride) => {
    if (isAuthenticated) {
      const res = await apiClient.post("/ai/test", {
        config: configOverride || aiConfig,
        messages,
      });
      return res.result;
    }
  };

  const saveGeminiKey = async (apiKey) => {
    if (isAuthenticated) {
      const res = await apiClient.post("/ai/gemini-key", { apiKey });
      if (res.success) {
        setHasGeminiKey(true);
        try {
          localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
        } catch {}
        return res;
      }
    }
  };

  const updateOrganization = async (updates) => {
    if (isAuthenticated) {
      const res = await apiClient.patch("/organization", updates);
      if (res.success && res.organization) {
        setOrganization(res.organization);
        if (updateOrganizationState) {
          updateOrganizationState(res.organization);
        }
        return res.organization;
      }
      return res;
    } else {
      setOrganization((prev) => ({ ...prev, ...updates }));
    }
  };
  const resetDemoData = () => {
    localStorage.clear();
    setLeads([]);
    setMessages({});
    setTeamMembers([]);
    setFollowUpRules([]);
    setScheduledFollowUps([]);
    setCampaigns([]);
    setOrganization(EMPTY_ORG);
    setAiConfig(EMPTY_AI_CONFIG);
    setRoundRobinEnabledState(true);
    setCampaignsAddonUnlockedState(false);
    setQrConnectedState(false);
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
        adminOrgs: [],
        activityLogs: [],
        roundRobinEnabled,
        campaignsAddonUnlocked,
        entitlementUsage,
        refreshUsage,
        qrConnected,
        setQrConnected,
        whatsappConnections,
        fetchWhatsAppConnections,
        isWhatsAppLoading,
        setRoundRobinEnabled,
        setCampaignsAddonUnlocked,
        addLead,
        updateLead,
        deleteLead,
        assignLead,
        bulkAssignLeads,
        bulkStatusUpdate,
        fetchLeads,
        fetchMessages,
        fetchTeamMembers,
        changeLeadStatus,
        addLeadNote,
        toggleAiHandling,
        sendMessage,
        simulateAiResponse,
        addFollowUpRule,
        updateFollowUpRule,
        toggleFollowUpRule,
        deleteFollowUpRule,
        saveQuietHours,
        quietHoursSettings,
        isFollowUpsLoading,
        fetchFollowUps,
        triggerScheduledNow,
        postponeScheduled,
        cancelScheduled,
        invitations,
        seatUsage,
        inviteTeamMember,
        resendInvitation,
        revokeInvitation,
        changeTeamMemberStatus,
        toggleTeamMemberStatus,
        removeTeamMember,
        createCampaign,
        updateAiConfig,
        saveAiConfig,
        publishAiConfig,
        testAiConversation,
        fetchAiConfig,
        saveGeminiKey,
        isAiConfigLoading,
        hasGeminiKey,
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

const SEED_USERS = [
  {
    id: "user-owner",
    name: "Elena Vance",
    email: "elena@artisanliving.com",
    role: "owner",
    phone: "+1 (555) 234-5678",
    avatar: "EV",
    assignedLeadsCount: 4,
    conversionRate: 34.2,
    status: "active",
    organizationId: "org-artisan"
  },
  {
    id: "user-rep1",
    name: "Marcus Chen",
    email: "marcus@artisanliving.com",
    role: "salesperson",
    phone: "+1 (555) 345-6789",
    avatar: "MC",
    assignedLeadsCount: 6,
    conversionRate: 29.5,
    status: "active",
    organizationId: "org-artisan"
  },
  {
    id: "user-rep2",
    name: "Sarah Jenkins",
    email: "sarah@artisanliving.com",
    role: "salesperson",
    phone: "+1 (555) 456-7890",
    avatar: "SJ",
    assignedLeadsCount: 5,
    conversionRate: 31,
    status: "active",
    organizationId: "org-artisan"
  }
];
const SEED_ORG = {
  id: "org-artisan",
  name: "Artisan Living Decor",
  industry: "Interior Furnishings & Architecture",
  plan: "Growth",
  status: "Active",
  seatsUsed: 3,
  seatsLimit: 5,
  leadsThisMonth: 184,
  leadsLimit: 2500,
  aiMessagesThisMonth: 1420,
  aiMessagesLimit: 1e4,
  createdAt: "2026-01-15T08:00:00Z",
  whatsappPhone: "+1 (555) 839-2041",
  ownerName: "Elena Vance",
  ownerEmail: "elena@artisanliving.com"
};
const SEED_LEADS = [
  {
    id: "lead-1",
    name: "Liam Gallagher",
    phone: "+1 (555) 392-1049",
    email: "liam.g@gallagher-design.io",
    status: "Interested",
    assignedToId: "user-rep1",
    // Marcus
    assignedToName: "Marcus Chen",
    createdAt: "2026-10-22T14:32:00Z",
    lastContactAt: "2026-10-23T08:15:00Z",
    source: "WhatsApp Inbound",
    tags: ["Commercial Office", "Bulk Inquiry", "High Priority"],
    aiHandled: false,
    needsAttention: true,
    notes: [
      {
        id: "note-1",
        authorId: "user-rep1",
        authorName: "Marcus Chen",
        text: "Client is outfitting 14 executive meeting rooms. Requested swatch kits and material catalogs.",
        createdAt: "2026-10-22T16:00:00Z"
      }
    ],
    collectedData: {
      interestedProduct: "Verona Solid Oak Executive Conference Table & Chairs",
      budgetRange: "Commercial Contract",
      preferredTimeline: "Within 30 Days",
      deliveryCity: "Chicago, IL",
      quantity: "14 tables, 56 chairs",
      notes: "Requires certificate of flame retardant compliance."
    }
  },
  {
    id: "lead-2",
    name: "Sophia Martinez",
    phone: "+1 (555) 481-9203",
    email: "sophia@martinezstudio.com",
    status: "In-followup",
    assignedToId: "user-rep1",
    // Marcus
    assignedToName: "Marcus Chen",
    createdAt: "2026-10-21T09:15:00Z",
    lastContactAt: "2026-10-22T11:40:00Z",
    source: "Website Click-to-Chat",
    tags: ["Residential", "Custom Finishes"],
    aiHandled: true,
    needsAttention: false,
    notes: [
      {
        id: "note-2",
        authorId: "user-rep1",
        authorName: "Marcus Chen",
        text: "AI collected room dimensions and walnut wood preference. Follow-up automated for delivery estimate.",
        createdAt: "2026-10-21T10:00:00Z"
      }
    ],
    collectedData: {
      interestedProduct: "Kanso Modular Sectional in Boucle Sand",
      budgetRange: "Residential Suite",
      preferredTimeline: "Immediate Delivery",
      deliveryCity: "Austin, TX",
      quantity: "1 complete set"
    }
  },
  {
    id: "lead-3",
    name: "Alexander Wright",
    phone: "+1 (555) 720-3841",
    email: "alex@wrightestates.com",
    status: "Interested",
    assignedToId: "user-rep2",
    // Sarah
    assignedToName: "Sarah Jenkins",
    createdAt: "2026-10-23T06:20:00Z",
    lastContactAt: "2026-10-23T07:45:00Z",
    source: "Instagram Ad",
    tags: ["Luxury Villa", "Full Home Package"],
    aiHandled: true,
    needsAttention: false,
    notes: [],
    collectedData: {
      interestedProduct: "Whole Home Architectural Package (Living + Dining + Patio)",
      budgetRange: "Bespoke Package",
      preferredTimeline: "Next 60 Days",
      deliveryCity: "Scottsdale, AZ"
    }
  },
  {
    id: "lead-4",
    name: "Nadia Petrov",
    phone: "+1 (555) 819-2045",
    email: "nadia.p@horizonconsult.com",
    status: "Converted",
    assignedToId: "user-rep1",
    // Marcus
    assignedToName: "Marcus Chen",
    createdAt: "2026-10-18T11:00:00Z",
    lastContactAt: "2026-10-22T17:30:00Z",
    source: "WhatsApp Inbound",
    tags: ["Confirmed Client", "VIP Client"],
    aiHandled: false,
    needsAttention: false,
    notes: [
      {
        id: "note-3",
        authorId: "user-owner",
        authorName: "Elena Vance",
        text: "Order confirmed and contract finalized. Production batch #408 scheduled.",
        createdAt: "2026-10-22T17:30:00Z"
      }
    ],
    collectedData: {
      interestedProduct: "Tivoli Marble Dining Suite + 8 Solstice Chairs",
      preferredTimeline: "3 weeks",
      deliveryCity: "New York, NY"
    }
  },
  {
    id: "lead-5",
    name: "David Kim",
    phone: "+1 (555) 602-9912",
    email: "dkim@kimarchitects.org",
    status: "New",
    assignedToId: "user-owner",
    // Elena
    assignedToName: "Elena Vance",
    createdAt: "2026-10-23T08:04:00Z",
    lastContactAt: "2026-10-23T08:05:00Z",
    source: "WhatsApp Inbound",
    tags: ["Architectural Specifier"],
    aiHandled: true,
    needsAttention: true,
    notes: [],
    collectedData: {
      interestedProduct: "Acoustic Wall Panels & Custom Credenza",
      deliveryCity: "Seattle, WA"
    }
  },
  {
    id: "lead-6",
    name: "Camila Rodriguez",
    phone: "+1 (555) 948-1123",
    email: "camila@boutiquehotels.cr",
    status: "Interested",
    assignedToId: "user-rep2",
    // Sarah
    assignedToName: "Sarah Jenkins",
    createdAt: "2026-10-20T15:20:00Z",
    lastContactAt: "2026-10-22T16:10:00Z",
    source: "Website Click-to-Chat",
    tags: ["Hospitality", "Resort Project"],
    aiHandled: false,
    needsAttention: false,
    notes: [
      {
        id: "note-4",
        authorId: "user-rep2",
        authorName: "Sarah Jenkins",
        text: "Hotel opening in February. Sent CAD models for guestroom outdoor daybeds.",
        createdAt: "2026-10-21T12:00:00Z"
      }
    ],
    collectedData: {
      interestedProduct: "24 Custom Teak Pool Loungers & Umbrellas",
      preferredTimeline: "January 2027",
      deliveryCity: "Miami, FL"
    }
  },
  {
    id: "lead-7",
    name: "Benjamin Foster",
    phone: "+1 (555) 304-8821",
    status: "Lost",
    assignedToId: "user-rep1",
    // Marcus
    assignedToName: "Marcus Chen",
    createdAt: "2026-10-15T10:00:00Z",
    lastContactAt: "2026-10-18T14:00:00Z",
    source: "Instagram Ad",
    tags: ["Timeline Incompatible"],
    aiHandled: false,
    needsAttention: false,
    notes: [
      {
        id: "note-5",
        authorId: "user-rep1",
        authorName: "Marcus Chen",
        text: "Client required 24h delivery which was outside custom manufacturing capability.",
        createdAt: "2026-10-18T14:00:00Z"
      }
    ],
    collectedData: {
      interestedProduct: "Nordic Low Credenza"
    }
  },
  {
    id: "lead-8",
    name: "Olivia Sterling",
    phone: "+1 (555) 554-1290",
    email: "olivia@sterlinginteriors.com",
    status: "In-followup",
    assignedToId: "user-owner",
    // Elena
    assignedToName: "Elena Vance",
    createdAt: "2026-10-19T13:40:00Z",
    lastContactAt: "2026-10-23T07:10:00Z",
    source: "Website Click-to-Chat",
    tags: ["Interior Designer", "Repeat Client"],
    aiHandled: true,
    needsAttention: false,
    notes: [],
    collectedData: {
      interestedProduct: "Kyoto Pendant Lights (Brass) & Solis Credenza",
      deliveryCity: "San Francisco, CA"
    }
  }
];
const SEED_MESSAGES = {
  "lead-1": [
    {
      id: "m1-1",
      leadId: "lead-1",
      sender: "lead",
      senderName: "Liam Gallagher",
      text: "Hello! I saw your Verona conference tables featured in Architectural Digest. We are outfitting 14 conference rooms for our new regional HQ.",
      timestamp: "2026-10-22T14:32:00Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m1-2",
      leadId: "lead-1",
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: "Hello Liam, welcome to Artisan Living! Congratulations on the new HQ. The Verona solid oak table is handcrafted with integrated wire management and premium matte finish. For 14 conference rooms, we also offer custom dimensions and commercial tier discounts.",
      timestamp: "2026-10-22T14:32:15Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m1-3",
      leadId: "lead-1",
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: "To provide an accurate quote and estimated delivery window, what city will these be shipped to, and what is your target installation date?",
      timestamp: "2026-10-22T14:32:45Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m1-4",
      leadId: "lead-1",
      sender: "lead",
      senderName: "Liam Gallagher",
      text: "We are in Chicago, IL. Target installation is within 30-45 days. Our budget for tables and chairs is roughly $8,000 to $12,000. Can we get material finish samples sent over?",
      timestamp: "2026-10-22T14:38:00Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m1-5",
      leadId: "lead-1",
      sender: "salesperson",
      senderName: "Marcus Chen",
      text: "Hi Liam, Marcus here from the Enterprise Accounts team taking over! I can absolutely courier our oak and walnut sample box directly to your Chicago office by tomorrow morning. What is the best suite number to address it to?",
      timestamp: "2026-10-23T08:15:00Z",
      isDelivered: true,
      isRead: true
    }
  ],
  "lead-2": [
    {
      id: "m2-1",
      leadId: "lead-2",
      sender: "lead",
      senderName: "Sophia Martinez",
      text: "Hi there, do you have the Kanso modular sectional available in Boucle Sand fabric?",
      timestamp: "2026-10-21T09:15:00Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m2-2",
      leadId: "lead-2",
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: "Hi Sophia! Yes, we have 4 units of the Kanso Modular Sectional in Boucle Sand currently in stock and ready for freight dispatch. It features spill-resistant natural linen boucle with high-density ergonomic down filling.",
      timestamp: "2026-10-21T09:15:20Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m2-3",
      leadId: "lead-2",
      sender: "lead",
      senderName: "Sophia Martinez",
      text: "Wonderful! What would white-glove delivery cost to Austin, Texas?",
      timestamp: "2026-10-21T09:18:00Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m2-4",
      leadId: "lead-2",
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: "Standard white-glove room-of-choice placement and packaging removal to Austin is $240. If ordered this week, delivery takes 4 to 6 business days. Would you like me to hold a unit with our special 10% seasonal courtesy code?",
      timestamp: "2026-10-21T09:19:00Z",
      isDelivered: true,
      isRead: true
    }
  ],
  "lead-3": [
    {
      id: "m3-1",
      leadId: "lead-3",
      sender: "lead",
      senderName: "Alexander Wright",
      text: "Saw your Instagram reel for the modern desert home collection. Do you do bespoke packages for high-end properties?",
      timestamp: "2026-10-23T06:20:00Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m3-2",
      leadId: "lead-3",
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: "Good morning Alexander! Yes, our Bespoke Estates service provides curated furniture packages for luxury architectural residences, including 3D space planning and finish matching.",
      timestamp: "2026-10-23T06:20:30Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m3-3",
      leadId: "lead-3",
      sender: "lead",
      senderName: "Alexander Wright",
      text: "Excellent. Property is in Scottsdale, AZ. Estimated total budget is over $12,000. Sarah or Elena can ping me.",
      timestamp: "2026-10-23T07:45:00Z",
      isDelivered: true,
      isRead: true
    }
  ],
  "lead-5": [
    {
      id: "m5-1",
      leadId: "lead-5",
      sender: "lead",
      senderName: "David Kim",
      text: "Inquiring about fire-rated acoustic wall panelling for a tech office project in Seattle. Do you have spec sheets?",
      timestamp: "2026-10-23T08:04:00Z",
      isDelivered: true,
      isRead: true
    },
    {
      id: "m5-2",
      leadId: "lead-5",
      sender: "ai",
      senderName: "Conversly AI (Artisan Assistant)",
      text: "Hello David! Yes, our Sona Acoustic Oak Slats carry ASTM E84 Class A fire certification and NRC rating of 0.85. Connecting you directly with our architectural specifications team right now.",
      timestamp: "2026-10-23T08:05:00Z",
      isDelivered: true,
      isRead: true
    }
  ]
};
const SEED_FOLLOW_UP_RULES = [
  {
    id: "rule-1",
    title: "Interested Lead 24h Gentle Touchpoint",
    triggerCondition: "inactive_hours",
    delayHours: 24,
    targetStatus: "Interested",
    messageTemplate: "Hi {{lead_name}}, Marcus from Artisan Living here! Just wanted to check if you had any questions regarding the {{interested_product}} or if you need finish swatches sent over?",
    actionType: "ai_send_whatsapp",
    quietHoursEnabled: true,
    quietHoursStart: "21:00",
    quietHoursEnd: "08:00",
    isActive: true
  },
  {
    id: "rule-2",
    title: "New Lead Instant Handoff Notification",
    triggerCondition: "inactive_hours",
    delayHours: 2,
    targetStatus: "New",
    messageTemplate: "Reminder: New high-value WhatsApp inquiry from {{lead_name}} awaiting sales assignment.",
    actionType: "notify_salesperson",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    isActive: true
  },
  {
    id: "rule-3",
    title: "Post-Quote 48h Follow-up Check",
    triggerCondition: "status_changed",
    delayHours: 48,
    targetStatus: "In-followup",
    messageTemplate: "Hello {{lead_name}}, checking in on your project timeline for {{delivery_city}}. We can hold the current manufacturing window for 3 more days.",
    actionType: "ai_send_whatsapp",
    quietHoursEnabled: true,
    quietHoursStart: "20:00",
    quietHoursEnd: "08:30",
    isActive: true
  }
];
const SEED_SCHEDULED_FOLLOW_UPS = [
  {
    id: "sched-1",
    leadId: "lead-2",
    leadName: "Sophia Martinez",
    leadPhone: "+1 (555) 481-9203",
    assignedToId: "user-rep1",
    assignedToName: "Marcus Chen",
    ruleTitle: "Interested Lead 24h Gentle Touchpoint",
    scheduledTime: "2026-10-23T15:00:00Z",
    messagePreview: "Hi Sophia, Marcus from Artisan Living here! Just wanted to check if you had any questions regarding the Kanso Modular Sectional...",
    status: "pending"
  },
  {
    id: "sched-2",
    leadId: "lead-8",
    leadName: "Olivia Sterling",
    leadPhone: "+1 (555) 554-1290",
    assignedToId: "user-owner",
    assignedToName: "Elena Vance",
    ruleTitle: "Post-Quote 48h Follow-up Check",
    scheduledTime: "2026-10-23T18:30:00Z",
    messagePreview: "Hello Olivia, checking in on your project timeline for San Francisco, CA...",
    status: "pending"
  },
  {
    id: "sched-3",
    leadId: "lead-6",
    leadName: "Camila Rodriguez",
    leadPhone: "+1 (555) 948-1123",
    assignedToId: "user-rep2",
    assignedToName: "Sarah Jenkins",
    ruleTitle: "Interested Lead 24h Gentle Touchpoint",
    scheduledTime: "2026-10-24T10:00:00Z",
    messagePreview: "Hi Camila, Sarah here! Just wanted to verify if the CAD files for the teak loungers loaded properly...",
    status: "pending"
  },
  {
    id: "sched-4",
    leadId: "lead-4",
    leadName: "Nadia Petrov",
    leadPhone: "+1 (555) 819-2045",
    assignedToId: "user-rep1",
    assignedToName: "Marcus Chen",
    ruleTitle: "Post-Purchase Production Confirmation",
    scheduledTime: "2026-10-22T17:30:00Z",
    messagePreview: "Thank you for your deposit! Your production order has been assigned.",
    status: "completed"
  }
];
const SEED_CAMPAIGNS = [
  {
    id: "camp-1",
    name: "Autumn Living VIP Catalog Drop",
    audienceFilter: "interested",
    targetCount: 142,
    deliveredCount: 139,
    readCount: 118,
    repliedCount: 42,
    convertedCount: 12,
    status: "completed",
    scheduledDate: "2026-10-12T14:00:00Z",
    templateMessage: "Exclusive early access: Discover our new Handcrafted Travertine & Oak dining capsule before public launch. Reply VIP for private pricing.",
    createdAt: "2026-10-10T09:00:00Z"
  },
  {
    id: "camp-2",
    name: "End-of-Quarter Hospitality Outreach",
    audienceFilter: "all_leads",
    targetCount: 260,
    deliveredCount: 254,
    readCount: 201,
    repliedCount: 68,
    convertedCount: 18,
    status: "completed",
    scheduledDate: "2026-09-25T11:00:00Z",
    templateMessage: "Planning winter renovations? Artisan Living is offering complimentary white-glove freight on commercial orders confirmed by month-end.",
    createdAt: "2026-09-20T10:00:00Z"
  },
  {
    id: "camp-3",
    name: "Holiday Pre-Order Privilege List",
    audienceFilter: "converted",
    targetCount: 88,
    deliveredCount: 0,
    readCount: 0,
    repliedCount: 0,
    convertedCount: 0,
    status: "scheduled",
    scheduledDate: "2026-11-05T15:00:00Z",
    templateMessage: "Thank you for choosing Artisan Living this year! As a valued patron, reserve your holiday dining expansion table with priority white-glove slot.",
    createdAt: "2026-10-20T16:00:00Z"
  }
];
const SEED_AI_CONFIG = {
  // Block 1
  agentName: "Marcus",
  agentRole: "Design Consultant",
  companyName: "Artisan Living Decor",
  businessDescription: "High-end contemporary residential & commercial architectural furnishings, custom dining suites, modular boucl\xE9 seating, and bespoke hospitality furniture handcrafted in North America.",
  maxWords: 55,
  antiAiGuardrails: `NEVER say: "Got it!", "Hey there", "Awesome!", "Great!", "Perfect!", "I'd be happy to help", "Certainly!". Do not start messages with praise or cheerleading. Avoid exclamation marks.`,
  tone: "Consultative Expert",
  // Block 2
  welcomeMessage: "Hello! Welcome to Artisan Living Decor. I am your WhatsApp Sales Specialist. How may I assist with your interior or architectural design project today?",
  services: [
    { id: "s1", name: "Custom Dining Suites", description: "Handcrafted solid oak & walnut dining tables tailored to spatial dimensions." },
    { id: "s2", name: "Modular Boucl\xE9 Seating", description: "Architectural sectional seating in stain-resistant performance boucl\xE9 fabric." },
    { id: "s3", name: "Commercial & Trade Consultation", description: "Dedicated trade pricing and custom millwork specs for architects and designers." },
    { id: "s4", name: "White-Glove Delivery & Installation", description: "Room-of-choice placement, unboxing, assembly, and debris removal." }
  ],
  // Block 3
  rules: [
    { id: "r1", title: "Conversational Pacing", instruction: "Ask at most 1\u20132 missing fields per message. Never interrogate like a robot.", active: true },
    { id: "r2", title: "Context Awareness & Deduction", instruction: "If the customer provides details in prose, deduce the fields without re-asking.", active: true },
    { id: "r3", title: "Strict Truthfulness", instruction: "Never guess, estimate, or hallucinate prices not found in knowledge base.", active: true },
    { id: "r4", title: "Human Handoff", instruction: "If the user requests a human or talks off-topic, smoothly transfer to a representative and pause the AI.", active: true }
  ],
  // Block 4
  fieldsToCollect: [
    { id: "f-1", label: "Interested Product", key: "interestedProduct", required: true },
    { id: "f-2", label: "Budget Range", key: "budgetRange", required: true },
    { id: "f-3", label: "Timeline", key: "preferredTimeline", required: true },
    { id: "f-4", label: "Delivery City", key: "deliveryCity", required: true }
  ],
  // Block 5
  minTurnsForCTA: 3,
  ctaLink: "https://booking.artisanliving.com/consultation",
  // Block 6
  restrictedFields: ["Passwords", "OTP", "Credit Card", "Callback Time"],
  // Legacy/Support
  businessHours: "Monday - Friday: 8:00 AM - 7:00 PM CST, Saturday: 9:00 AM - 4:00 PM CST",
  fallbackPhone: "+1 (555) 839-2041",
  maxDiscountPercent: 10,
  humanHandoffKeywords: ["talk to human", "call me", "speak with manager", "discount", "contract terms", "custom CAD", "complaint"],
  systemInstructions: "You are an articulate, professional luxury furniture design consultant for Artisan Living Decor on WhatsApp. Your goals: 1) Understand the customer project type (residential, commercial office, hospitality). 2) Collect key qualifying information: product of interest, timeline, budget range, and delivery city. 3) Provide accurate product dimensions, material specs, and lead times. 4) If a client asks for commercial volume or custom quotes, offer to connect them with their dedicated sales executive (Marcus or Sarah). Do not offer discounts exceeding 10% without managerial approval.",
  documents: [],
  products: []
};
const SEED_ADMIN_ORGS = [
  SEED_ORG,
  {
    id: "org-novahome",
    name: "Nova Home Living",
    industry: "Home & Kitchen Appliances",
    plan: "Enterprise",
    status: "Active",
    seatsUsed: 14,
    seatsLimit: 20,
    leadsThisMonth: 1240,
    leadsLimit: 1e4,
    aiMessagesThisMonth: 9840,
    aiMessagesLimit: 5e4,
    createdAt: "2025-11-10T10:00:00Z",
    whatsappPhone: "+1 (555) 749-1102",
    ownerName: "Julian Sterling",
    ownerEmail: "julian@novahome.com"
  },
  {
    id: "org-apexauto",
    name: "Apex Mobility Motors",
    industry: "Automotive Dealership",
    plan: "Enterprise",
    status: "Active",
    seatsUsed: 18,
    seatsLimit: 20,
    leadsThisMonth: 2190,
    leadsLimit: 1e4,
    aiMessagesThisMonth: 18400,
    aiMessagesLimit: 5e4,
    createdAt: "2025-08-22T09:30:00Z",
    whatsappPhone: "+1 (555) 601-3829",
    ownerName: "Carlos Vega",
    ownerEmail: "carlos@apexmobility.io"
  },
  {
    id: "org-clarityskin",
    name: "Clarity Aesthetic Dermatology",
    industry: "Healthcare & Wellness",
    plan: "Growth",
    status: "Active",
    seatsUsed: 4,
    seatsLimit: 5,
    leadsThisMonth: 410,
    leadsLimit: 2500,
    aiMessagesThisMonth: 2950,
    aiMessagesLimit: 1e4,
    createdAt: "2026-02-14T11:00:00Z",
    whatsappPhone: "+1 (555) 399-4410",
    ownerName: "Dr. Evelyn Reed",
    ownerEmail: "evelyn@claritydermatology.com"
  },
  {
    id: "org-peakrealty",
    name: "Peak Horizon Properties",
    industry: "Commercial Real Estate",
    plan: "Growth",
    status: "Active",
    seatsUsed: 5,
    seatsLimit: 5,
    leadsThisMonth: 620,
    leadsLimit: 2500,
    aiMessagesThisMonth: 3890,
    aiMessagesLimit: 1e4,
    createdAt: "2026-03-01T14:20:00Z",
    whatsappPhone: "+1 (555) 912-7703",
    ownerName: "Mason Brooks",
    ownerEmail: "mbrooks@peakhorizon.com"
  },
  {
    id: "org-solarflow",
    name: "SolarFlow Renewables",
    industry: "Clean Energy & Solar",
    plan: "Basic",
    status: "Trial",
    seatsUsed: 1,
    seatsLimit: 1,
    leadsThisMonth: 82,
    leadsLimit: 500,
    aiMessagesThisMonth: 410,
    aiMessagesLimit: 2e3,
    createdAt: "2026-10-10T12:00:00Z",
    whatsappPhone: "+1 (555) 438-9920",
    ownerName: "Zara Morales",
    ownerEmail: "zara@solarflow.energy"
  },
  {
    id: "org-zenithfitness",
    name: "Zenith Performance Gear",
    industry: "Fitness Equipment",
    plan: "Basic",
    status: "Active",
    seatsUsed: 1,
    seatsLimit: 1,
    leadsThisMonth: 194,
    leadsLimit: 500,
    aiMessagesThisMonth: 950,
    aiMessagesLimit: 2e3,
    createdAt: "2026-05-18T16:00:00Z",
    whatsappPhone: "+1 (555) 820-1492",
    ownerName: "Derek Watts",
    ownerEmail: "dwatts@zenithfit.com"
  },
  {
    id: "org-luxehorology",
    name: "Chronos Atelier Watches",
    industry: "Luxury Goods & Jewelry",
    plan: "Growth",
    status: "Suspended",
    seatsUsed: 2,
    seatsLimit: 5,
    leadsThisMonth: 0,
    leadsLimit: 2500,
    aiMessagesThisMonth: 0,
    aiMessagesLimit: 1e4,
    createdAt: "2025-10-05T09:00:00Z",
    whatsappPhone: "+1 (555) 194-8832",
    ownerName: "Henri Laurent",
    ownerEmail: "henri@chronosatelier.ch"
  }
];
const SEED_ACTIVITY_LOGS = [
  {
    id: "act-1",
    timestamp: "2026-10-23T08:15:00Z",
    organizationId: "org-artisan",
    organizationName: "Artisan Living Decor",
    userId: "user-rep1",
    userName: "Marcus Chen",
    action: "Took over conversation from AI",
    category: "ai",
    details: "Salesperson Marcus Chen assumed manual control of WhatsApp chat with Liam Gallagher ($8,400 pipeline)"
  },
  {
    id: "act-2",
    timestamp: "2026-10-23T08:05:00Z",
    organizationId: "org-artisan",
    organizationName: "Artisan Living Decor",
    userId: "ai-system",
    userName: "Conversly AI Agent",
    action: "Lead qualification completed",
    category: "lead",
    details: "Extracted budget ($4k-6k) and delivery location (Seattle, WA) for lead David Kim"
  },
  {
    id: "act-3",
    timestamp: "2026-10-23T07:12:00Z",
    organizationId: "org-apexauto",
    organizationName: "Apex Mobility Motors",
    userId: "user-apex-2",
    userName: "Sofia Alverez",
    action: "Test drive scheduled",
    category: "lead",
    details: "Automated WhatsApp confirmation sent for 2027 Lucid Air demo drive"
  },
  {
    id: "act-4",
    timestamp: "2026-10-23T06:45:00Z",
    organizationId: "org-artisan",
    organizationName: "Artisan Living Decor",
    userId: "system",
    userName: "Round-Robin Engine",
    action: "Lead auto-assigned",
    category: "team",
    details: "Assigned new lead Alexander Wright to Sarah Jenkins via weighted round-robin"
  },
  {
    id: "act-5",
    timestamp: "2026-10-22T17:30:00Z",
    organizationId: "org-artisan",
    organizationName: "Artisan Living Decor",
    userId: "user-owner",
    userName: "Elena Vance",
    action: "Lead marked Converted",
    category: "lead",
    details: "Nadia Petrov converted (order confirmed and production scheduled)"
  },
  {
    id: "act-6",
    timestamp: "2026-10-22T14:10:00Z",
    organizationId: "org-novahome",
    organizationName: "Nova Home Living",
    userId: "user-nova-1",
    userName: "Julian Sterling",
    action: "Plan upgraded to Enterprise",
    category: "billing",
    details: "Upgraded subscription tier to Enterprise (20 seats, 10k leads/mo)"
  }
];
export {
  SEED_ACTIVITY_LOGS,
  SEED_ADMIN_ORGS,
  SEED_AI_CONFIG,
  SEED_CAMPAIGNS,
  SEED_FOLLOW_UP_RULES,
  SEED_LEADS,
  SEED_MESSAGES,
  SEED_ORG,
  SEED_SCHEDULED_FOLLOW_UPS,
  SEED_USERS
};

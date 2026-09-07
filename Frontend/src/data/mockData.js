export const initialTickets = [
  {
    id: "TICK-1001",
    customer: {
      name: "Sarah Jenkins",
      email: "sarah.j@acme-corp.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      tier: "Enterprise Customer",
      joinedDate: "Jan 2024"
    },
    subject: "API Rate limiting errors on production endpoints",
    category: "Technical Support",
    priority: "High",
    status: "Open",
    assignedTo: "AI Assistant (Auto)",
    createdAt: "10 minutes ago",
    sentiment: "Frustrated",
    aiConfidence: 0.94,
    intent: "Bug / Rate Limit Increase",
    summary: "Customer hitting 429 Too Many Requests error despite being on Enterprise Tier with high volume limits.",
    aiSuggestedReply: "Hello Sarah, I understand your production environment is impacted by API rate limits. I checked your Enterprise tier configuration and noticed your custom rate limit policy was reset during yesterday's deployment. I have raised your limit to 50,000 req/min immediately and queued a permanent fix.",
    suggestedArticles: [
      { id: "KB-201", title: "Enterprise API Quotas & Custom Rate Limits" },
      { id: "KB-105", title: "Troubleshooting 429 HTTP Responses" }
    ],
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Hi support team! We are suddenly getting flooded with HTTP 429 Too Many Requests response code on our production sync server. We are on the Enterprise plan and shouldn't be rate-limited at 1,000 req/min. Please fix this urgently!",
        timestamp: "10:14 AM"
      },
      {
        id: "m2",
        sender: "ai",
        text: "Hello Sarah! I'm analyzing your account logs right now. I detected that a rate limit threshold flag was reset during the maintenance window at 02:00 UTC. Let me offer a draft response to our team lead or apply an immediate override.",
        timestamp: "10:15 AM",
        isAiDraft: false
      }
    ]
  },
  {
    id: "TICK-1002",
    customer: {
      name: "Marcus Vance",
      email: "marcus.vance@techfront.io",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      tier: "Pro Plan",
      joinedDate: "Mar 2024"
    },
    subject: "Request for invoice receipt for August billing",
    category: "Billing & Subscriptions",
    priority: "Medium",
    status: "AI Handled",
    assignedTo: "AI Assistant",
    createdAt: "45 minutes ago",
    sentiment: "Neutral",
    aiConfidence: 0.98,
    intent: "Invoice Retrieval",
    summary: "Customer requested August 2026 invoice PDF download link.",
    aiSuggestedReply: "Hi Marcus, here is your direct download link for August 2026 invoice (#INV-2026-0881). You can also view all past billing statements under Billing Settings.",
    suggestedArticles: [
      { id: "KB-304", title: "Downloading Past Tax Invoices & Receipts" }
    ],
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Can someone send me the PDF invoice for our last monthly billing cycle? Need it for our accounting department.",
        timestamp: "09:40 AM"
      },
      {
        id: "m2",
        sender: "ai",
        text: "Hi Marcus! I have generated your August 2026 invoice. You can download it directly here: [Download Invoice #INV-2026-0881](#). Let me know if you need any VAT breakdown adjustments!",
        timestamp: "09:41 AM"
      }
    ]
  },
  {
    id: "TICK-1003",
    customer: {
      name: "Elena Rostova",
      email: "elena@designhub.app",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      tier: "Free Plan",
      joinedDate: "Aug 2026"
    },
    subject: "How do I invite team members to my workspace?",
    category: "Product Guidance",
    priority: "Low",
    status: "In Progress",
    assignedTo: "Alex Miller (Agent)",
    createdAt: "2 hours ago",
    sentiment: "Positive",
    aiConfidence: 0.89,
    intent: "Feature Usage / Team Invites",
    summary: "User asking how to add collaborators on free plan.",
    aiSuggestedReply: "Hi Elena! You can invite up to 3 team members on the Free tier. Go to Workspace Settings -> Team Members -> click 'Invite Member' and enter their email addresses.",
    suggestedArticles: [
      { id: "KB-102", title: "Managing Team Roles & Workspace Permissions" }
    ],
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Hello! I love the dashboard so far. I want to add my designer to collaborate with me. Where is the invite button?",
        timestamp: "08:15 AM"
      },
      {
        id: "m2",
        sender: "agent",
        text: "Hi Elena! Happy to help. Go to Workspace Settings -> Team Members -> click 'Invite Member'. Let me know if you run into any trouble!",
        timestamp: "08:30 AM"
      }
    ]
  },
  {
    id: "TICK-1004",
    customer: {
      name: "David Kim",
      email: "dkim@cloudscale.net",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      tier: "Enterprise Customer",
      joinedDate: "Nov 2023"
    },
    subject: "SSO SAML authentication failed after Okta certificate rotation",
    category: "Security & Authentication",
    priority: "High",
    status: "Open",
    assignedTo: "AI Assistant (Escalated)",
    createdAt: "3 hours ago",
    sentiment: "Urgent",
    aiConfidence: 0.76,
    intent: "SAML SSO / Cert Renewal",
    summary: "Single Sign-On failing for 150+ users due to x509 cert update in Okta IdP.",
    aiSuggestedReply: "Hello David, SAML assertion signatures require updating the X.509 certificate footprint in Admin Dashboard -> Security -> SSO Configuration. I can provide the step-by-step metadata upload procedure or notify your dedicated TAM.",
    suggestedArticles: [
      { id: "KB-401", title: "Configuring Okta SAML 2.0 & Certificate Rotation" }
    ],
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Urgent: Our security team renewed our Okta IdP signing cert today, and now none of our employees can log in via SAML SSO. Error says 'Invalid XML Signature'.",
        timestamp: "07:22 AM"
      }
    ]
  }
];

export const initialKnowledgeBase = [
  {
    id: "KB-201",
    title: "Enterprise API Quotas & Custom Rate Limits",
    category: "API & Developers",
    snippet: "Enterprise customers receive tailored rate limits up to 100,000 requests/minute. Burst limits are evaluated using token bucket algorithms...",
    updatedAt: "2026-08-28",
    status: "Indexed",
    views: 1240,
    tags: ["api", "rate-limit", "enterprise", "429"]
  },
  {
    id: "KB-304",
    title: "Downloading Past Tax Invoices & Receipts",
    category: "Billing",
    snippet: "Invoices are generated on the 1st of every calendar month. Account owners and Billing Admins can retrieve invoices in PDF format with custom VAT ID.",
    updatedAt: "2026-08-15",
    status: "Indexed",
    views: 3410,
    tags: ["billing", "invoice", "vat", "receipt"]
  },
  {
    id: "KB-102",
    title: "Managing Team Roles & Workspace Permissions",
    category: "Workspace",
    snippet: "Role-based access control (RBAC) allows Workspace Admins to assign Viewer, Editor, or Admin roles to team members. Free plan includes 3 seats.",
    updatedAt: "2026-09-01",
    status: "Indexed",
    views: 980,
    tags: ["team", "invite", "permissions", "roles"]
  },
  {
    id: "KB-401",
    title: "Configuring Okta SAML 2.0 & Certificate Rotation",
    category: "Security",
    snippet: "When rotating SAML X.509 certificates in your Identity Provider (Okta, Entra ID, Ping), update the signing certificate payload in Security Settings prior to expiration.",
    updatedAt: "2026-07-10",
    status: "Indexed",
    views: 540,
    tags: ["sso", "saml", "okta", "security", "certificates"]
  }
];

export const initialAnalytics = {
  totalTickets: 1482,
  aiResolvedPercent: 68.4,
  avgResponseTimeSec: 14,
  csatScore: 4.8,
  escalationRate: 11.2,
  tokensUsedToday: "142,500",
  sentimentDistribution: {
    positive: 62,
    neutral: 24,
    frustrated: 14
  },
  weeklyVolume: [
    { day: "Mon", total: 210, aiResolved: 145 },
    { day: "Tue", total: 260, aiResolved: 180 },
    { day: "Wed", total: 310, aiResolved: 215 },
    { day: "Thu", total: 280, aiResolved: 195 },
    { day: "Fri", total: 240, aiResolved: 165 },
    { day: "Sat", total: 110, aiResolved: 82 },
    { day: "Sun", total: 72, aiResolved: 55 }
  ]
};

export const initialAiSettings = {
  botName: "SupportAI Assistant",
  modelName: "Gemini 1.5 Pro / Flash RAG pipeline",
  autoReplyThreshold: 0.85,
  escalateOnFrustration: true,
  tone: "Professional, Empathetic & Solution-Oriented",
  customPromptRules: "Always address the customer by first name. Check enterprise tier SLA guarantees before drafting replies. Suggest relevant Knowledge Base articles where applicable."
};

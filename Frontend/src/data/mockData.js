export const initialTickets = [];

export const initialKnowledgeBase = [];

export const initialAnalytics = {
  totalTickets: 0,
  aiResolvedPercent: 0,
  avgResponseTimeSec: 0,
  csatScore: 0,
  escalationRate: 0,
  tokensUsedToday: "0",
  sentimentDistribution: {
    positive: 0,
    neutral: 0,
    frustrated: 0
  },
  weeklyVolume: [
    { day: "Mon", total: 0, aiResolved: 0 },
    { day: "Tue", total: 0, aiResolved: 0 },
    { day: "Wed", total: 0, aiResolved: 0 },
    { day: "Thu", total: 0, aiResolved: 0 },
    { day: "Fri", total: 0, aiResolved: 0 },
    { day: "Sat", total: 0, aiResolved: 0 },
    { day: "Sun", total: 0, aiResolved: 0 }
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

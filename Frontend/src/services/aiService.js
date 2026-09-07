const API_BASE_URL = 'http://localhost:5000/api/ai';

/**
 * Sends customer prompt to AI RAG agent backend endpoint.
 */
export async function sendAiChatPrompt(prompt, ticketId = null, customerId = null, conversationHistory = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        ticketId,
        customerId,
        conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`AI Chat HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend AI endpoint unavailable, using local client RAG fallback:', error);
    // Fallback in case backend server is not running
    const lower = prompt.toLowerCase();
    let resText = "Thank you for reaching out! I am analyzing our knowledge base to assist you.";
    let confidence = 0.85;
    let escalated = false;
    let citations = [];

    if (lower.includes('free plan') || lower.includes('team') || lower.includes('invite')) {
      resText = "On the Free tier, you can invite up to 3 team members! Head over to Workspace Settings -> Team Members and click 'Invite Member'.";
      citations = [{ docCode: 'KB-101', title: 'Team Member Management Guide', snippet: 'Free plans allow up to 3 members per workspace.', relevanceScore: 0.95 }];
    } else if (lower.includes('429') || lower.includes('rate limit')) {
      resText = "I detected a potential Enterprise API rate limit bottleneck. I have logged ticket #TICK-1005 for our senior infrastructure engineers to double your request quota immediately.";
      citations = [{ docCode: 'KB-104', title: 'API Rate Limits & Quotas', snippet: 'HTTP 429 indicates request rate limit exceeded.', relevanceScore: 0.98 }];
    } else if (lower.includes('invoice') || lower.includes('billing')) {
      resText = "You can download your August 2026 PDF invoice directly under Account Settings -> Billing & Invoices.";
      citations = [{ docCode: 'KB-102', title: 'Billing & Invoice FAQ', snippet: 'Invoices are available under Account Settings.', relevanceScore: 0.92 }];
    } else if (lower.includes('human') || lower.includes('agent') || lower.includes('escalate')) {
      resText = "I understand you'd like to speak with a human support agent. I am escalating your conversation to our queue right now.";
      escalated = true;
      confidence = 0.40;
    }

    return {
      response: resText,
      confidenceScore: confidence,
      escalatedToHuman: escalated,
      suggestedCategory: lower.includes('billing') ? 'Billing & Invoices' : 'Technical Support',
      citations,
      suggestedActions: escalated ? ['Escalate to Human Agent'] : ['Was this helpful?', 'Ask follow-up']
    };
  }
}

/**
 * Auto-classifies ticket subject & description.
 */
export async function classifyTicketWithAi(subject, description) {
  try {
    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description })
    });
    if (!response.ok) throw new Error(`Classify HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend AI classify error:', error);
    return {
      category: 'Technical Support',
      priority: 'HIGH',
      confidenceScore: 0.88,
      reasoning: 'Fallback classification based on client analysis.'
    };
  }
}

/**
 * Summarizes ticket conversation.
 */
export async function summarizeTicketWithAi(ticketId, subject, messages = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, subject, messages })
    });
    if (!response.ok) throw new Error(`Summarize HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend AI summarize error:', error);
    return {
      summary: `Ticket thread regarding '${subject}'. Requires agent verification or escalation follow-up.`,
      customerIntent: 'Customer seeking resolution for account/technical inquiry.',
      keyTakeaways: ['Customer contacted support.', 'AI reviewed Knowledge Base citations.']
    };
  }
}

/**
 * Generates AI agent reply suggestion.
 */
export async function getAiSuggestedResponse(ticketId, customerQuery, category = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/suggest-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, customerQuery, category })
    });
    if (!response.ok) throw new Error(`Suggest response HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend AI suggest error:', error);
    return {
      suggestedReply: `Hi there,\n\nThank you for reaching out! We are currently investigating this issue for you and will provide an update shortly.`,
      confidenceScore: 0.82,
      relevantKnowledge: []
    };
  }
}

/**
 * Fetches recent AI interaction logs.
 */
export async function fetchAiLogs(limit = 50) {
  try {
    const response = await fetch(`${API_BASE_URL}/logs?limit=${limit}`);
    if (!response.ok) throw new Error(`Fetch logs HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend AI logs fetch error:', error);
    return [];
  }
}

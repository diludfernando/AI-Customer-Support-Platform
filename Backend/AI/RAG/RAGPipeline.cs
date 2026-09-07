using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.DTOs;
using AICustomerSupport.Backend.AI.Prompts;
using AICustomerSupport.Backend.AI.Retrieval;

namespace AICustomerSupport.Backend.AI.RAG;

public class RAGPipeline
{
    private readonly IKnowledgeRetriever _retriever;

    public RAGPipeline(IKnowledgeRetriever retriever)
    {
        _retriever = retriever;
    }

    public async Task<(string Prompt, List<KnowledgeCitationDto> Citations, double Confidence, bool EscalationRequired)> PrepareGroundedContextAsync(AIChatRequestDto request)
    {
        var userQuery = request.Prompt.Trim();
        var citations = await _retriever.SearchRelevantKnowledgeAsync(userQuery);

        var historySb = new StringBuilder();
        if (request.ConversationHistory != null && request.ConversationHistory.Any())
        {
            foreach (var msg in request.ConversationHistory.TakeLast(6))
            {
                historySb.AppendLine($"{msg.Sender}: {msg.Text}");
            }
        }

        var contextSb = new StringBuilder();
        if (citations.Any())
        {
            foreach (var c in citations)
            {
                contextSb.AppendLine($"[{c.DocCode}] {c.Title}: {c.Snippet}");
            }
        }
        else
        {
            contextSb.AppendLine("No direct matching knowledge base articles found.");
        }

        // Calculate confidence base score
        double topRelevance = citations.FirstOrDefault()?.RelevanceScore ?? 0.0;
        double confidence = Math.Round(Math.Max(0.40, Math.Min(0.98, topRelevance * 0.90 + 0.15)), 2);

        // Check explicit user escalation keywords
        bool explicitEscalation = IsExplicitEscalationRequest(userQuery);
        bool lowConfidence = confidence < 0.60 && !citations.Any();
        bool escalationRequired = explicitEscalation || lowConfidence;

        string finalPrompt = PromptTemplates.BuildRAGChatPrompt(userQuery, contextSb.ToString(), historySb.ToString());

        return (finalPrompt, citations, confidence, escalationRequired);
    }

    public static bool IsExplicitEscalationRequest(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return false;
        var lower = text.ToLower();
        return lower.Contains("human") || 
               lower.Contains("agent") || 
               lower.Contains("escalate") || 
               lower.Contains("real person") || 
               lower.Contains("representative") || 
               lower.Contains("speak to a person");
    }
}

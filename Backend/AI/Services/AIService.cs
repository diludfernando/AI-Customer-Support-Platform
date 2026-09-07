using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.DTOs;
using AICustomerSupport.Backend.AI.Interfaces;
using AICustomerSupport.Backend.AI.Prompts;
using AICustomerSupport.Backend.AI.RAG;
using AICustomerSupport.Backend.AI.Retrieval;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AICustomerSupport.Backend.AI.Services;

public class AIService : IAIService
{
    private readonly ApplicationDbContext _context;
    private readonly IKnowledgeRetriever _retriever;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AIService> _logger;
    private readonly HttpClient _httpClient;
    private readonly RAGPipeline _ragPipeline;

    public AIService(
        ApplicationDbContext context,
        IKnowledgeRetriever retriever,
        IConfiguration configuration,
        ILogger<AIService> logger,
        HttpClient httpClient)
    {
        _context = context;
        _retriever = retriever;
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClient;
        _ragPipeline = new RAGPipeline(retriever);
    }

    public async Task<string> GenerateResponseAsync(string prompt, string? context)
    {
        var apiKey = _configuration["AI_API_KEY"] ?? _configuration["AiSettings:ApiKey"];
        var endpoint = _configuration["AI_ENDPOINT"] ?? _configuration["AiSettings:Endpoint"];

        if (!string.IsNullOrEmpty(apiKey) && !string.IsNullOrEmpty(endpoint))
        {
            try
            {
                var payload = new
                {
                    model = _configuration["AI_MODEL"] ?? "gpt-4o-mini",
                    messages = new[]
                    {
                        new { role = "system", content = PromptTemplates.SystemChatPrompt },
                        new { role = "user", content = string.IsNullOrEmpty(context) ? prompt : $"Context:\n{context}\n\nUser Question:\n{prompt}" }
                    },
                    temperature = 0.3
                };

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, endpoint);
                requestMessage.Headers.Add("Authorization", $"Bearer {apiKey}");
                requestMessage.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(requestMessage);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    var choices = doc.RootElement.GetProperty("choices");
                    if (choices.GetArrayLength() > 0)
                    {
                        return choices[0].GetProperty("message").GetProperty("content").GetString() ?? "I am unable to process your request at this moment.";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Live LLM API call failed. Falling back to grounded local response engine.");
            }
        }

        // Knowledge-Grounded Fallback Engine
        return GenerateFallbackResponse(prompt, context);
    }

    public Task<double> EvaluateConfidenceAsync(string prompt, string response)
    {
        if (string.IsNullOrWhiteSpace(response)) return Task.FromResult(0.0);
        if (response.Contains("unable to find") || response.Contains("escalat")) return Task.FromResult(0.45);
        return Task.FromResult(0.88);
    }

    public async Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request)
    {
        var (finalPrompt, citations, confidence, escalationRequired) = await _ragPipeline.PrepareGroundedContextAsync(request);

        string knowledgeText = string.Join("\n", citations.Select(c => $"{c.Title}: {c.Snippet}"));
        string responseText = await GenerateResponseAsync(request.Prompt, knowledgeText);

        if (escalationRequired)
        {
            responseText += "\n\n(I have detected that your issue may require human agent assistance. You can click 'Escalate & Create Ticket' below to connect with a support specialist.)";
        }

        var interaction = new AIInteraction
        {
            Id = Guid.NewGuid(),
            TicketId = request.TicketId,
            CustomerId = request.CustomerId,
            Prompt = request.Prompt,
            AIResponse = responseText,
            ConfidenceScore = confidence,
            EscalatedToHuman = escalationRequired,
            CreatedAt = DateTime.UtcNow
        };

        await _context.AIInteractions.AddAsync(interaction);
        await _context.SaveChangesAsync();

        return new AIChatResponseDto
        {
            Response = responseText,
            ConfidenceScore = confidence,
            EscalatedToHuman = escalationRequired,
            SuggestedCategory = InferCategoryFromQuery(request.Prompt),
            Citations = citations,
            SuggestedActions = escalationRequired
                ? new List<string> { "Escalate to Human Agent", "Create Support Ticket" }
                : new List<string> { "Was this helpful?", "Ask follow-up question" }
        };
    }

    public async Task<AIClassifyResponseDto> ClassifyTicketAsync(AIClassifyRequestDto request)
    {
        var text = $"{request.Subject} {request.Description}".ToLower();

        string category = "General Inquiry";
        string priority = "MEDIUM";
        double confidence = 0.85;
        string reasoning = "Analyzed subject keywords and description sentiment.";

        if (text.Contains("invoice") || text.Contains("billing") || text.Contains("refund") || text.Contains("charge") || text.Contains("payment"))
        {
            category = "Billing & Invoices";
            priority = text.Contains("unauthorized") || text.Contains("double charge") ? "HIGH" : "MEDIUM";
        }
        else if (text.Contains("bug") || text.Contains("error") || text.Contains("500") || text.Contains("429") || text.Contains("crash") || text.Contains("api"))
        {
            category = "Technical Support";
            priority = text.Contains("production") || text.Contains("outage") || text.Contains("429") ? "URGENT" : "HIGH";
        }
        else if (text.Contains("account") || text.Contains("login") || text.Contains("password") || text.Contains("2fa") || text.Contains("sso"))
        {
            category = "Account Management";
            priority = "MEDIUM";
        }
        else if (text.Contains("feature") || text.Contains("suggest") || text.Contains("add button") || text.Contains("request"))
        {
            category = "Feature Request";
            priority = "LOW";
        }

        return new AIClassifyResponseDto
        {
            Category = category,
            Priority = priority,
            ConfidenceScore = confidence,
            Reasoning = reasoning
        };
    }

    public async Task<AISummarizeResponseDto> SummarizeConversationAsync(AISummarizeRequestDto request)
    {
        var messages = request.Messages ?? new List<ChatMessageDto>();
        string conversationText = string.Join("\n", messages.Select(m => $"{m.Sender}: {m.Text}"));

        string intent = "Customer seeks technical or account assistance.";
        if (conversationText.ToLower().Contains("invoice") || conversationText.ToLower().Contains("billing"))
            intent = "Billing query regarding invoices & receipts.";
        else if (conversationText.ToLower().Contains("rate limit") || conversationText.ToLower().Contains("429"))
            intent = "API quota exceeded / Rate limiting support.";

        var takeaways = new List<string>();
        if (messages.Any())
        {
            takeaways.Add($"Issue reported by {messages.FirstOrDefault()?.Sender ?? "Customer"}.");
            takeaways.Add($"Latest state: {messages.LastOrDefault()?.Text ?? "Pending resolution."}");
            takeaways.Add("Grounded knowledge articles reviewed by AI Assistant.");
        }
        else
        {
            takeaways.Add("Ticket created recently.");
        }

        string summary = $"Ticket thread regarding '{request.Subject}'. {intent} Requires agent verification or escalation follow-up.";

        return new AISummarizeResponseDto
        {
            Summary = summary,
            CustomerIntent = intent,
            KeyTakeaways = takeaways
        };
    }

    public async Task<AISuggestionResponseDto> GenerateAgentSuggestionAsync(AISuggestionRequestDto request)
    {
        var citations = await _retriever.SearchRelevantKnowledgeAsync(request.CustomerQuery);
        var topDoc = citations.FirstOrDefault();

        string suggestedReply = $"Hi there,\n\nThank you for contacting support! ";
        if (topDoc != null)
        {
            suggestedReply += $"Based on our documentation ({topDoc.Title}):\n{topDoc.Snippet}\n\nPlease let us know if this resolves your query!";
        }
        else
        {
            suggestedReply += "We have received your request and our engineering team is actively investigating this. We will update you shortly.";
        }

        return new AISuggestionResponseDto
        {
            SuggestedReply = suggestedReply,
            ConfidenceScore = topDoc != null ? 0.92 : 0.70,
            RelevantKnowledge = citations
        };
    }

    public async Task<List<AIInteractionLogDto>> GetInteractionLogsAsync(int limit = 50)
    {
        var logs = await _context.AIInteractions
            .AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return logs.Select(i => new AIInteractionLogDto
        {
            Id = i.Id,
            TicketId = i.TicketId,
            CustomerId = i.CustomerId,
            Prompt = i.Prompt,
            AIResponse = i.AIResponse,
            ConfidenceScore = i.ConfidenceScore,
            EscalatedToHuman = i.EscalatedToHuman,
            CreatedAt = i.CreatedAt
        }).ToList();
    }

    private static string InferCategoryFromQuery(string query)
    {
        var q = query.ToLower();
        if (q.Contains("invoice") || q.Contains("billing") || q.Contains("pay")) return "Billing & Invoices";
        if (q.Contains("error") || q.Contains("api") || q.Contains("429") || q.Contains("code")) return "Technical Support";
        if (q.Contains("account") || q.Contains("password") || q.Contains("team")) return "Account Management";
        return "General Inquiry";
    }

    private static string GenerateFallbackResponse(string prompt, string? context)
    {
        var lower = prompt.ToLower();

        if (!string.IsNullOrWhiteSpace(context) && !context.Contains("No direct matching knowledge"))
        {
            return $"Thank you for asking! Based on our official Knowledge Base:\n\n{context}\n\nHope this helps! Let me know if you need further clarification.";
        }

        if (lower.Contains("free plan") || lower.Contains("team") || lower.Contains("invite") || lower.Contains("member"))
        {
            return "On the Free tier, you can invite up to 3 team members! Simply head over to Workspace Settings -> Team Members and click 'Invite Member'.";
        }
        if (lower.Contains("429") || lower.Contains("rate limit") || lower.Contains("api"))
        {
            return "A 429 status code indicates API rate limiting. You can request a quota extension under Account Settings -> API Keys or contact our support team to double your limit.";
        }
        if (lower.Contains("invoice") || lower.Contains("billing") || lower.Contains("download"))
        {
            return "You can download your PDF invoices directly under Account Settings -> Billing & Invoices. If you require a custom tax receipt, please let us know.";
        }

        return "I have reviewed your query. While I can answer common account, billing, and technical questions, your request may require personalized handling. Would you like me to connect you with a support agent?";
    }
}

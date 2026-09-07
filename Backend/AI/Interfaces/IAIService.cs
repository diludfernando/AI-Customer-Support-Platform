using System.Collections.Generic;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.DTOs;

namespace AICustomerSupport.Backend.AI.Interfaces;

/// <summary>
/// Service contract for AI Chatbot, RAG groundings, Ticket Auto-Classification,
/// Conversation Summarization, Agent Suggestions, and Interaction Audit Logging.
/// </summary>
public interface IAIService
{
    Task<string> GenerateResponseAsync(string prompt, string? context);
    Task<double> EvaluateConfidenceAsync(string prompt, string response);

    Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request);
    Task<AIClassifyResponseDto> ClassifyTicketAsync(AIClassifyRequestDto request);
    Task<AISummarizeResponseDto> SummarizeConversationAsync(AISummarizeRequestDto request);
    Task<AISuggestionResponseDto> GenerateAgentSuggestionAsync(AISuggestionRequestDto request);
    Task<List<AIInteractionLogDto>> GetInteractionLogsAsync(int limit = 50);
}

using System;
using System.Collections.Generic;

namespace AICustomerSupport.Backend.AI.DTOs;

public class AIChatRequestDto
{
    public string Prompt { get; set; } = string.Empty;
    public Guid? TicketId { get; set; }
    public Guid? CustomerId { get; set; }
    public List<ChatMessageDto>? ConversationHistory { get; set; }
}

public class ChatMessageDto
{
    public string Sender { get; set; } = "user"; // "user" or "bot" or "agent"
    public string Text { get; set; } = string.Empty;
}

public class AIChatResponseDto
{
    public string Response { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public bool EscalatedToHuman { get; set; }
    public string? SuggestedCategory { get; set; }
    public List<KnowledgeCitationDto> Citations { get; set; } = new();
    public List<string> SuggestedActions { get; set; } = new();
}

public class KnowledgeCitationDto
{
    public string DocCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public double RelevanceScore { get; set; }
}

public class AIClassifyRequestDto
{
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AIClassifyResponseDto
{
    public string Category { get; set; } = "General Inquiry";
    public string Priority { get; set; } = "MEDIUM";
    public double ConfidenceScore { get; set; }
    public string Reasoning { get; set; } = string.Empty;
}

public class AISummarizeRequestDto
{
    public Guid? TicketId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public List<ChatMessageDto> Messages { get; set; } = new();
}

public class AISummarizeResponseDto
{
    public string Summary { get; set; } = string.Empty;
    public string CustomerIntent { get; set; } = string.Empty;
    public List<string> KeyTakeaways { get; set; } = new();
}

public class AISuggestionRequestDto
{
    public Guid TicketId { get; set; }
    public string CustomerQuery { get; set; } = string.Empty;
    public string? Category { get; set; }
}

public class AISuggestionResponseDto
{
    public string SuggestedReply { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public List<KnowledgeCitationDto> RelevantKnowledge { get; set; } = new();
}

public class AIInteractionLogDto
{
    public Guid Id { get; set; }
    public Guid? TicketId { get; set; }
    public Guid? CustomerId { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string AIResponse { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public bool EscalatedToHuman { get; set; }
    public DateTime CreatedAt { get; set; }
}

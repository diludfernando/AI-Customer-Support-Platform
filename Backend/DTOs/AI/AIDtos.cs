using System;
using System.Collections.Generic;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.DTOs.AI;

public class ChatRequestDto
{
    public string Message { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public Guid? TicketId { get; set; }
}

public class ChatResponseDto
{
    public string Response { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public bool EscalatedToHuman { get; set; }
    public string? Intent { get; set; }
    public string? Sentiment { get; set; }
    public List<SuggestedArticleDto> SuggestedArticles { get; set; } = new();
}

public class SuggestedArticleDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
}

public class ClassifyRequestDto
{
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class ClassifyResponseDto
{
    public string Category { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; }
    public string Intent { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
}

public class SummarizeRequestDto
{
    public Guid TicketId { get; set; }
}

public class SummarizeResponseDto
{
    public string Summary { get; set; } = string.Empty;
    public List<string> KeyPoints { get; set; } = new();
}

public class SuggestReplyRequestDto
{
    public Guid TicketId { get; set; }
}

public class SuggestReplyResponseDto
{
    public string SuggestedReply { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public List<SuggestedArticleDto> RelevantArticles { get; set; } = new();
}

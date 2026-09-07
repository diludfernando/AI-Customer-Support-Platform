using System;
using System.Collections.Generic;
using AICustomerSupport.Backend.DTOs.Auth;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.DTOs.Tickets;

public class TicketDto
{
    public Guid Id { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    
    public Guid CustomerId { get; set; }
    public UserDto Customer { get; set; } = null!;

    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }

    public Guid? AssignedAgentId { get; set; }
    public UserDto? AssignedAgent { get; set; }

    public string? Sentiment { get; set; }
    public double? AiConfidence { get; set; }
    public string? Intent { get; set; }
    public string? Summary { get; set; }
    public string? AiSuggestedReply { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class CreateTicketDto
{
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;
}

public class UpdateTicketStatusDto
{
    public TicketStatus Status { get; set; }
}

public class AssignTicketDto
{
    public Guid AgentId { get; set; }
}

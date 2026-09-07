using System;
using System.Collections.Generic;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.Models;

public class Ticket
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TicketCode { get; set; } = string.Empty; // e.g. "TICK-1001"
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    public Guid CustomerId { get; set; }
    public User Customer { get; set; } = null!;

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }

    public Guid? AssignedAgentId { get; set; }
    public User? AssignedAgent { get; set; }

    // AI & Intelligence Metadata
    public string? Sentiment { get; set; } // e.g. Frustrated, Neutral, Positive
    public double? AiConfidence { get; set; }
    public string? Intent { get; set; }
    public string? Summary { get; set; }
    public string? AiSuggestedReply { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }

    // Navigation
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<TicketAssignment> Assignments { get; set; } = new List<TicketAssignment>();
    public ICollection<AIInteraction> AIInteractions { get; set; } = new List<AIInteraction>();
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
}

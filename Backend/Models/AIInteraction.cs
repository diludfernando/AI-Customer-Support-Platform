using System;

namespace AICustomerSupport.Backend.Models;

public class AIInteraction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? TicketId { get; set; }
    public Ticket? Ticket { get; set; }

    public Guid? CustomerId { get; set; }
    public User? Customer { get; set; }

    public string Prompt { get; set; } = string.Empty;
    public string AIResponse { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public bool EscalatedToHuman { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

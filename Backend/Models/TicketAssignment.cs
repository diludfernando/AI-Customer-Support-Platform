using System;

namespace AICustomerSupport.Backend.Models;

public class TicketAssignment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public Guid AgentId { get; set; }
    public User Agent { get; set; } = null!;

    public Guid? AssignedByUserId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UnassignedAt { get; set; }
}

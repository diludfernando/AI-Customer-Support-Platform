using System;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.Models;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public Guid? SenderId { get; set; }
    public User? Sender { get; set; }

    public SenderType SenderType { get; set; } = SenderType.Customer;
    public string Content { get; set; } = string.Empty;
    public bool IsAiDraft { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

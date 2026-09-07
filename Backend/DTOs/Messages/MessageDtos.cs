using System;
using AICustomerSupport.Backend.DTOs.Auth;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.DTOs.Messages;

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid TicketId { get; set; }
    public Guid? SenderId { get; set; }
    public UserDto? Sender { get; set; }
    public SenderType SenderType { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsAiDraft { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateMessageDto
{
    public string Content { get; set; } = string.Empty;
}

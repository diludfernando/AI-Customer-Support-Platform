using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Messages;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.Services.Interfaces;

public interface IMessageService
{
    Task<List<MessageDto>> GetMessagesByTicketIdAsync(Guid ticketId);
    Task<MessageDto> AddMessageAsync(Guid ticketId, Guid? senderId, SenderType senderType, string content, bool isAiDraft = false);
}

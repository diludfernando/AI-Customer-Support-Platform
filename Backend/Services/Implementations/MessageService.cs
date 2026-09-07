using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.DTOs.Auth;
using AICustomerSupport.Backend.DTOs.Messages;
using AICustomerSupport.Backend.Models;
using AICustomerSupport.Backend.Models.Enums;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.Services.Implementations;

public class MessageService : IMessageService
{
    private readonly ApplicationDbContext _context;

    public MessageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MessageDto>> GetMessagesByTicketIdAsync(Guid ticketId)
    {
        var messages = await _context.Messages
            .Include(m => m.Sender)
            .Where(m => m.TicketId == ticketId)
            .OrderBy(m => m.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return messages.Select(MapToMessageDto).ToList();
    }

    public async Task<MessageDto> AddMessageAsync(Guid ticketId, Guid? senderId, SenderType senderType, string content, bool isAiDraft = false)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
        {
            throw new KeyNotFoundException("Ticket not found.");
        }

        var message = new Message
        {
            Id = Guid.NewGuid(),
            TicketId = ticketId,
            SenderId = senderId,
            SenderType = senderType,
            Content = content,
            IsAiDraft = isAiDraft,
            CreatedAt = DateTime.UtcNow
        };

        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();

        var createdMsg = await _context.Messages
            .Include(m => m.Sender)
            .FirstOrDefaultAsync(m => m.Id == message.Id);

        return MapToMessageDto(createdMsg!);
    }

    private static MessageDto MapToMessageDto(Message m)
    {
        return new MessageDto
        {
            Id = m.Id,
            TicketId = m.TicketId,
            SenderId = m.SenderId,
            Sender = m.Sender == null ? null : new UserDto
            {
                Id = m.Sender.Id,
                FullName = m.Sender.FullName,
                Email = m.Sender.Email,
                Role = m.Sender.Role,
                AvatarUrl = m.Sender.AvatarUrl,
                Tier = m.Sender.Tier
            },
            SenderType = m.SenderType,
            Content = m.Content,
            IsAiDraft = m.IsAiDraft,
            CreatedAt = m.CreatedAt
        };
    }
}

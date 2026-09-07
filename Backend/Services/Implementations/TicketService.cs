using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.DTOs.Auth;
using AICustomerSupport.Backend.DTOs.Tickets;
using AICustomerSupport.Backend.Models;
using AICustomerSupport.Backend.Models.Enums;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.Services.Implementations;

public class TicketService : ITicketService
{
    private readonly ApplicationDbContext _context;

    public TicketService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TicketDto>> GetAllTicketsAsync(TicketStatus? status = null, TicketPriority? priority = null)
    {
        var query = _context.Tickets
            .Include(t => t.Customer)
            .Include(t => t.AssignedAgent)
            .Include(t => t.Category)
            .AsNoTracking();

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        var tickets = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return tickets.Select(MapToTicketDto).ToList();
    }

    public async Task<TicketDto?> GetTicketByIdAsync(Guid id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Customer)
            .Include(t => t.AssignedAgent)
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);

        return ticket == null ? null : MapToTicketDto(ticket);
    }

    public async Task<TicketDto?> GetTicketByCodeAsync(string code)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Customer)
            .Include(t => t.AssignedAgent)
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.TicketCode.ToLower() == code.ToLower());

        return ticket == null ? null : MapToTicketDto(ticket);
    }

    public async Task<TicketDto> CreateTicketAsync(Guid customerId, CreateTicketDto createDto)
    {
        var count = await _context.Tickets.CountAsync() + 1001;
        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            TicketCode = $"TICK-{count}",
            Subject = createDto.Subject,
            Description = createDto.Description,
            CategoryId = createDto.CategoryId,
            Priority = createDto.Priority,
            Status = TicketStatus.Open,
            CustomerId = customerId,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Tickets.AddAsync(ticket);
        await _context.SaveChangesAsync();

        return (await GetTicketByIdAsync(ticket.Id))!;
    }

    public async Task<TicketDto?> UpdateStatusAsync(Guid ticketId, TicketStatus status)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null) return null;

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;
        if (status == TicketStatus.Resolved || status == TicketStatus.Closed)
        {
            ticket.ResolvedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return await GetTicketByIdAsync(ticketId);
    }

    public async Task<TicketDto?> AssignAgentAsync(Guid ticketId, Guid agentId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null) return null;

        var agent = await _context.Users.FindAsync(agentId);
        if (agent == null || agent.Role != UserRole.Agent && agent.Role != UserRole.Admin)
        {
            throw new ArgumentException("Invalid agent user ID.");
        }

        ticket.AssignedAgentId = agentId;
        ticket.UpdatedAt = DateTime.UtcNow;

        var assignment = new TicketAssignment
        {
            Id = Guid.NewGuid(),
            TicketId = ticketId,
            AgentId = agentId,
            AssignedAt = DateTime.UtcNow
        };
        await _context.TicketAssignments.AddAsync(assignment);

        await _context.SaveChangesAsync();
        return await GetTicketByIdAsync(ticketId);
    }

    private static TicketDto MapToTicketDto(Ticket ticket)
    {
        return new TicketDto
        {
            Id = ticket.Id,
            TicketCode = ticket.TicketCode,
            Subject = ticket.Subject,
            Description = ticket.Description,
            Status = ticket.Status,
            Priority = ticket.Priority,
            CustomerId = ticket.CustomerId,
            Customer = new UserDto
            {
                Id = ticket.Customer.Id,
                FullName = ticket.Customer.FullName,
                Email = ticket.Customer.Email,
                Role = ticket.Customer.Role,
                AvatarUrl = ticket.Customer.AvatarUrl,
                Tier = ticket.Customer.Tier
            },
            CategoryId = ticket.CategoryId,
            CategoryName = ticket.Category?.Name,
            AssignedAgentId = ticket.AssignedAgentId,
            AssignedAgent = ticket.AssignedAgent == null ? null : new UserDto
            {
                Id = ticket.AssignedAgent.Id,
                FullName = ticket.AssignedAgent.FullName,
                Email = ticket.AssignedAgent.Email,
                Role = ticket.AssignedAgent.Role,
                AvatarUrl = ticket.AssignedAgent.AvatarUrl,
                Tier = ticket.AssignedAgent.Tier
            },
            Sentiment = ticket.Sentiment,
            AiConfidence = ticket.AiConfidence,
            Intent = ticket.Intent,
            Summary = ticket.Summary,
            AiSuggestedReply = ticket.AiSuggestedReply,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            ResolvedAt = ticket.ResolvedAt
        };
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Tickets;
using AICustomerSupport.Backend.Models.Enums;

namespace AICustomerSupport.Backend.Services.Interfaces;

public interface ITicketService
{
    Task<List<TicketDto>> GetAllTicketsAsync(TicketStatus? status = null, TicketPriority? priority = null);
    Task<TicketDto?> GetTicketByIdAsync(Guid id);
    Task<TicketDto?> GetTicketByCodeAsync(string code);
    Task<TicketDto> CreateTicketAsync(Guid customerId, CreateTicketDto createDto);
    Task<TicketDto?> UpdateStatusAsync(Guid ticketId, TicketStatus status);
    Task<TicketDto?> AssignAgentAsync(Guid ticketId, Guid agentId);
}

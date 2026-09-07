using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Messages;
using AICustomerSupport.Backend.DTOs.Tickets;
using AICustomerSupport.Backend.Models.Enums;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AICustomerSupport.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly IMessageService _messageService;

    public TicketsController(ITicketService ticketService, IMessageService messageService)
    {
        _ticketService = ticketService;
        _messageService = messageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTickets([FromQuery] TicketStatus? status, [FromQuery] TicketPriority? priority)
    {
        var tickets = await _ticketService.GetAllTicketsAsync(status, priority);
        return Ok(tickets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTicketById(Guid id)
    {
        var ticket = await _ticketService.GetTicketByIdAsync(id);
        if (ticket == null) return NotFound(new { message = "Ticket not found." });
        return Ok(ticket);
    }

    [HttpGet("code/{code}")]
    public async Task<IActionResult> GetTicketByCode(string code)
    {
        var ticket = await _ticketService.GetTicketByCodeAsync(code);
        if (ticket == null) return NotFound(new { message = "Ticket not found." });
        return Ok(ticket);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto)
    {
        // Extract customer ID from JWT or default to customer Sarah for demo/testing
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid customerId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedId))
        {
            customerId = parsedId;
        }

        var created = await _ticketService.CreateTicketAsync(customerId, dto);
        return CreatedAtAction(nameof(GetTicketById), new { id = created.Id }, created);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateTicketStatusDto dto)
    {
        var updated = await _ticketService.UpdateStatusAsync(id, dto.Status);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpPatch("{id:guid}/assign")]
    public async Task<IActionResult> AssignAgent(Guid id, [FromBody] AssignTicketDto dto)
    {
        try
        {
            var updated = await _ticketService.AssignAgentAsync(id, dto.AgentId);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid id)
    {
        var messages = await _messageService.GetMessagesByTicketIdAsync(id);
        return Ok(messages);
    }

    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> AddMessage(Guid id, [FromBody] CreateMessageDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid? senderId = string.IsNullOrEmpty(userIdClaim) ? null : Guid.Parse(userIdClaim);
        
        var senderTypeRole = User.FindFirst(ClaimTypes.Role)?.Value;
        SenderType senderType = SenderType.Customer;

        if (senderTypeRole == UserRole.Agent.ToString() || senderTypeRole == UserRole.Admin.ToString())
        {
            senderType = SenderType.Agent;
        }

        var message = await _messageService.AddMessageAsync(id, senderId, senderType, dto.Content);
        return Ok(message);
    }
}

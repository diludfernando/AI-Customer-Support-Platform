using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.DTOs;
using AICustomerSupport.Backend.AI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AICustomerSupport.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    /// <summary>
    /// AI Chatbot endpoint for customer interactive assistance (RAG Grounded).
    /// </summary>
    [HttpPost("chat")]
    public async Task<IActionResult> ProcessChat([FromBody] AIChatRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Prompt))
        {
            return BadRequest(new { message = "Prompt cannot be empty." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (!dto.CustomerId.HasValue && !string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedId))
        {
            dto.CustomerId = parsedId;
        }

        var response = await _aiService.ProcessChatAsync(dto);
        return Ok(response);
    }

    /// <summary>
    /// Auto-classifies ticket subject and description into category & priority.
    /// </summary>
    [HttpPost("classify")]
    public async Task<IActionResult> ClassifyTicket([FromBody] AIClassifyRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Subject) && string.IsNullOrWhiteSpace(dto.Description))
        {
            return BadRequest(new { message = "Subject or Description must be provided." });
        }

        var result = await _aiService.ClassifyTicketAsync(dto);
        return Ok(result);
    }

    /// <summary>
    /// Generates concise 2-3 sentence summary & key takeaways for a ticket thread.
    /// </summary>
    [HttpPost("summarize")]
    public async Task<IActionResult> Summarize([FromBody] AISummarizeRequestDto dto)
    {
        var result = await _aiService.SummarizeConversationAsync(dto);
        return Ok(result);
    }

    /// <summary>
    /// Generates an AI-suggested draft response for support agents.
    /// </summary>
    [HttpPost("suggest-response")]
    public async Task<IActionResult> SuggestResponse([FromBody] AISuggestionRequestDto dto)
    {
        var result = await _aiService.GenerateAgentSuggestionAsync(dto);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves recent AI interaction logs for system monitoring & audit.
    /// </summary>
    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs([FromQuery] int limit = 50)
    {
        var logs = await _aiService.GetInteractionLogsAsync(limit);
        return Ok(logs);
    }
}

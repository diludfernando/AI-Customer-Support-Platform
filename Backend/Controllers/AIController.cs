using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.Implementations;
using AICustomerSupport.Backend.DTOs.AI;
using Microsoft.AspNetCore.Mvc;

namespace AICustomerSupport.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly AIService _aiService;

    public AIController(AIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { message = "Message content is required." });
        }

        var result = await _aiService.ChatAsync(request);
        return Ok(result);
    }

    [HttpPost("classify")]
    public async Task<IActionResult> Classify([FromBody] ClassifyRequestDto request)
    {
        var result = await _aiService.ClassifyAsync(request);
        return Ok(result);
    }

    [HttpPost("summarize")]
    public async Task<IActionResult> Summarize([FromBody] SummarizeRequestDto request)
    {
        var result = await _aiService.SummarizeAsync(request);
        return Ok(result);
    }

    [HttpPost("suggest-response")]
    public async Task<IActionResult> SuggestResponse([FromBody] SuggestReplyRequestDto request)
    {
        var result = await _aiService.SuggestReplyAsync(request);
        return Ok(result);
    }
}

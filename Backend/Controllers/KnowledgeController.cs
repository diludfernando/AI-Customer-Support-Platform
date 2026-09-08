using System;
using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Knowledge;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AICustomerSupport.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KnowledgeController : ControllerBase
{
    private readonly IKnowledgeService _knowledgeService;

    public KnowledgeController(IKnowledgeService knowledgeService)
    {
        _knowledgeService = knowledgeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? query, [FromQuery] string? category)
    {
        var docs = await _knowledgeService.GetAllDocumentsAsync(query, category);
        return Ok(docs);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var doc = await _knowledgeService.GetDocumentByIdAsync(id);
        if (doc == null) return NotFound();
        return Ok(doc);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateKnowledgeDocumentDto dto)
    {
        var doc = await _knowledgeService.CreateDocumentAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = doc.Id }, doc);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _knowledgeService.DeleteDocumentAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

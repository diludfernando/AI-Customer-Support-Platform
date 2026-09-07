using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.DTOs.Knowledge;
using AICustomerSupport.Backend.Models;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.Services.Implementations;

public class KnowledgeService : IKnowledgeService
{
    private readonly ApplicationDbContext _context;

    public KnowledgeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<KnowledgeDocumentDto>> GetAllDocumentsAsync(string? query = null, string? category = null)
    {
        var q = _context.KnowledgeDocuments.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            q = q.Where(d => d.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(query))
        {
            var search = query.ToLower();
            q = q.Where(d => d.Title.ToLower().Contains(search) ||
                             d.Snippet.ToLower().Contains(search) ||
                             d.Content.ToLower().Contains(search));
        }

        var docs = await q.OrderByDescending(d => d.UpdatedAt).ToListAsync();
        return docs.Select(MapToDto).ToList();
    }

    public async Task<KnowledgeDocumentDto?> GetDocumentByIdAsync(Guid id)
    {
        var doc = await _context.KnowledgeDocuments.FindAsync(id);
        if (doc == null) return null;

        doc.Views++;
        await _context.SaveChangesAsync();

        return MapToDto(doc);
    }

    public async Task<KnowledgeDocumentDto> CreateDocumentAsync(CreateKnowledgeDocumentDto createDto)
    {
        var count = await _context.KnowledgeDocuments.CountAsync() + 101;
        var doc = new KnowledgeDocument
        {
            Id = Guid.NewGuid(),
            DocCode = $"KB-{count}",
            Title = createDto.Title,
            Category = createDto.Category,
            Content = createDto.Content,
            Snippet = string.IsNullOrEmpty(createDto.Snippet) ? (createDto.Content.Length > 150 ? createDto.Content[..150] + "..." : createDto.Content) : createDto.Snippet,
            Status = "Indexed",
            Views = 0,
            TagsJson = JsonSerializer.Serialize(createDto.Tags ?? new List<string>()),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.KnowledgeDocuments.AddAsync(doc);
        await _context.SaveChangesAsync();

        return MapToDto(doc);
    }

    public async Task<bool> DeleteDocumentAsync(Guid id)
    {
        var doc = await _context.KnowledgeDocuments.FindAsync(id);
        if (doc == null) return false;

        _context.KnowledgeDocuments.Remove(doc);
        await _context.SaveChangesAsync();
        return true;
    }

    private static KnowledgeDocumentDto MapToDto(KnowledgeDocument doc)
    {
        List<string> tags = new();
        try
        {
            tags = JsonSerializer.Deserialize<List<string>>(doc.TagsJson) ?? new();
        }
        catch { }

        return new KnowledgeDocumentDto
        {
            Id = doc.Id,
            DocCode = doc.DocCode,
            Title = doc.Title,
            Category = doc.Category,
            Snippet = doc.Snippet,
            Content = doc.Content,
            Status = doc.Status,
            Views = doc.Views,
            Tags = tags,
            UpdatedAt = doc.UpdatedAt
        };
    }
}

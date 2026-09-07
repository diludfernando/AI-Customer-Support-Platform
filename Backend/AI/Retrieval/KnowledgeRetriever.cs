using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.DTOs;
using AICustomerSupport.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.AI.Retrieval;

public class KnowledgeRetriever : IKnowledgeRetriever
{
    private readonly ApplicationDbContext _context;

    public KnowledgeRetriever(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<KnowledgeCitationDto>> SearchRelevantKnowledgeAsync(string query, int maxResults = 3)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new List<KnowledgeCitationDto>();

        var queryTerms = query.ToLower()
            .Split(new[] { ' ', ',', '.', '?', '!', ';', ':', '-', '\t' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(t => t.Length > 2)
            .Distinct()
            .ToList();

        if (!queryTerms.Any())
            return new List<KnowledgeCitationDto>();

        var documents = await _context.KnowledgeDocuments
            .AsNoTracking()
            .ToListAsync();

        var citations = new List<KnowledgeCitationDto>();

        foreach (var doc in documents)
        {
            double score = 0.0;
            var docTitleLower = doc.Title.ToLower();
            var docContentLower = doc.Content.ToLower();
            var docSnippetLower = doc.Snippet.ToLower();
            var docCategoryLower = doc.Category.ToLower();

            foreach (var term in queryTerms)
            {
                if (docTitleLower.Contains(term))
                    score += 0.35;
                if (docSnippetLower.Contains(term))
                    score += 0.25;
                if (docContentLower.Contains(term))
                    score += 0.20;
                if (docCategoryLower.Contains(term))
                    score += 0.15;
            }

            // Normalize score relative to term count
            double relevance = Math.Min(1.0, Math.Round(score / (queryTerms.Count * 0.35), 2));

            if (relevance > 0.15)
            {
                citations.Add(new KnowledgeCitationDto
                {
                    DocCode = doc.DocCode,
                    Title = doc.Title,
                    Snippet = doc.Snippet.Length > 180 ? doc.Snippet[..180] + "..." : doc.Snippet,
                    RelevanceScore = relevance
                });
            }
        }

        return citations
            .OrderByDescending(c => c.RelevanceScore)
            .Take(maxResults)
            .ToList();
    }
}

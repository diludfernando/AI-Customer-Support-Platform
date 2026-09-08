using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.Embeddings;
using AICustomerSupport.Backend.AI.Retrieval;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.AI.RAG;

public interface IRagService
{
    Task EnsureChunksIndexedAsync();
    Task<List<RrfSearchResult>> RetrieveRelevantChunksAsync(string query, int topK = 5);
}

public class RagService : IRagService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmbeddingService _embeddingService;
    private readonly IBm25SearchService _bm25SearchService;
    private readonly IVectorSearchService _vectorSearchService;
    private readonly IRrfFusionService _rrfFusionService;

    public RagService(
        ApplicationDbContext context,
        IEmbeddingService embeddingService,
        IBm25SearchService bm25SearchService,
        IVectorSearchService vectorSearchService,
        IRrfFusionService rrfFusionService)
    {
        _context = context;
        _embeddingService = embeddingService;
        _bm25SearchService = bm25SearchService;
        _vectorSearchService = vectorSearchService;
        _rrfFusionService = rrfFusionService;
    }

    public async Task EnsureChunksIndexedAsync()
    {
        var docs = await _context.KnowledgeDocuments.Include(d => d.Chunks).ToListAsync();
        bool changed = false;

        foreach (var doc in docs)
        {
            if (!doc.Chunks.Any() && !string.IsNullOrWhiteSpace(doc.Content))
            {
                var passages = ChunkText(doc.Content, targetWordsPerChunk: 150);
                for (int i = 0; i < passages.Count; i++)
                {
                    var chunkText = passages[i];
                    var embedding = await _embeddingService.GetEmbeddingAsync(chunkText);

                    var chunk = new KnowledgeChunk
                    {
                        Id = Guid.NewGuid(),
                        DocumentId = doc.Id,
                        ChunkIndex = i,
                        ChunkText = chunkText,
                        MetadataJson = JsonSerializer.Serialize(new
                        {
                            docCode = doc.DocCode,
                            docTitle = doc.Title,
                            category = doc.Category,
                            vector = embedding
                        }),
                        CreatedAt = DateTime.UtcNow
                    };

                    await _context.KnowledgeChunks.AddAsync(chunk);
                    changed = true;
                }
            }
        }

        if (changed)
        {
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<RrfSearchResult>> RetrieveRelevantChunksAsync(string query, int topK = 5)
    {
        await EnsureChunksIndexedAsync();

        var chunks = await _context.KnowledgeChunks.Include(c => c.Document).ToListAsync();
        if (!chunks.Any()) return new List<RrfSearchResult>();

        var bm25Results = _bm25SearchService.Search(query, chunks, topK * 2);
        var vectorResults = await _vectorSearchService.SearchAsync(query, chunks, topK * 2);

        return _rrfFusionService.CombineRanks(bm25Results, vectorResults, kConstant: 60, topK: topK);
    }

    private static List<string> ChunkText(string text, int targetWordsPerChunk)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<string>();

        for (int i = 0; i < words.Length; i += targetWordsPerChunk)
        {
            var passageWords = words.Skip(i).Take(targetWordsPerChunk);
            chunks.Add(string.Join(" ", passageWords));
        }

        return chunks;
    }
}

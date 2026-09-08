using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.Embeddings;
using AICustomerSupport.Backend.Models;

namespace AICustomerSupport.Backend.AI.Retrieval;

public class VectorSearchResult
{
    public KnowledgeChunk Chunk { get; set; } = null!;
    public double Similarity { get; set; }
}

public interface IVectorSearchService
{
    Task<List<VectorSearchResult>> SearchAsync(string query, List<KnowledgeChunk> chunks, int topK = 10);
}

public class VectorSearchService : IVectorSearchService
{
    private readonly IEmbeddingService _embeddingService;

    public VectorSearchService(IEmbeddingService embeddingService)
    {
        _embeddingService = embeddingService;
    }

    public async Task<List<VectorSearchResult>> SearchAsync(string query, List<KnowledgeChunk> chunks, int topK = 10)
    {
        if (string.IsNullOrWhiteSpace(query) || chunks == null || !chunks.Any())
        {
            return new List<VectorSearchResult>();
        }

        var queryVector = await _embeddingService.GetEmbeddingAsync(query);
        var results = new List<VectorSearchResult>();

        foreach (var chunk in chunks)
        {
            float[] chunkVector = Array.Empty<float>();
            if (!string.IsNullOrEmpty(chunk.MetadataJson))
            {
                try
                {
                    using var doc = JsonDocument.Parse(chunk.MetadataJson);
                    if (doc.RootElement.TryGetProperty("vector", out var vProp))
                    {
                        chunkVector = JsonSerializer.Deserialize<float[]>(vProp.GetRawText()) ?? Array.Empty<float>();
                    }
                }
                catch { }
            }

            if (chunkVector.Length == 0)
            {
                chunkVector = await _embeddingService.GetEmbeddingAsync(chunk.ChunkText);
            }

            double similarity = _embeddingService.ComputeCosineSimilarity(queryVector, chunkVector);
            results.Add(new VectorSearchResult { Chunk = chunk, Similarity = similarity });
        }

        return results.OrderByDescending(r => r.Similarity).Take(topK).ToList();
    }
}

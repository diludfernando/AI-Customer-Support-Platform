using System;
using System.Collections.Generic;
using System.Linq;
using AICustomerSupport.Backend.Models;

namespace AICustomerSupport.Backend.AI.Retrieval;

public class RrfSearchResult
{
    public KnowledgeChunk Chunk { get; set; } = null!;
    public double RrfScore { get; set; }
    public double Bm25Score { get; set; }
    public double VectorSimilarity { get; set; }
}

public interface IRrfFusionService
{
    List<RrfSearchResult> CombineRanks(List<Bm25SearchResult> bm25Results, List<VectorSearchResult> vectorResults, int kConstant = 60, int topK = 5);
}

public class RrfFusionService : IRrfFusionService
{
    public List<RrfSearchResult> CombineRanks(List<Bm25SearchResult> bm25Results, List<VectorSearchResult> vectorResults, int kConstant = 60, int topK = 5)
    {
        var scores = new Dictionary<Guid, (KnowledgeChunk Chunk, double RrfScore, double Bm25Score, double VectorSimilarity)>();

        // Rank BM25
        for (int rank = 0; rank < bm25Results.Count; rank++)
        {
            var item = bm25Results[rank];
            var id = item.Chunk.Id;
            double scoreGain = 1.0 / (kConstant + rank + 1);

            if (scores.TryGetValue(id, out var existing))
            {
                scores[id] = (item.Chunk, existing.RrfScore + scoreGain, item.Score, existing.VectorSimilarity);
            }
            else
            {
                scores[id] = (item.Chunk, scoreGain, item.Score, 0.0);
            }
        }

        // Rank Vector
        for (int rank = 0; rank < vectorResults.Count; rank++)
        {
            var item = vectorResults[rank];
            var id = item.Chunk.Id;
            double scoreGain = 1.0 / (kConstant + rank + 1);

            if (scores.TryGetValue(id, out var existing))
            {
                scores[id] = (existing.Chunk, existing.RrfScore + scoreGain, existing.Bm25Score, item.Similarity);
            }
            else
            {
                scores[id] = (item.Chunk, scoreGain, 0.0, item.Similarity);
            }
        }

        return scores.Values
            .Select(s => new RrfSearchResult
            {
                Chunk = s.Chunk,
                RrfScore = s.RrfScore,
                Bm25Score = s.Bm25Score,
                VectorSimilarity = s.VectorSimilarity
            })
            .OrderByDescending(r => r.RrfScore)
            .Take(topK)
            .ToList();
    }
}

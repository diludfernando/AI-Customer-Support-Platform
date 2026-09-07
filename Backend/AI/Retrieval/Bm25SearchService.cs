using System;
using System.Collections.Generic;
using System.Linq;
using AICustomerSupport.Backend.Models;

namespace AICustomerSupport.Backend.AI.Retrieval;

public class Bm25SearchResult
{
    public KnowledgeChunk Chunk { get; set; } = null!;
    public double Score { get; set; }
}

public interface IBm25SearchService
{
    List<Bm25SearchResult> Search(string query, List<KnowledgeChunk> chunks, int topK = 10);
}

public class Bm25SearchService : IBm25SearchService
{
    private const double k1 = 1.5;
    private const double b = 0.75;

    public List<Bm25SearchResult> Search(string query, List<KnowledgeChunk> chunks, int topK = 10)
    {
        if (string.IsNullOrWhiteSpace(query) || chunks == null || !chunks.Any())
        {
            return new List<Bm25SearchResult>();
        }

        var queryTerms = Tokenize(query);
        if (!queryTerms.Any()) return new List<Bm25SearchResult>();

        int totalDocs = chunks.Count;
        double avgdl = chunks.Average(c => Tokenize(c.ChunkText).Count);
        if (avgdl == 0) avgdl = 1.0;

        // Calculate IDF for each query term
        var docFreqs = new Dictionary<string, int>();
        foreach (var term in queryTerms.Distinct())
        {
            docFreqs[term] = chunks.Count(c => Tokenize(c.ChunkText).Contains(term));
        }

        var results = new List<Bm25SearchResult>();

        foreach (var chunk in chunks)
        {
            var chunkTerms = Tokenize(chunk.ChunkText);
            double docLength = chunkTerms.Count;
            double score = 0.0;

            foreach (var term in queryTerms)
            {
                int df = docFreqs.TryGetValue(term, out var f) ? f : 0;
                if (df == 0) continue;

                double idf = Math.Log((totalDocs - df + 0.5) / (df + 0.5) + 1.0);
                int tf = chunkTerms.Count(t => t == term);

                double termScore = idf * (tf * (k1 + 1.0)) / (tf + k1 * (1.0 - b + b * (docLength / avgdl)));
                score += termScore;
            }

            if (score > 0)
            {
                results.Add(new Bm25SearchResult { Chunk = chunk, Score = score });
            }
        }

        return results.OrderByDescending(r => r.Score).Take(topK).ToList();
    }

    private static List<string> Tokenize(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return new List<string>();
        return text.ToLowerInvariant()
            .Split(new[] { ' ', '.', ',', '!', '?', ';', ':', '-', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(t => t.Length > 1)
            .ToList();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AICustomerSupport.Backend.AI.Embeddings;

public class EmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmbeddingService> _logger;

    public EmbeddingService(HttpClient httpClient, IConfiguration configuration, ILogger<EmbeddingService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<float[]> GetEmbeddingAsync(string text)
    {
        var apiKey = _configuration["AI_API_KEY"] ?? _configuration["Gemini:ApiKey"];

        if (!string.IsNullOrEmpty(apiKey))
        {
            try
            {
                var model = _configuration["EMBEDDING_MODEL"] ?? "text-embedding-004";
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent?key={apiKey}";

                var payload = new
                {
                    model = $"models/{model}",
                    content = new
                    {
                        parts = new[] { new { text } }
                    }
                };

                var response = await _httpClient.PostAsync(url, new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("embedding", out var embeddingProp) &&
                        embeddingProp.TryGetProperty("values", out var valuesProp))
                    {
                        var list = new List<float>();
                        foreach (var val in valuesProp.EnumerateArray())
                        {
                            list.Add(val.GetSingle());
                        }
                        return list.ToArray();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gemini Embedding API failed; falling back to local vectorizer.");
            }
        }

        // Fallback local vectorizer (character n-grams / word frequency hash space of 128 dimension)
        return GenerateLocalVector(text);
    }

    public double ComputeCosineSimilarity(float[] vectorA, float[] vectorB)
    {
        if (vectorA == null || vectorB == null || vectorA.Length == 0 || vectorB.Length == 0) return 0.0;
        
        int length = Math.Min(vectorA.Length, vectorB.Length);
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < length; i++)
        {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        if (normA == 0 || normB == 0) return 0.0;
        return dotProduct / (Math.Sqrt(normA) * Math.Sqrt(normB));
    }

    private static float[] GenerateLocalVector(string text)
    {
        const int dimension = 128;
        var vector = new float[dimension];
        if (string.IsNullOrWhiteSpace(text)) return vector;

        var words = text.ToLowerInvariant().Split(new[] { ' ', '.', ',', '!', '?', ';', ':', '-', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var word in words)
        {
            int hash = Math.Abs(word.GetHashCode()) % dimension;
            vector[hash] += 1.0f;
        }

        // Normalize
        float sumSquares = vector.Sum(v => v * v);
        if (sumSquares > 0)
        {
            float norm = MathF.Sqrt(sumSquares);
            for (int i = 0; i < dimension; i++)
            {
                vector[i] /= norm;
            }
        }

        return vector;
    }
}

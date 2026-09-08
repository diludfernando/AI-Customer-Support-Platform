using System.Threading.Tasks;

namespace AICustomerSupport.Backend.AI.Embeddings;

public interface IEmbeddingService
{
    Task<float[]> GetEmbeddingAsync(string text);
    double ComputeCosineSimilarity(float[] vectorA, float[] vectorB);
}

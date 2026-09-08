using System.Threading.Tasks;

namespace AICustomerSupport.Backend.AI.Interfaces;

/// <summary>
/// Placeholder contract for AI RAG pipeline, LLM responses, and classification.
/// Implementation will be added in the AI Phase.
/// </summary>
public interface IAIService
{
    Task<string> GenerateResponseAsync(string prompt, string? context);
    Task<double> EvaluateConfidenceAsync(string prompt, string response);
}

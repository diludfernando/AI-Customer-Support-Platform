using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.AI;

namespace AICustomerSupport.Backend.AI.Interfaces;

public interface IAIService
{
    Task<string> GenerateResponseAsync(string prompt, string? context);
    Task<double> EvaluateConfidenceAsync(string prompt, string response);

    Task<ChatResponseDto> ChatAsync(ChatRequestDto request);
    Task<ClassifyResponseDto> ClassifyAsync(ClassifyRequestDto request);
    Task<SummarizeResponseDto> SummarizeAsync(SummarizeRequestDto request);
    Task<SuggestReplyResponseDto> SuggestReplyAsync(SuggestReplyRequestDto request);
}

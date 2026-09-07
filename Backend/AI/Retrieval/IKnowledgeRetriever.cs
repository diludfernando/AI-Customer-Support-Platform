using System.Collections.Generic;
using System.Threading.Tasks;
using AICustomerSupport.Backend.AI.DTOs;

namespace AICustomerSupport.Backend.AI.Retrieval;

public interface IKnowledgeRetriever
{
    Task<List<KnowledgeCitationDto>> SearchRelevantKnowledgeAsync(string query, int maxResults = 3);
}

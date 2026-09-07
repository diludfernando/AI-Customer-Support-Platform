using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Knowledge;

namespace AICustomerSupport.Backend.Services.Interfaces;

public interface IKnowledgeService
{
    Task<List<KnowledgeDocumentDto>> GetAllDocumentsAsync(string? query = null, string? category = null);
    Task<KnowledgeDocumentDto?> GetDocumentByIdAsync(Guid id);
    Task<KnowledgeDocumentDto> CreateDocumentAsync(CreateKnowledgeDocumentDto createDto);
    Task<bool> DeleteDocumentAsync(Guid id);
}

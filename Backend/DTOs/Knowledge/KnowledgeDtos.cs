using System;
using System.Collections.Generic;

namespace AICustomerSupport.Backend.DTOs.Knowledge;

public class KnowledgeDocumentDto
{
    public Guid Id { get; set; }
    public string DocCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "Indexed";
    public int Views { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime UpdatedAt { get; set; }
}

public class CreateKnowledgeDocumentDto
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}

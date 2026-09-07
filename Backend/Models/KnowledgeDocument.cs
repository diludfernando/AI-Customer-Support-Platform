using System;
using System.Collections.Generic;

namespace AICustomerSupport.Backend.Models;

public class KnowledgeDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string DocCode { get; set; } = string.Empty; // e.g. "KB-201"
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "Indexed"; // e.g. "Indexed", "Draft", "Archived"
    public int Views { get; set; } = 0;
    public string TagsJson { get; set; } = "[]"; // Serialized array of string tags

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<KnowledgeChunk> Chunks { get; set; } = new List<KnowledgeChunk>();
}

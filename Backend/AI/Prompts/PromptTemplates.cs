using System.Collections.Generic;
using System.Text;
using AICustomerSupport.Backend.AI.Retrieval;

namespace AICustomerSupport.Backend.AI.Prompts;

public static class PromptTemplates
{
    public static string BuildRagChatPrompt(string userQuery, List<RrfSearchResult> retrievedChunks, string customerName = "Valued Customer")
    {
        var sb = new StringBuilder();
        sb.AppendLine("You are SupportAI, an empathetic, professional customer service assistant.");
        sb.AppendLine($"Customer Name: {customerName}");
        sb.AppendLine();
        sb.AppendLine("ORGANIZATION KNOWLEDGE BASE CONTEXT:");
        if (retrievedChunks != null && retrievedChunks.Count > 0)
        {
            foreach (var r in retrievedChunks)
            {
                sb.AppendLine($"--- ARTICLE [{r.Chunk.Document?.DocCode ?? "KB"}] {r.Chunk.Document?.Title ?? "Info"} ---");
                sb.AppendLine(r.Chunk.ChunkText);
            }
        }
        else
        {
            sb.AppendLine("No direct knowledge base articles matched this query.");
        }

        sb.AppendLine();
        sb.AppendLine("RULES:");
        sb.AppendLine("1. Answer the customer's question using the retrieved Knowledge Base context.");
        sb.AppendLine("2. Be polite, concise, and helpful.");
        sb.AppendLine("3. If the knowledge base does NOT contain enough information, politely state what you know and offer to create or escalate a support ticket to a human agent.");
        sb.AppendLine("4. Do not invent details not present in company knowledge.");
        sb.AppendLine();
        sb.AppendLine($"CUSTOMER QUESTION: {userQuery}");
        sb.AppendLine("ANSWER:");

        return sb.ToString();
    }

    public static string BuildClassificationPrompt(string subject, string message)
    {
        return $@"Analyze the following customer support request and classify it.
Subject: {subject}
Message: {message}

Return JSON with fields:
{{
  ""category"": ""Technical Support"" | ""Billing & Subscriptions"" | ""Product Guidance"" | ""Security & Authentication"",
  ""priority"": ""Low"" | ""Medium"" | ""High"" | ""Urgent"",
  ""intent"": ""Short intent summary"",
  ""sentiment"": ""Positive"" | ""Neutral"" | ""Frustrated"" | ""Urgent"",
  ""confidenceScore"": float (0.0 to 1.0)
}}";
    }

    public static string BuildSummarizationPrompt(string conversationText)
    {
        return $@"Summarize the following support conversation thread for a human agent.

CONVERSATION THREAD:
{conversationText}

Provide a concise 2-sentence summary and bullet points of key issues.";
    }

    public static string BuildAgentReplyPrompt(string conversationText, List<RrfSearchResult> retrievedChunks)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Draft a professional agent response for this support ticket based on knowledge base information.");
        sb.AppendLine("CONVERSATION:");
        sb.AppendLine(conversationText);
        sb.AppendLine();
        sb.AppendLine("KNOWLEDGE BASE CONTEXT:");
        if (retrievedChunks != null)
        {
            foreach (var r in retrievedChunks)
            {
                sb.AppendLine($"- [{r.Chunk.Document?.DocCode}]: {r.Chunk.ChunkText}");
            }
        }
        sb.AppendLine();
        sb.AppendLine("DRAFT AGENT RESPONSE:");

        return sb.ToString();
    }
}

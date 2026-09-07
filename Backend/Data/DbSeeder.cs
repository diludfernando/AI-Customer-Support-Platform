using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AICustomerSupport.Backend.Helpers;
using AICustomerSupport.Backend.Models;
using AICustomerSupport.Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Users.AnyAsync())
        {
            return; // DB already seeded
        }

        // 1. Seed Users
        var admin = new User
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            FullName = "Admin User",
            Email = "admin@support.com",
            PasswordHash = PasswordHasher.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            Tier = "Internal Admin",
            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        };

        var agentAlex = new User
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            FullName = "Alex Miller",
            Email = "alex.miller@support.com",
            PasswordHash = PasswordHasher.HashPassword("Agent123!"),
            Role = UserRole.Agent,
            Tier = "Support Specialist",
            AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        };

        var customerSarah = new User
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            FullName = "Sarah Jenkins",
            Email = "sarah.j@acme-corp.com",
            PasswordHash = PasswordHasher.HashPassword("Customer123!"),
            Role = UserRole.Customer,
            Tier = "Enterprise Customer",
            AvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        };

        var customerMarcus = new User
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            FullName = "Marcus Vance",
            Email = "marcus.vance@techfront.io",
            PasswordHash = PasswordHasher.HashPassword("Customer123!"),
            Role = UserRole.Customer,
            Tier = "Pro Plan",
            AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
        };

        await context.Users.AddRangeAsync(admin, agentAlex, customerSarah, customerMarcus);

        // 2. Seed Categories
        var catTech = new Category
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
            Name = "Technical Support",
            Description = "API issues, system bugs, integration errors"
        };

        var catBilling = new Category
        {
            Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
            Name = "Billing & Subscriptions",
            Description = "Invoices, payment failures, tier upgrades"
        };

        var catProduct = new Category
        {
            Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
            Name = "Product Guidance",
            Description = "How-to instructions, user onboardings"
        };

        await context.Categories.AddRangeAsync(catTech, catBilling, catProduct);

        // 3. Seed Knowledge Base Documents
        var kb1 = new KnowledgeDocument
        {
            Id = Guid.NewGuid(),
            DocCode = "KB-201",
            Title = "Enterprise API Quotas & Custom Rate Limits",
            Category = "API & Developers",
            Snippet = "Enterprise customers receive tailored rate limits up to 100,000 requests/minute. Burst limits are evaluated using token bucket algorithms...",
            Content = "Detailed guidance on Enterprise API Quotas, token bucket algorithms, and how to request custom rate limit increases for production workloads.",
            Status = "Indexed",
            Views = 1240,
            TagsJson = "[\"api\", \"rate-limit\", \"enterprise\", \"429\"]"
        };

        var kb2 = new KnowledgeDocument
        {
            Id = Guid.NewGuid(),
            DocCode = "KB-304",
            Title = "Downloading Past Tax Invoices & Receipts",
            Category = "Billing",
            Snippet = "Invoices are generated on the 1st of every calendar month. Account owners and Billing Admins can retrieve invoices in PDF format with custom VAT ID.",
            Content = "Step-by-step instructions on accessing past invoices, updating VAT ID details, and exporting automated monthly tax statements.",
            Status = "Indexed",
            Views = 3410,
            TagsJson = "[\"billing\", \"invoice\", \"vat\", \"receipt\"]"
        };

        var kb3 = new KnowledgeDocument
        {
            Id = Guid.NewGuid(),
            DocCode = "KB-102",
            Title = "Managing Team Roles & Workspace Permissions",
            Category = "Workspace",
            Snippet = "Role-based access control (RBAC) allows Workspace Admins to assign Viewer, Editor, or Admin roles to team members. Free plan includes 3 seats.",
            Content = "Overview of permissions matrix for Viewer, Editor, and Admin workspace roles.",
            Status = "Indexed",
            Views = 980,
            TagsJson = "[\"team\", \"invite\", \"permissions\", \"roles\"]"
        };

        await context.KnowledgeDocuments.AddRangeAsync(kb1, kb2, kb3);

        // 4. Seed Tickets & Messages
        var ticket1 = new Ticket
        {
            Id = Guid.NewGuid(),
            TicketCode = "TICK-1001",
            Subject = "API Rate limiting errors on production endpoints",
            Description = "Customer hitting 429 Too Many Requests error despite being on Enterprise Tier with high volume limits.",
            Status = TicketStatus.Open,
            Priority = TicketPriority.High,
            CategoryId = catTech.Id,
            CustomerId = customerSarah.Id,
            AssignedAgentId = agentAlex.Id,
            Sentiment = "Frustrated",
            AiConfidence = 0.94,
            Intent = "Bug / Rate Limit Increase",
            Summary = "Customer hitting 429 Too Many Requests error despite being on Enterprise Tier with high volume limits.",
            AiSuggestedReply = "Hello Sarah, I understand your production environment is impacted by API rate limits. I checked your Enterprise tier configuration and noticed your custom rate limit policy was reset during yesterday's deployment. I have raised your limit to 50,000 req/min immediately."
        };

        var ticket2 = new Ticket
        {
            Id = Guid.NewGuid(),
            TicketCode = "TICK-1002",
            Subject = "Request for invoice receipt for August billing",
            Description = "Customer requested August 2026 invoice PDF download link.",
            Status = TicketStatus.AiHandled,
            Priority = TicketPriority.Medium,
            CategoryId = catBilling.Id,
            CustomerId = customerMarcus.Id,
            Sentiment = "Neutral",
            AiConfidence = 0.98,
            Intent = "Invoice Retrieval",
            Summary = "Customer requested August 2026 invoice PDF download link.",
            AiSuggestedReply = "Hi Marcus, here is your direct download link for August 2026 invoice (#INV-2026-0881)."
        };

        await context.Tickets.AddRangeAsync(ticket1, ticket2);

        // Seed messages
        var msg1 = new Message
        {
            Id = Guid.NewGuid(),
            TicketId = ticket1.Id,
            SenderId = customerSarah.Id,
            SenderType = SenderType.Customer,
            Content = "Hi support team! We are suddenly getting flooded with HTTP 429 Too Many Requests response code on our production sync server. We are on the Enterprise plan and shouldn't be rate-limited at 1,000 req/min. Please fix this urgently!",
            CreatedAt = DateTime.UtcNow.AddMinutes(-30)
        };

        var msg2 = new Message
        {
            Id = Guid.NewGuid(),
            TicketId = ticket1.Id,
            SenderId = null,
            SenderType = SenderType.AI,
            Content = "Hello Sarah! I'm analyzing your account logs right now. I detected that a rate limit threshold flag was reset during the maintenance window at 02:00 UTC. Let me offer a draft response to our team lead or apply an immediate override.",
            CreatedAt = DateTime.UtcNow.AddMinutes(-29)
        };

        await context.Messages.AddRangeAsync(msg1, msg2);

        await context.SaveChangesAsync();
    }
}

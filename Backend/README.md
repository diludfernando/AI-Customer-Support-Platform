# AI Customer Support Platform - Backend API

A high-performance **ASP.NET Core 9 Web API** powering the AI Customer Support Platform. It features **JWT Authentication**, **Entity Framework Core (PostgreSQL & In-Memory DB)**, **RAG Knowledge Base management**, **Automated Ticket Sentiment Analysis**, and **OpenAPI/Swagger** interactive documentation.

---

## 📁 Directory & Architecture Structure

```
Backend/
├── AICustomerSupport.Backend.csproj # .NET 9 C# project file
├── AICustomerSupport.Backend.http   # HTTP client testing file for VS / Rider
├── Program.cs                       # Application entry point, DI, & middleware pipeline
├── appsettings.json                 # Global configurations & JWT secret settings
├── appsettings.Development.json     # Development environment overrides
├── AI/                              # AI Service contracts & RAG integration interfaces
│   ├── Interfaces/
│   │   └── IAIService.cs            # AI Prompt, Sentiment, & RAG grounding interface
│   └── README.md                    # AI subsystem documentation
├── Controllers/                     # REST API Controllers (Endpoints)
│   ├── AuthController.cs            # Login & user registration endpoints
│   ├── TicketsController.cs         # Ticket CRUD, status updates, & AI assignment
│   ├── KnowledgeController.cs       # Knowledge Base vector document management
│   ├── AnalyticsController.cs       # CSAT, AI resolution, & ticket statistics
│   ├── CategoriesController.cs      # Support ticket category management
│   └── UsersController.cs          # User profile & role management
├── DTOs/                            # Data Transfer Objects (Request/Response payload contracts)
│   ├── Auth/                        # AuthDtos.cs (LoginRequest, AuthResponse, RegisterRequest)
│   ├── Tickets/                     # TicketDtos.cs (TicketDto, CreateTicketDto, UpdateStatusDto)
│   ├── Messages/                    # MessageDtos.cs (MessageDto, CreateMessageDto)
│   ├── Knowledge/                   # KnowledgeDtos.cs (KnowledgeDocumentDto, CreateDocDto)
│   ├── Categories/                  # CategoryDtos.cs
│   └── Analytics/                  # AnalyticsDtos.cs (DashboardStatsDto, WeeklyVolumeDto)
├── Data/                            # Database context & seeders
│   ├── ApplicationDbContext.cs      # EF Core DbContext definition
│   └── DbSeeder.cs                  # Automatic database seeder for demo data
├── Helpers/                         # Security & token helpers
│   ├── JwtTokenGenerator.cs         # JWT token issuer
│   └── PasswordHasher.cs            # BCrypt/HMAC SHA-256 password hashing
├── Middleware/                      # Custom ASP.NET Core pipeline middleware
│   └── ExceptionHandlingMiddleware.cs # Global exception handling & standard JSON error responses
├── Models/                          # Entity Framework Core domain entities
│   ├── Ticket.cs                    # Support ticket entity
│   ├── Message.cs                   # Conversation message entity
│   ├── KnowledgeDocument.cs         # RAG knowledge article entity
│   ├── KnowledgeChunk.cs            # Vector embedding chunk entity
│   ├── Category.cs                  # Category entity
│   ├── AIInteraction.cs             # AI call logging & token audit entity
│   ├── Feedback.cs                  # CSAT rating entity
│   ├── AuditLog.cs                  # System audit log entity
│   └── Enums/                       # TicketStatus, TicketPriority, UserRole, SenderType
└── Services/                        # Business logic layer
    ├── Interfaces/                  # Service contract interfaces (ITicketService, etc.)
    └── Implementations/             # Service logic implementations (TicketService, etc.)
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Controller | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | `AuthController` | Register a new customer or agent account | ❌ No |
| `POST` | `/api/auth/login` | `AuthController` | Authenticate user & return JWT Bearer token | ❌ No |
| `GET` | `/api/tickets` | `TicketsController` | List support tickets with status/priority filtering | 🔒 Yes |
| `POST` | `/api/tickets` | `TicketsController` | Create a new ticket (triggers AI analysis & auto-reply) | 🔒 Yes |
| `GET` | `/api/tickets/{id}` | `TicketsController` | Get ticket detail with full conversation history | 🔒 Yes |
| `POST` | `/api/tickets/{id}/messages`| `TicketsController` | Send a message in a ticket thread | 🔒 Yes |
| `PATCH`| `/api/tickets/{id}/status` | `TicketsController` | Update ticket status (`Open`, `In Progress`, `Resolved`)| 🔒 Yes |
| `GET` | `/api/knowledge` | `KnowledgeController`| Search RAG knowledge base articles | 🔒 Yes |
| `POST` | `/api/knowledge` | `KnowledgeController`| Add new article & generate vector chunk index | 🔒 Yes |
| `GET` | `/api/analytics/dashboard` | `AnalyticsController`| Retrieve CSAT scores, AI resolution %, & weekly volume | 🔒 Yes |

---

## 🤖 Guidelines for AI Coding Agents

When adding endpoints, refactoring logic, or modifying database schemas in this backend, follow these rules:

### 1. Architectural Layer Separation
- **Controllers** should be lightweight. They validate incoming DTOs and call **Service Interfaces**. Never put direct database EF Core calls (`_context.Tickets.Add(...)`) inside Controllers.
- **Services** (`Services/Implementations/`) contain all business rules, EF Core queries, and AI prompt triggers.
- **Models vs DTOs**: Never expose Entity Framework models directly to the HTTP response. Always map entities to DTOs in `DTOs/`.

### 2. Dependency Injection (DI) Registration
- When creating a new service (e.g. `IAuditService`), register it in `Program.cs`:
  ```csharp
  builder.Services.AddScoped<IAuditService, AuditService>();
  ```

### 3. Database Context & In-Memory Switching
- In `appsettings.json`, set `"UseInMemoryDatabase": true` for zero-setup local dev/testing.
- Set `"UseInMemoryDatabase": false` and configure `"ConnectionStrings:DefaultConnection"` when running PostgreSQL in production.

### 4. Error Handling Standard
- Do not wrap controllers in manual `try-catch` blocks returning generic HTTP 500s.
- Throw domain exceptions or standard HTTP status codes. `ExceptionHandlingMiddleware` automatically intercepts uncaught exceptions and formats them into standard JSON responses:
  ```json
  {
    "statusCode": 404,
    "message": "Resource not found.",
    "timestamp": "2026-09-07T14:11:00Z"
  }
  ```

### 5. Enum Serialization
- All Enums (`TicketStatus`, `TicketPriority`, `UserRole`) are serialized as string representation in JSON output via `JsonStringEnumConverter` configured in `Program.cs`.

---

## 🚀 How to Run the Backend Locally

```bash
# Navigate to the Backend folder
cd Backend

# Restore dependencies
dotnet restore

# Run the API server (starts on http://localhost:5000 / https://localhost:5001)
dotnet run
```

### Swagger Documentation
Once running, navigate to `http://localhost:5000/swagger` or `https://localhost:5001/swagger` to inspect and test the interactive OpenAPI endpoints.

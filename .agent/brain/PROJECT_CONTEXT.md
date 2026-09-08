# AI Customer Support Platform — Project Context

## 1. Project Description

The **AI Customer Support Platform** is a full-stack customer service application that combines traditional ticket-based customer support with AI-powered automation.

The platform enables customers to communicate with an AI assistant, create support tickets, track issues, and communicate with human support agents when necessary.

AI is used to answer common questions, retrieve information from the organization's knowledge base, classify support requests, summarize conversations, suggest responses to agents, and determine when an issue should be escalated to a human.

The system must not depend entirely on AI. Human support agents remain responsible for handling complex, sensitive, or unresolved customer issues.

---

## 2. Project Goal

The main goal is to build a scalable customer support system that:

* Reduces repetitive work for support agents.
* Provides faster responses to customers.
* Automates common customer support questions.
* Maintains structured support tickets and conversations.
* Uses organizational knowledge to generate grounded AI responses.
* Allows seamless escalation from AI to human agents.
* Provides administrators with control over users, tickets, knowledge, and system performance.

---

## 3. Technology Stack

### Frontend

* React
* JavaScript/TypeScript
* HTML
* CSS
* REST API communication

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* RESTful API architecture

### Database

* PostgreSQL

### Authentication

* Clerk Authentication Provider (`@clerk/clerk-react` SPA integration)
* ASP.NET Core JWT Bearer Authentication & Clerk JWKS Authority validation
* Role-based authorization (`Customer`, `Support Agent`, `Administrator`) mapped via Clerk user metadata

### AI

* Large Language Model (LLM)
* Retrieval-Augmented Generation (RAG)
* Embeddings
* Vector similarity search
* BM25 keyword search
* Reciprocal Rank Fusion (RRF)

### Infrastructure

* Docker
* Docker Compose
* Microsoft Azure
* Git
* GitHub

---

## 4. User Roles

The system contains three primary roles.

### Customer

Customers should be able to:

* Register and log in.
* Manage their profile.
* Start conversations with the AI assistant.
* Create support tickets.
* View their own tickets.
* Send messages related to a ticket.
* Track ticket status.
* Receive responses from AI or human agents.
* Provide feedback after an issue is resolved.

Customers must only have access to their own tickets and conversations.

### Support Agent

Support agents should be able to:

* Log in to the agent dashboard.
* View assigned tickets.
* View unassigned tickets when permitted.
* View customer conversations.
* Respond to customers.
* Receive AI-generated response suggestions.
* View AI-generated conversation summaries.
* Change ticket status.
* Change ticket priority when permitted.
* Resolve tickets.
* Escalate issues when required.

Agents must not have administrator privileges.

### Administrator

Administrators should be able to:

* Manage customers.
* Manage support agents.
* View all tickets.
* Assign tickets to agents.
* Manage categories.
* Manage the AI knowledge base.
* Monitor AI escalations.
* View customer feedback.
* Access system analytics.
* Monitor platform activity.

---

## 5. Core System Modules

The application should be separated into logical modules.

### Authentication Module

Responsible for:

* Registration & Login (via Clerk Provider & ASP.NET Core auth endpoints)
* Clerk JWT Token generation & verification
* Password hashing & OAuth identity providers (Google, GitHub, SSO)
* Role-based authorization (`Customer`, `Support Agent`, `Administrator`) via Clerk user metadata
* Session persistence & JWT Bearer token validation against Clerk JWKS Authority endpoint

### Ticket Management Module

Responsible for:

* Creating tickets
* Updating tickets
* Assigning agents
* Setting categories
* Setting priorities
* Changing ticket status
* Resolving tickets
* Closing tickets

Typical ticket statuses:

```text
OPEN
IN_PROGRESS
WAITING_CUSTOMER
RESOLVED
CLOSED
```

Typical priorities:

```text
LOW
MEDIUM
HIGH
URGENT
```

### Messaging Module

Handles communication between:

```text
Customer ↔ AI
Customer ↔ Support Agent
Support Agent ↔ AI Assistant
```

Messages should be stored so that the complete conversation history can be retrieved.

Possible sender types:

```text
CUSTOMER
AGENT
AI
SYSTEM
```

### AI Module

Responsible for:

* AI chatbot responses
* Ticket classification
* Priority suggestions
* Sentiment analysis
* Conversation summarization
* Agent response suggestions
* AI confidence evaluation
* Human escalation

### Knowledge Base Module

Administrators should be able to manage organizational knowledge such as:

* FAQs
* Product documentation
* Troubleshooting instructions
* Payment information
* Delivery information
* Refund and return policies
* Company policies

Documents should be processed into smaller chunks and made searchable by the AI retrieval system.

### Analytics Module

Responsible for metrics such as:

* Total tickets
* Open tickets
* Resolved tickets
* Closed tickets
* Tickets by category
* Tickets by priority
* Average resolution time
* AI resolution rate
* Human escalation rate
* Agent performance
* Customer satisfaction

---

## 6. AI and RAG Architecture

AI responses should use **Retrieval-Augmented Generation (RAG)** whenever the answer depends on organizational knowledge.

General process:

```text
Customer Question
        |
        v
Query Processing
        |
        +----------------+
        |                |
        v                v
 Vector Search       BM25 Search
        |                |
        +-------+--------+
                |
                v
       Reciprocal Rank
        Fusion (RRF)
                |
                v
      Relevant Knowledge
            Chunks
                |
                v
        Prompt Construction
                |
                v
               LLM
                |
                v
        Generated Response
```

The AI should prioritize retrieved organizational knowledge instead of generating unsupported answers.

If sufficient relevant information cannot be retrieved, the system should avoid confidently inventing an answer and should offer escalation to a human agent.

---

## 7. AI Escalation Logic

The AI should escalate a conversation when:

* It cannot confidently answer the question.
* Relevant knowledge cannot be found.
* The customer explicitly requests a human agent.
* Multiple AI responses fail to resolve the problem.
* The issue requires human authorization.
* The issue falls into a category configured for human handling.

Example:

```text
Customer Message
       |
       v
AI Analysis
       |
       v
Knowledge Retrieval
       |
       v
Can AI provide a grounded answer?
       |
   +---+---+
   |       |
  YES      NO
   |       |
   v       v
AI Reply   Create/Escalate Ticket
               |
               v
          Assign Agent
               |
               v
         Human Support
```

---

## 8. Suggested Database Entities

The database may contain the following core entities:

```text
User
Ticket
Message
Category
TicketAssignment
KnowledgeDocument
KnowledgeChunk
AIInteraction
Feedback
Notification
AuditLog
```

### Important Relationships

```text
User
 |
 +---- Customer creates ----> Ticket
 |
 +---- Agent assigned to ---> Ticket

Ticket
 |
 +---- has many -----------> Messages
 |
 +---- belongs to ---------> Category
 |
 +---- has assignments ----> TicketAssignment
 |
 +---- may receive --------> Feedback

KnowledgeDocument
 |
 +---- contains -----------> KnowledgeChunks

Ticket / Conversation
 |
 +---- produces -----------> AIInteractions
```

---

## 9. Backend API Structure

Suggested REST API structure:

```text
/api/auth
/api/users
/api/customers
/api/agents

/api/tickets
/api/tickets/{id}
/api/tickets/{id}/messages
/api/tickets/{id}/assign
/api/tickets/{id}/status

/api/categories

/api/ai/chat
/api/ai/classify
/api/ai/summarize
/api/ai/suggest-response

/api/knowledge
/api/knowledge/documents
/api/knowledge/search

/api/feedback
/api/notifications
/api/analytics
```

Controllers should remain relatively small. Business logic should be placed in services rather than directly inside controllers.

---

## 10. Backend Structure

A suggested ASP.NET Core structure is:

```text
backend/
│
├── Controllers/
├── Services/
├── Interfaces/
├── Models/
├── DTOs/
├── Data/
├── Repositories/
├── Middleware/
├── Helpers/
├── Configuration/
├── AI/
│   ├── RAG/
│   ├── Embeddings/
│   ├── Retrieval/
│   └── Prompts/
│
├── Program.cs
└── appsettings.json
```

---

## 11. Frontend Structure

A suggested React structure is:

```text
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── types/
│   └── assets/
│
├── public/
└── package.json
```

API communication should be centralized inside the `services` layer instead of placing API requests throughout UI components.

---

## 12. Main Frontend Pages

### Public

```text
Login
Register
Forgot Password
```

### Customer

```text
Customer Dashboard
AI Chat
Create Ticket
My Tickets
Ticket Details
Conversation
Profile
Notifications
```

### Agent

```text
Agent Dashboard
Assigned Tickets
Ticket Queue
Ticket Details
Customer Conversation
AI Suggestions
Profile
```

### Admin

```text
Admin Dashboard
User Management
Agent Management
Ticket Management
Category Management
Knowledge Base
Analytics
Feedback
System Settings
```

---

## 13. Security Requirements

The project must follow basic security practices.

* Passwords must never be stored as plain text.
* Passwords must be securely hashed.
* Protected endpoints must require authentication.
* Role-based authorization must be enforced by the backend.
* Customers must not access another customer's tickets.
* API keys must never be exposed to the frontend.
* AI API calls should be made through the backend.
* Database credentials must not be committed to Git.
* Secrets should use environment variables or secure cloud configuration.
* User input must be validated.
* Uploaded files must be validated.
* Sensitive operations should be logged.

Example environment variables:

```text
DATABASE_CONNECTION_STRING=
JWT_SECRET=
VITE_CLERK_PUBLISHABLE_KEY=
UseClerkAuth=
Clerk__Authority=
Clerk__SecretKey=
AI_API_KEY=
AI_MODEL=
EMBEDDING_MODEL=
```

Actual secrets must never be committed to the repository.

---

## 14. Development Guidelines

When implementing new functionality:

1. Keep frontend, backend, database, and AI responsibilities separated.
2. Use DTOs for API request and response models.
3. Validate incoming API requests.
4. Use dependency injection in ASP.NET Core.
5. Use asynchronous operations for database and external API calls.
6. Keep controllers lightweight.
7. Place business logic inside services.
8. Protect endpoints using authentication and role authorization.
9. Handle errors consistently.
10. Log important system operations.
11. Never hard-code passwords, API keys, tokens, or database credentials.
12. Keep AI prompts and AI-related logic separated from normal application logic.

---

## 15. AI Development Rules

When implementing AI functionality:

* Do not send API keys to the frontend.
* AI requests must pass through the backend.
* Prefer knowledge-base-grounded responses.
* Store useful metadata about AI interactions.
* Do not automatically trust AI-generated classifications.
* Allow agents to edit AI-generated responses before sending them when appropriate.
* Implement fallback behavior when the AI service is unavailable.
* AI failures must not prevent users from creating normal support tickets.
* Prefer human escalation when the system cannot generate a reliable answer.

---

## 16. Docker Environment

The local development environment should eventually support:

```text
docker-compose
│
├── frontend
├── backend
├── PostgreSQL
└── vector/search service (if required)
```

Each service should obtain configuration through environment variables.

---

## 17. Deployment Context

The target deployment environment is **Microsoft Azure**.

A possible deployment architecture is:

```text
                 Users
                   |
                   v
             React Frontend
                   |
                   v
           ASP.NET Core API
              /         \
             /           \
            v             v
      PostgreSQL       AI Provider
            |
            v
     Knowledge / Vector
           Storage
```

Development, testing, and production environments should maintain separate configuration and secrets.

---

## 18. Development Priority

Implementation should follow this general order:

```text
Phase 1
Project Setup
    ↓
Database
    ↓
Authentication
    ↓
Role Management

Phase 2
Ticket Management
    ↓
Messaging
    ↓
Customer Dashboard
    ↓
Agent Dashboard

Phase 3
Knowledge Base
    ↓
Document Processing
    ↓
Vector + BM25 Search
    ↓
RAG

Phase 4
AI Chatbot
    ↓
AI Classification
    ↓
Summarization
    ↓
Agent Suggestions
    ↓
Human Escalation

Phase 5
Admin Dashboard
    ↓
Analytics
    ↓
Notifications
    ↓
Feedback

Phase 6
Testing
    ↓
Docker
    ↓
Azure Deployment
```

---

## 19. Core Principle

The platform should follow this principle:

> **AI handles repetitive and knowledge-based support tasks, while human agents remain available for complex, uncertain, or sensitive customer problems.**

Every feature should contribute to a reliable flow between:

```text
Customer
   ↓
AI Assistance
   ↓
Knowledge Retrieval
   ↓
Resolution
   OR
   ↓
Human Escalation
   ↓
Support Agent
   ↓
Resolution
```

The system should remain functional as a customer support platform even if the AI component is temporarily unavailable.

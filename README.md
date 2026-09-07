# AI Customer Support Platform

> [!IMPORTANT]
> **MANDATORY FOR ALL DEVELOPERS AND AI CODING ASSISTANTS**
>
> 1. **BEFORE writing code OR making any GitHub push**: You **MUST** read this [README.md](README.md) and verify adherence to all project rules.
> 2. **BEFORE implementing features**: Read the primary directive documents below:
>    - 🧠 [**Project Context & Architectural Rules**](.agent/brain/PROJECT_CONTEXT.md) — Covers system architecture, tech stack (React + ASP.NET Core + PostgreSQL), backend/frontend structure, database entities, security requirements, RAG architecture, AI escalation logic, and development guidelines.
>    - 🎨 [**UI Design System & Token Specs**](.agent/brain/Desing.md) — Defines the complete visual design system, CSS design tokens, color palette (Indigo primary, Violet/Cyan AI accents), typography scale, layout structures, card/button specs, and design DOs and DONTs.
>    - 📝 [**AI Usage Logging Requirements**](docs/ai-usage/README.md) — Details the mandatory logging format and academic integrity rules required for all AI-assisted coding sessions.

---

## 📌 Core Context Summary

### 1. Project Overview
The **AI Customer Support Platform** is a full-stack customer service application combining traditional ticket-based support with AI automation (RAG-grounded responses, ticket classification, conversation summarization, and agent response suggestions) alongside human agent escalation workflows.

### 2. Primary Documentation Quick Links

| Document | Description | Key Focus Areas |
| :--- | :--- | :--- |
| 🧠 [**PROJECT_CONTEXT.md**](.agent/brain/PROJECT_CONTEXT.md) | Master technical specification & architecture guide | System goals, backend API layout, DB schemas, AI/RAG flow, security rules, roadmap phases |
| 🎨 [**Desing.md**](.agent/brain/Desing.md) | UI/UX design system & token reference | Colors, typography, spacing, CSS variables (`:root`), ticket UI, chat UI, responsive rules |
| 📝 [**AI Usage README**](docs/ai-usage/README.md) | Academic integrity & session logging rules | Mandatory log format (Tool, Task, Prompt, Output, Modifications, Reflection) |

---

## 🛠️ Technology Stack

- **Frontend**: React, JavaScript/TypeScript, HTML, Vanilla CSS (Design tokens based)
- **Backend**: ASP.NET Core Web API (C#), Entity Framework Core
- **Database**: PostgreSQL
- **AI & RAG**: Vector Search + BM25 Keyword Search, Reciprocal Rank Fusion (RRF), LLM Knowledge Base Grounding
- **Authentication**: JWT & Role-Based Authorization (Customer, Support Agent, Administrator)
- **Infrastructure**: Docker, Docker Compose, Azure

---

## 🌿 Git Branching & Push Workflow

> [!CAUTION]
> **STRICT BRANCH PUSH RULES**
>
> 1. ⚛️ **Frontend Folder**: Any changes within the `Frontend/` folder MUST be pushed to the **`Frontend`** branch (`git push origin Frontend`).
> 2. ⚙️ **Backend Folder**: Any changes within the `Backend/` folder MUST be pushed to the **`backend`** branch (`git push origin backend`).
> 3. 🤖 **Pre-Push Check**: Before **EVERY** GitHub push, the AI assistant **MUST** read and re-verify compliance against this [README.md](README.md).

---

## 📁 Repository Structure

```text
AI-Customer-Support-Platform/
├── .agent/
│   └── brain/
│       ├── PROJECT_CONTEXT.md  <-- Core Architecture & System Guidelines
│       └── Desing.md           <-- UI Design System & CSS Tokens
├── docs/
│   └── ai-usage/
│       └── README.md           <-- Mandatory AI Usage Log Rules
├── Backend/                    <-- ASP.NET Core Web API (Pushes to `backend` branch)
├── Frontend/                   <-- React Application (Pushes to `Frontend` branch)
└── README.md                   <-- Root Documentation & Entry Point
```

---

## 🚨 Guidelines for AI Coding Assistants & Developers

1. **Read README Before Push**: Always read [README.md](README.md) before performing any `git push` operation to ensure branch rules are honored.
2. **Check Context Files First**: Always consult [PROJECT_CONTEXT.md](.agent/brain/PROJECT_CONTEXT.md) and [Desing.md](.agent/brain/Desing.md) before implementing features or UI components.
3. **Follow Branching Rules**: Push `Frontend/` changes to `Frontend` branch and `Backend/` changes to `backend` branch.
4. **Follow Design Tokens**: UI components must strictly use the design tokens defined in `Desing.md` (e.g., `#4F46E5` primary indigo, `#F8FAFC` background, soft neutral card styling).
5. **Keep Architecture Clean**: Maintain service/controller separation in ASP.NET Core and centralized API service calls in React.
6. **Log AI Usage**: Record all AI-assisted work according to [docs/ai-usage/README.md](docs/ai-usage/README.md).

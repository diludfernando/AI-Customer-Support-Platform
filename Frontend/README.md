# AI Customer Support Platform - Frontend

A modern, responsive React (JSX) single-page application built with **Vite**, **Tailwind CSS**, and **Lucide React** icons. It provides a complete workspace for support agents, AI knowledge base managers, support leads, and customer chat testing.

---

## 📁 Directory & File Structure

```
Frontend/
├── dist/                   # Production build output
├── node_modules/           # Installed NPM dependencies
├── index.html              # HTML shell & font definitions
├── jsconfig.json           # JavaScript & JSX module paths
├── package.json            # NPM scripts & dependencies
├── vite.config.js          # Vite & Tailwind CSS plugin configuration
└── src/
    ├── main.jsx            # React root DOM rendering entry
    ├── index.css           # Tailwind directives & global scrollbar styles
    ├── App.jsx             # Top-level state manager & view switcher
    ├── data/
    │   └── mockData.js     # Seed data (Tickets, KB Articles, Analytics, AI Config)
    └── components/
        ├── Sidebar.jsx     # Navigation sidebar & system health badge
        ├── Navbar.jsx      # Top header with global search & notification controls
        ├── TicketInbox.jsx # Filterable ticket list with AI confidence metrics
        ├── TicketDetail.jsx# Ticket conversation, AI smart draft box, and RAG context
        ├── KnowledgeBase.jsx# Vector store article manager & document indexing modal
        ├── AnalyticsDashboard.jsx # CSAT, AI resolution, and weekly volume stats
        ├── CustomerSimulator.jsx # End-user live chat simulator widget
        └── SettingsView.jsx # AI bot model configuration & confidence sliders
```

---

## 🧩 Component Architecture & Breakdown

| Component | Description & Responsibilities | Key Props / State |
| :--- | :--- | :--- |
| **`App.jsx`** | Central state orchestrator for tickets, KB articles, search query, active tab, and AI settings. | `activeTab`, `tickets`, `selectedTicket`, `searchQuery` |
| **`Sidebar.jsx`** | Left navigation bar. Switches active workspace views and displays open ticket badges. | `activeTab`, `setActiveTab`, `openTicketsCount` |
| **`Navbar.jsx`** | Header bar with global search input that filters tickets in real-time. | `searchQuery`, `setSearchQuery`, `activeTab`, `onRefresh` |
| **`TicketInbox.jsx`** | Left pane of Ticket Workspace. Filter by Open, AI Handled, High Priority, etc. | `tickets`, `selectedTicket`, `setSelectedTicket`, `filterStatus` |
| **`TicketDetail.jsx`** | Right pane of Ticket Workspace. Chat history, 1-click **Insert AI Draft** reply, and RAG grounding sidebar. | `ticket`, `onSendMessage`, `onResolveTicket` |
| **`KnowledgeBase.jsx`** | RAG document hub. Displays indexed vector articles and includes an "Add Article" modal. | `articles`, `onAddArticle` |
| **`AnalyticsDashboard.jsx`**| Visual charts for AI resolution rate (68.4%), CSAT, token usage, and weekly ticket volume. | `analytics` |
| **`CustomerSimulator.jsx`** | Embedded customer chat widget simulator to test automated AI bot responses. | Local chat state & simulated AI response delay |
| **`SettingsView.jsx`** | Form to adjust AI confidence auto-reply thresholds, model selection, and bot tone rules. | `aiSettings`, `onSaveSettings` |

---

## 🤖 Guidelines for AI Coding Agents

When modifying, extending, or maintaining this codebase, AI agents should follow these rules to work efficiently:

### 1. State Management Pattern
- `App.jsx` acts as the **single source of truth** for all persistent data (`tickets`, `knowledgeArticles`, `analyticsData`, `aiSettings`).
- When introducing a new action (e.g., deleting a ticket, tagging an article), define the state updater handler in `App.jsx` and pass it down as a prop.

### 2. Styling & Theme Standards
- **Color Palette**: Dark theme using Tailwind's `slate` palette (`bg-slate-950` main background, `bg-slate-900` cards/headers, `border-slate-800` borders, `text-slate-100` headings, `text-slate-400` muted text).
- **Brand Accents**: `indigo-600` / `indigo-500` for primary action buttons, `emerald-400` for AI/success indicators, `amber-400` for AI confidence/highlights, `rose-500` for high priority/alerts.
- **Icons**: Always import icons from `lucide-react`. Maintain consistent icon sizing (`w-4 h-4` for standard buttons, `w-3.5 h-3.5` for compact badges).

### 3. Adding a New View / Tab
To add a new view (e.g., "Audit Logs"):
1. Create `src/components/AuditLogs.jsx`.
2. Add an entry to `navItems` in `src/components/Sidebar.jsx` with an id, label, and Lucide icon.
3. Update `getTabTitle()` in `src/components/Navbar.jsx`.
4. Render `<AuditLogs />` conditionally inside `<main>` in `src/App.jsx` when `activeTab === 'audit'`.

### 4. Data Contracts (`src/data/mockData.js`)
When modifying data structures, ensure all records adhere to these fields:

```js
// Ticket Object Contract
{
  id: "TICK-XXXX",
  customer: { name, email, avatar, tier, joinedDate },
  subject: string,
  category: string,
  priority: "High" | "Medium" | "Low",
  status: "Open" | "In Progress" | "AI Handled" | "Resolved",
  assignedTo: string,
  createdAt: string,
  sentiment: "Frustrated" | "Neutral" | "Positive" | "Urgent",
  aiConfidence: number (0.0 to 1.0),
  intent: string,
  summary: string,
  aiSuggestedReply: string,
  suggestedArticles: [{ id, title }],
  messages: [{ id, sender: "customer" | "ai" | "agent", text, timestamp }]
}
```

### 5. Backend Integration Readiness
To connect this React frontend to a real backend REST / WebSocket API:
- Create API client utilities inside `src/services/api.js`.
- Replace the initial state hooks in `App.jsx` with `useEffect` data fetching hooks (`fetch('/api/tickets')`).

---

## 🚀 Available NPM Scripts

```bash
# Install dependencies
npm install

# Start local development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

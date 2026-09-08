import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import TicketInbox from './components/TicketInbox.jsx';
import TicketDetail from './components/TicketDetail.jsx';
import KnowledgeBase from './components/KnowledgeBase.jsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx';
import CustomerSimulator from './components/CustomerSimulator.jsx';
import SettingsView from './components/SettingsView.jsx';
import AuthPage from './components/AuthPage.jsx';

import { getStoredUser, logoutUser } from './services/authService.js';

import { 
  initialTickets, 
  initialKnowledgeBase, 
  initialAnalytics, 
  initialAiSettings 
} from './data/mockData.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser() || {
    id: 'u-101',
    fullName: 'Alex Miller',
    email: 'alex@company.com',
    role: 'Support Agent'
  });
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(initialTickets[0] || null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [knowledgeArticles, setKnowledgeArticles] = useState(initialKnowledgeBase);
  const [analyticsData, setAnalyticsData] = useState(initialAnalytics);
  const [aiSettings, setAiSettings] = useState(initialAiSettings);

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveTab('auth');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('tickets');
  };

  // Filter tickets by search query if any
  const displayedTickets = tickets.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.customer.name.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q)
    );
  });

  const openTicketsCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  const handleSendMessage = (ticketId, text, sender = 'agent') => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          const updated = {
            ...t,
            messages: [...t.messages, newMsg],
            status: t.status === 'Open' ? 'In Progress' : t.status
          };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleResolveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = { ...t, status: 'Resolved' };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddArticle = (newArticle) => {
    setKnowledgeArticles((prev) => [newArticle, ...prev]);
  };

  const handleSaveSettings = (newSettings) => {
    setAiSettings(newSettings);
  };

  const handleRefresh = () => {
    // Simple UI refresh trigger feedback
    setTickets([...tickets]);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openTicketsCount={openTicketsCount}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          onRefresh={handleRefresh}
          currentUser={currentUser}
          onOpenAuth={() => setActiveTab('auth')}
        />

        {/* View Switcher */}
        <main className="flex-1 flex min-h-0 overflow-hidden relative">
          {activeTab === 'auth' && (
            <div className="flex-1 flex w-full h-full min-h-0 overflow-y-auto">
              <AuthPage onAuthSuccess={handleAuthSuccess} />
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="flex-1 flex w-full h-full min-h-0">
              <TicketInbox
                tickets={displayedTickets}
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
              <TicketDetail
                ticket={selectedTicket}
                onSendMessage={handleSendMessage}
                onResolveTicket={handleResolveTicket}
              />
            </div>
          )}

          {activeTab === 'kb' && (
            <KnowledgeBase
              articles={knowledgeArticles}
              onAddArticle={handleAddArticle}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              analytics={analyticsData}
            />
          )}

          {activeTab === 'simulator' && (
            <CustomerSimulator />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              aiSettings={aiSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
}

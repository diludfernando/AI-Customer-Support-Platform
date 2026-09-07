import React from 'react';
import { Search, Bell, Sparkles, Filter, RefreshCw } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, activeTab, onRefresh }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'tickets': return 'Support Agent Ticket Hub';
      case 'kb': return 'AI Vector Knowledge Base';
      case 'analytics': return 'AI Performance & CSAT Analytics';
      case 'simulator': return 'Customer Live Chat Simulator';
      case 'settings': return 'AI Bot Rules & Prompt Config';
      default: return 'Support Workspace';
    }
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
          {getTabTitle()}
        </h2>
        <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          RAG Engine v2.4 Active
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, customers, KB articles..."
            className="w-64 md:w-80 bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Action Buttons */}
        <button 
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          title="Refresh Feed"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

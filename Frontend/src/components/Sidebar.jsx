import React from 'react';
import { 
  Inbox, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Bot, 
  Sparkles, 
  Zap,
  ShieldCheck,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, openTicketsCount, currentUser, onSignOut }) {
  const navItems = [
    { id: 'tickets', label: 'Ticket Workspace', icon: Inbox, count: openTicketsCount },
    { id: 'kb', label: 'AI Knowledge Base', icon: BookOpen },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
    { id: 'simulator', label: 'Customer Widget Demo', icon: MessageSquare },
    { id: 'settings', label: 'AI Bot Settings', icon: Settings },
  ];

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight flex items-center gap-1.5">
              SupportAI <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise Suite</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Health Badge & User Profile */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">AI RAG Agent</p>
              <p className="text-[10px] text-emerald-400 font-medium">99.8% Online • 14ms latency</p>
            </div>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                {getInitials(currentUser.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" /> {currentUser.role || 'User'}
                </p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('auth')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
}

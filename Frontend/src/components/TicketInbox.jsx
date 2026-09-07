import React from 'react';
import { 
  Bot, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function TicketInbox({ tickets, selectedTicket, setSelectedTicket, filterStatus, setFilterStatus }) {
  const filterOptions = [
    { id: 'ALL', label: 'All Tickets' },
    { id: 'Open', label: 'Open' },
    { id: 'AI Handled', label: 'AI Handled' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'High', label: 'High Priority' }
  ];

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'High') return t.priority === 'High';
    return t.status === filterStatus;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1"><Flame className="w-3 h-3" /> High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AI Handled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Bot className="w-3 h-3 text-emerald-400" /> AI Handled
          </span>
        );
      case 'Open':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-sky-400" /> Open
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" /> In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-96 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0 h-full">
      {/* Filter Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inbox</span>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            {filteredTickets.length} tickets
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterStatus(opt.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === opt.id
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No tickets match the selected filter.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isSelected = selectedTicket?.id === ticket.id;
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 cursor-pointer transition-all hover:bg-slate-800/40 relative ${
                  isSelected ? 'bg-slate-800/90 border-l-4 border-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {ticket.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-200 line-clamp-1 mb-1 group-hover:text-indigo-300">
                  {ticket.subject}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {ticket.summary}
                </p>

                {/* Footer details */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={ticket.customer.avatar}
                      alt={ticket.customer.name}
                      className="w-5 h-5 rounded-full object-cover border border-slate-700"
                    />
                    <span className="truncate max-w-[110px] font-medium text-slate-300">
                      {ticket.customer.name}
                    </span>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                {/* AI Confidence Meter */}
                {ticket.aiConfidence && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      AI Confidence: <strong className="text-slate-200">{(ticket.aiConfidence * 100).toFixed(0)}%</strong>
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      ticket.sentiment === 'Frustrated' || ticket.sentiment === 'Urgent'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {ticket.sentiment}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

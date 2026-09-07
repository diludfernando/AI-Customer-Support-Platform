import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle, 
  BookOpen, 
  ArrowUpRight, 
  Zap, 
  Flame, 
  ShieldAlert,
  ThumbsUp,
  CornerDownLeft,
  Copy,
  Edit3
} from 'lucide-react';

export default function TicketDetail({ ticket, onSendMessage, onResolveTicket }) {
  const [replyText, setReplyText] = useState('');
  const [isAiDraftActive, setIsAiDraftActive] = useState(true);

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-8 text-center text-slate-500">
        <p className="text-sm">Select a ticket from the left panel to inspect the conversation and AI recommendations.</p>
      </div>
    );
  }

  const handleApplyAiDraft = () => {
    setReplyText(ticket.aiSuggestedReply || '');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendMessage(ticket.id, replyText, 'agent');
    setReplyText('');
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full min-w-0 overflow-hidden">
      {/* Top Detail Header */}
      <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={ticket.customer.avatar}
            alt={ticket.customer.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 truncate">
                {ticket.subject}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                {ticket.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-slate-300">{ticket.customer.name}</span>
              <span>•</span>
              <span className="text-slate-400">{ticket.customer.email}</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{ticket.customer.tier}</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onResolveTicket(ticket.id)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Resolve Ticket
          </button>
        </div>
      </div>

      {/* Main Content split into Messages + AI Sidebar */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Side: Conversation Thread */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Messages scroll area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* AI Summary Banner */}
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3 shadow-inner">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-indigo-300">AI Ticket Insight & Intent</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Intent: <strong className="text-slate-200">{ticket.intent}</strong>
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-2">{ticket.summary}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Sentiment: <strong className="text-amber-400">{ticket.sentiment}</strong></span>
                  <span>Confidence: <strong className="text-emerald-400">{(ticket.aiConfidence * 100).toFixed(0)}%</strong></span>
                  <span>Assigned: <strong className="text-slate-300">{ticket.assignedTo}</strong></span>
                </div>
              </div>
            </div>

            {/* Message History */}
            {ticket.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 px-1">
                    {isCustomer ? (
                      <span className="font-semibold text-slate-300 flex items-center gap-1">
                        <User className="w-3 h-3 text-sky-400" /> {ticket.customer.name}
                      </span>
                    ) : isAi ? (
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Bot className="w-3 h-3 text-emerald-400" /> AI Assistant Response
                      </span>
                    ) : (
                      <span className="font-semibold text-indigo-300 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-indigo-400" /> Support Agent
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isCustomer
                        ? 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60'
                        : isAi
                        ? 'bg-emerald-950/40 text-emerald-100 rounded-tr-none border border-emerald-500/30'
                        : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Smart Reply Suggestion Box */}
          {ticket.aiSuggestedReply && (
            <div className="mx-6 mb-3 p-3 bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300">AI Suggested Smart Response</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {(ticket.aiConfidence * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate mt-0.5">
                    "{ticket.aiSuggestedReply}"
                  </p>
                </div>
              </div>

              <button
                onClick={handleApplyAiDraft}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Insert Draft
              </button>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response or click 'Insert Draft' above..."
              className="flex-1 bg-slate-800/90 border border-slate-700 text-slate-100 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>

        {/* Right Side: RAG Grounding & Knowledge Base Suggestions */}
        <div className="w-72 bg-slate-900/70 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto shrink-0 hidden lg:flex">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Grounded KB Context
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Articles automatically retrieved by the RAG vector index for this ticket:
            </p>

            <div className="space-y-2">
              {ticket.suggestedArticles?.map((art) => (
                <div key={art.id} className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition-colors group">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-medium text-indigo-400">{art.id}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-300" />
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-indigo-200 line-clamp-2">
                    {art.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Customer Insights
            </h3>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Tier</span>
                <span className="font-bold text-indigo-400">{ticket.customer.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since</span>
                <span className="text-slate-300">{ticket.customer.joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Score</span>
                <span className="font-bold text-emerald-400">Low (0.12)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

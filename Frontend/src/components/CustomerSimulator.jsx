import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X, 
  RotateCcw, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CustomerSimulator() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your AI Support Assistant. How can I help you today with your account, billing, or technical questions?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedPrompts = [
    'How do I add team members on the Free plan?',
    'I am getting a 429 API rate limit error in production.',
    'Where can I download my August invoice?'
  ];

  const handleSend = (userQuery) => {
    const textToSend = userQuery || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userQuery) setInput('');
    setIsTyping(true);

    // Simulate AI response with realistic delay & RAG logic
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! I'm reviewing our knowledge base to answer your request.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('free plan') || lower.includes('team') || lower.includes('invite')) {
        botResponse = "On the Free tier, you can invite up to 3 team members! Simply head over to Workspace Settings -> Team Members and click 'Invite Member'.";
      } else if (lower.includes('429') || lower.includes('rate limit')) {
        botResponse = "I detected a potential Enterprise API rate limit bottleneck. I have logged ticket #TICK-1005 for our senior infrastructure engineers to double your request quota immediately.";
      } else if (lower.includes('invoice') || lower.includes('billing')) {
        botResponse = "You can download your August 2026 PDF invoice directly under Account Settings -> Billing & Invoices. Would you like me to email a copy to your account address?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[640px]">
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                AI Customer Support Portal
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h3>
              <p className="text-[11px] text-indigo-300">Live Customer Chat Simulation</p>
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Session
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap">Try asking:</span>
          {predefinedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-300 border border-slate-700 text-[11px] rounded-full whitespace-nowrap transition-all"
            >
              "{p}"
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                  {isUser ? (
                    <span>Customer</span>
                  ) : (
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> AI Support Bot
                    </span>
                  )}
                  <span>• {m.time}</span>
                </div>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/80 px-3 py-2 rounded-xl w-fit border border-slate-700/60">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>AI is consulting Knowledge Base...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Support a question..."
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

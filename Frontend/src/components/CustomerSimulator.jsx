import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  ShieldAlert,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { sendAiChatPrompt } from '../services/aiService.js';

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
    'Where can I download my August invoice?',
    'I need to speak to a human support agent.'
  ];

  const handleSend = async (userQuery) => {
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

    try {
      // Build history payload for RAG context
      const historyPayload = messages.slice(-5).map((m) => ({
        sender: m.sender === 'user' ? 'user' : 'bot',
        text: m.text
      }));

      const aiResponseData = await sendAiChatPrompt(textToSend, null, null, historyPayload);

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiResponseData.response,
        confidenceScore: aiResponseData.confidenceScore,
        escalatedToHuman: aiResponseData.escalatedToHuman,
        citations: aiResponseData.citations || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to get AI Chat response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Sorry, I am currently having trouble connecting to the AI system. Please try again shortly or open a ticket.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[660px]">
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
              <p className="text-[11px] text-indigo-300">Live RAG Knowledge-Grounded Agent</p>
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
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                  {isUser ? (
                    <span>Customer</span>
                  ) : (
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> AI Support Agent
                      {m.confidenceScore && (
                        <span className="ml-1 px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px]">
                          {Math.round(m.confidenceScore * 100)}% Confidence
                        </span>
                      )}
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
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Citations section */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                      <div className="text-[10px] font-bold text-indigo-300 flex items-center gap-1 mb-1.5">
                        <BookOpen className="w-3 h-3" /> Grounded Knowledge Sources:
                      </div>
                      <div className="space-y-1">
                        {m.citations.map((c, idx) => (
                          <div key={idx} className="bg-slate-900/90 p-1.5 rounded border border-slate-700 text-[10px]">
                            <div className="font-semibold text-slate-200 flex justify-between">
                              <span>[{c.docCode}] {c.title}</span>
                              <span className="text-emerald-400">{Math.round(c.relevanceScore * 100)}% match</span>
                            </div>
                            <p className="text-slate-400 line-clamp-1 mt-0.5">{c.snippet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Escalation banner */}
                  {m.escalatedToHuman && (
                    <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Human Agent Escalation
                      </span>
                      <button
                        onClick={() => alert("Ticket created! A human support agent will respond shortly.")}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1"
                      >
                        Create Ticket <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/80 px-3 py-2 rounded-xl w-fit border border-slate-700/60">
              <Bot className="w-4 h-4 animate-bounce text-indigo-400" />
              <span>AI Agent is retrieving RAG Knowledge Context...</span>
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

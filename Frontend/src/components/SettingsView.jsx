import React, { useState } from 'react';
import { 
  Settings, 
  Bot, 
  Sliders, 
  ShieldCheck, 
  Check, 
  Save, 
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';

export default function SettingsView({ aiSettings, onSaveSettings }) {
  const [formData, setFormData] = useState({ ...aiSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            AI Bot & System Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize AI confidence auto-reply thresholds, bot personality, and escalation triggers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Card 1: Model & Core Persona */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            LLM RAG Engine Config
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bot Name</label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LLM Model Backbone</label>
              <select
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option>Gemini 1.5 Pro / Flash RAG pipeline</option>
                <option>Gemini 1.5 Flash (Ultra Fast Latency)</option>
                <option>Custom Fine-Tuned Llama-3 Support Model</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bot Communication Tone</label>
            <input
              type="text"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Card 2: Confidence Threshold & Escalation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Auto-Reply & Human Escalation Rules
          </h3>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Auto-Reply Confidence Threshold</span>
              <span className="text-indigo-400 font-mono font-bold">
                {(formData.autoReplyThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={formData.autoReplyThreshold}
              onChange={(e) => setFormData({ ...formData, autoReplyThreshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tickets with an AI confidence score above this percentage will receive automated replies instantly.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Auto-Escalate Frustrated Sentiment</span>
              <span className="text-[11px] text-slate-400">Instantly flag & assign to human agent when customer frustration is detected.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.escalateOnFrustration}
              onChange={(e) => setFormData({ ...formData, escalateOnFrustration: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Card 3: Custom Prompt Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Custom System Prompt & Guardrails
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Instructions</label>
            <textarea
              rows={4}
              value={formData.customPromptRules}
              onChange={(e) => setFormData({ ...formData, customPromptRules: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg p-3 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>

          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

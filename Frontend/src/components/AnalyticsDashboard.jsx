import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Users, 
  Cpu, 
  Smile, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsDashboard({ analytics }) {
  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto h-full space-y-6">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            AI Customer Support Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time metric breakdown for AI deflection, resolution speed, and sentiment.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
          Last 30 Days
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">AI Resolution Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 mb-1">{analytics.aiResolvedPercent}%</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +4.2% from last week
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Avg AI Response Time</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 mb-1">{analytics.avgResponseTimeSec} sec</p>
          <p className="text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
            Instant RAG generation
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">CSAT Score</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 mb-1">{analytics.csatScore} / 5.0</p>
          <p className="text-[11px] text-amber-400 font-medium">
            Based on 920 customer ratings
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Human Escalation</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 mb-1">{analytics.escalationRate}%</p>
          <p className="text-[11px] text-slate-400 font-medium">
            Low escalation threshold
          </p>
        </div>
      </div>

      {/* Main Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Ticket Volume Bar Visualization */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              Weekly Ticket Volume vs AI Deflection
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Total inbound tickets compared to tickets resolved automatically by AI.
            </p>
          </div>

          <div className="space-y-4">
            {analytics.weeklyVolume.map((item) => {
              const totalPercent = (item.total / 350) * 100;
              const aiPercent = (item.aiResolved / item.total) * 100;
              return (
                <div key={item.day} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300 w-10">{item.day}</span>
                    <span className="text-slate-400 text-[11px]">
                      <strong className="text-emerald-400">{item.aiResolved}</strong> / {item.total} AI Handled
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                    <div
                      style={{ width: `${aiPercent}%` }}
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-slate-800/80 mt-4 text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> AI Resolved
            </span>
            <span className="flex items-center gap-2 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span> Unresolved / Human Escalated
            </span>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              Customer Sentiment Analysis
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time classification from inbound ticket payloads.
            </p>

            <div className="space-y-4 my-6">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-emerald-400">Positive / Satisfied</span>
                  <span className="text-slate-200">{analytics.sentimentDistribution.positive}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${analytics.sentimentDistribution.positive}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Neutral / Informational</span>
                  <span className="text-slate-200">{analytics.sentimentDistribution.neutral}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${analytics.sentimentDistribution.neutral}%` }} className="bg-sky-500 h-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-rose-400">Frustrated / Urgent</span>
                  <span className="text-slate-200">{analytics.sentimentDistribution.frustrated}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${analytics.sentimentDistribution.frustrated}%` }} className="bg-rose-500 h-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 text-xs flex items-center gap-3">
            <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">LLM Token Usage Today</p>
              <p className="text-slate-400">{analytics.tokensUsedToday} tokens processed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

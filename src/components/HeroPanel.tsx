import React from 'react';
import { Sparkles, Activity, ShieldCheck, RefreshCw, Radio, Play, Download, Terminal, Cpu, FileSpreadsheet, Zap } from 'lucide-react';

interface HeroPanelProps {
  onRunAllNodes: () => void;
  onOpenPlaybookModal: () => void;
  onDownloadBlueprint: () => void;
  onExportCSV: () => void;
  isNodeRunning: boolean;
  lastSyncTime: string;
  isLowLatencyMode?: boolean;
}

export const HeroPanel: React.FC<HeroPanelProps> = ({
  onRunAllNodes,
  onOpenPlaybookModal,
  onDownloadBlueprint,
  onExportCSV,
  isNodeRunning,
  lastSyncTime,
  isLowLatencyMode = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] p-6 border border-white/10 shadow-2xl">
      {/* Background Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#f97316]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#a855f7]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Copy & Status */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 px-3 py-1 text-xs font-semibold text-[#f97316]">
              <Radio className="h-3 w-3 animate-pulse text-[#f97316]" />
              <span>4 Specialist Nodes Online</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
              <ShieldCheck className="h-3.5 w-3.5 text-[#a855f7]" />
              <span>Neural Search Verification Active</span>
            </span>

            {isLowLatencyMode && (
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 animate-pulse">
                <Zap className="h-3 w-3 text-amber-400" />
                <span>Low Latency Mode (45ms)</span>
              </span>
            )}

            <span className="inline-flex items-center space-x-1.5 rounded-full bg-black/60 border border-white/10 px-3 py-1 text-xs font-mono text-zinc-400">
              <RefreshCw className={`h-3 w-3 text-emerald-400 ${isNodeRunning ? 'animate-spin' : ''}`} />
              <span>Last Sync: {lastSyncTime}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white">
            FLUX MARKET <span className="text-[#f97316] font-semibold italic">INTELLIGENCE</span> OS
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-serif italic">
            “Orchestrating 4 specialist nodes for real‑time market dominance. Neural search verification active.”
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center space-x-1">
              <Cpu className="h-3.5 w-3.5 text-[#f97316]" />
              <span>Competitor Node</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Activity className="h-3.5 w-3.5 text-[#a855f7]" />
              <span>Trend Node</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>SEO Node</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Terminal className="h-3.5 w-3.5 text-rose-400" />
              <span>Crisis Node</span>
            </div>
          </div>
        </div>

        {/* Right Panel Control Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[220px]">
          <button
            onClick={onRunAllNodes}
            disabled={isNodeRunning}
            className="flex items-center justify-center space-x-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 shadow-lg shadow-[#f97316]/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Play className={`h-4 w-4 fill-white ${isNodeRunning ? 'animate-bounce' : ''}`} />
            <span>{isNodeRunning ? 'Neural Scan In Progress...' : 'Execute All Nodes'}</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 transition-all shadow-md"
            title="Export Campaign Event Logs, Metrics, Node Telemetry & Revenue Data into CSV format"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Export Overview (CSV)</span>
          </button>

          <button
            onClick={onOpenPlaybookModal}
            className="flex items-center justify-center space-x-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 transition-all"
          >
            <Sparkles className="h-4 w-4 text-[#f97316]" />
            <span>Generate Strategy Playbook</span>
          </button>

          <button
            onClick={onDownloadBlueprint}
            className="flex items-center justify-center space-x-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 transition-all hover:text-white"
          >
            <Download className="h-4 w-4 text-[#a855f7]" />
            <span>Download Blueprint</span>
          </button>
        </div>
      </div>
    </div>
  );
};

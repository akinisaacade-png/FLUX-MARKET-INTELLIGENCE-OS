import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Send, Download, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export const StrategyAIView: React.FC = () => {
  const [objective, setObjective] = useState<string>('Scale PPC ROAS to 5.0x and acquire B2B SaaS leads');
  const [targetAudience, setTargetAudience] = useState<string>('B2B SaaS Founders, CMOs, & Digital Marketers');
  const [budget, setBudget] = useState<string>('15000');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [playbookOutput, setPlaybookOutput] = useState<string | null>(null);

  const handleGeneratePlaybook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/strategy/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective, targetAudience, budget }),
      });
      const data = await res.json();
      setPlaybookOutput(data.playbook || 'Generated playbook successfully.');
    } catch (err) {
      setPlaybookOutput(`[Flux Strategy Engine Output]\n\n# 1. Executive Strategy\nFocus on retargeting high-intent search clusters while optimizing PPC ad variants.\n\n# 2. Budget Allocation\n- Google Search Ads: 50% ($${budget})\n- SEO Clusters: 30%\n- Social Video Retargeting: 20%\n\n# 3. Forecast\n- Predicted ROAS: 4.8x - 5.4x`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-orange-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Strategy AI & Strategic Playbook Studio
          </h2>
        </div>
        <p className="text-xs text-purple-300/70">
          AI-generated growth playbooks, budget allocations, and experiment roadmaps powered by Gemini Intelligence
        </p>
      </div>

      {/* Generator Form */}
      <form
        onSubmit={handleGeneratePlaybook}
        className="rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl space-y-4 text-xs"
      >
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-orange-400" />
          <span>Configure Strategy Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-purple-300 block mb-1">Primary Growth Objective</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full rounded-xl bg-[#0B0713] border border-purple-800/60 p-2.5 text-white placeholder-purple-400/50 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-purple-300 block mb-1">Target Audience Profile</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl bg-[#0B0713] border border-purple-800/60 p-2.5 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-purple-300 block mb-1">Monthly Budget Allocation ($)</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-xl bg-[#0B0713] border border-purple-800/60 p-2.5 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold px-5 py-2.5 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing Strategic Playbook...' : 'Generate AI Playbook'}</span>
        </button>
      </form>

      {/* Generated Playbook Canvas */}
      {playbookOutput && (
        <div className="rounded-2xl border border-orange-500/40 bg-[#0B0713] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">Generated Strategy Playbook Output</h3>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([playbookOutput], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'FLUX_Strategy_Playbook.md';
                a.click();
              }}
              className="flex items-center space-x-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 px-3 py-1.5 text-xs text-purple-200 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Playbook</span>
            </button>
          </div>

          <div className="prose prose-invert prose-purple max-w-none text-xs leading-relaxed font-mono whitespace-pre-wrap text-purple-100 bg-[#130D24] p-4 rounded-xl border border-purple-900/40">
            {playbookOutput}
          </div>
        </div>
      )}
    </div>
  );
};

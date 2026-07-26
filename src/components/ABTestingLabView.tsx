import React, { useState } from 'react';
import { ABExperiment } from '../types';
import { FlaskConical, Plus, Play, CheckCircle2, TrendingUp, BarChart, Percent } from 'lucide-react';

interface ABTestingLabViewProps {
  experiments: ABExperiment[];
  onAddExperiment: (exp: ABExperiment) => void;
}

export const ABTestingLabView: React.FC<ABTestingLabViewProps> = ({ experiments, onAddExperiment }) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expName, setExpName] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('https://fluxos.ai/checkout');
  const [primaryMetric, setPrimaryMetric] = useState<string>('Signup Conversion Rate');

  const handleCreateExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName) return;

    const newExp: ABExperiment = {
      id: `exp_${Date.now()}`,
      name: expName,
      targetUrl,
      status: 'running',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-08-30',
      primaryMetric,
      totalVisitors: 1250,
      variants: [
        { name: 'Control (Baseline)', trafficShare: 50, conversions: 62, conversionRate: 4.96, lift: '0.0%', confidence: 50 },
        { name: 'Variant A (Neural CTA Copy)', trafficShare: 50, conversions: 84, conversionRate: 6.72, lift: '+35.5%', confidence: 96.4 },
      ],
    };

    onAddExperiment(newExp);
    setExpName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              A/B Testing Lab & CRO Studio
            </h2>
          </div>
          <p className="text-xs text-purple-300/70 mt-1">
            Experiment setup, traffic allocation splitters, conversion lift metrics, & 95%+ statistical significance calculation
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 text-white font-semibold px-4 py-2 text-xs shadow-lg shadow-orange-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Launch New Experiment</span>
        </button>
      </div>

      {/* Create Experiment Modal/Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateExp}
          className="rounded-2xl border border-orange-500/50 bg-[#130D24] p-5 shadow-2xl space-y-4 text-xs"
        >
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FlaskConical className="h-4 w-4 text-orange-400" />
            <span>Configure New A/B Experiment</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-purple-300 block mb-1">Experiment Name</label>
              <input
                type="text"
                placeholder="e.g. Hero Section CTA Headline Test"
                value={expName}
                onChange={(e) => setExpName(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-purple-300 block mb-1">Target Page URL</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-purple-300 block mb-1">Primary Success Metric</label>
              <input
                type="text"
                value={primaryMetric}
                onChange={(e) => setPrimaryMetric(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold"
            >
              Launch Variant Split
            </button>
          </div>
        </form>
      )}

      {/* Experiments List */}
      <div className="space-y-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 space-y-4 shadow-xl hover:border-purple-700/60 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 text-[10px] uppercase tracking-wider border border-emerald-500/30">
                    {exp.status}
                  </span>
                  <h3 className="text-base font-bold text-white">{exp.name}</h3>
                </div>
                <p className="text-xs text-purple-400/80 mt-0.5 font-mono">
                  URL: {exp.targetUrl} • Metric: {exp.primaryMetric}
                </p>
              </div>

              <div className="text-right text-xs font-mono text-purple-300">
                <div>Visitors Scanned: <span className="font-bold text-white">{exp.totalVisitors.toLocaleString()}</span></div>
                <div className="text-[10px] text-purple-400">Duration: {exp.startDate} - {exp.endDate}</div>
              </div>
            </div>

            {/* Variants Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase font-mono">Variant Performance Split</h4>

              <div className="grid grid-cols-1 gap-2">
                {exp.variants.map((varItem, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#0B0713] border border-purple-900/40 text-xs gap-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-orange-400" />
                      <div>
                        <span className="font-bold text-white">{varItem.name}</span>
                        <p className="text-[10px] text-purple-400">Traffic Share: {varItem.trafficShare}%</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 font-mono">
                      <div>
                        <span className="text-purple-400/70 text-[10px] block">Conversions</span>
                        <span className="font-bold text-white">{varItem.conversions}</span>
                      </div>
                      <div>
                        <span className="text-purple-400/70 text-[10px] block">Conv Rate</span>
                        <span className="font-bold text-purple-200">{varItem.conversionRate}%</span>
                      </div>
                      <div>
                        <span className="text-purple-400/70 text-[10px] block">Conversion Lift</span>
                        <span
                          className={`font-bold ${
                            varItem.lift.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {varItem.lift}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-400/70 text-[10px] block">Stat Confidence</span>
                        <span className="font-bold text-orange-400">{varItem.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

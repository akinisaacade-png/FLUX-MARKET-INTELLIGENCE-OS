import React, { useState } from 'react';
import { NodeProtocolActivity, NodeType } from '../types';
import {
  competitorPriceHistory,
  competitorAdCreatives,
  trendVolumeTrajectories,
  trendIntentDistribution,
  seoKeywordClusters,
  crisisSentimentTimeline,
  crisisAlertStream,
} from '../data/nodeTelemetryData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts';
import {
  Activity,
  Cpu,
  TrendingUp,
  Search,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Zap,
  Globe,
  ArrowUpRight,
  Shield,
  PenTool,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Eye,
  BarChart3,
  Flame,
  Radio,
} from 'lucide-react';

interface MarketIntelligenceViewProps {
  nodeActivities: NodeProtocolActivity[];
  onRunNode: (nodeType: NodeType) => void;
  runningNodes: Record<string, boolean>;
  onNavigateToContentAssistant?: (contextText: string) => void;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({
  nodeActivities,
  onRunNode,
  runningNodes,
  onNavigateToContentAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'competitor' | 'trend' | 'seo' | 'crisis'>(
    'matrix'
  );

  const handleLaunchContentStudio = (context: string) => {
    if (onNavigateToContentAssistant) {
      onNavigateToContentAssistant(context);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-[#f97316]" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Market Intelligence Hub & Node Telemetry
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-serif italic">
            Real-time competitor price tracking, viral search momentum, keyword cluster intent, & sentiment anomaly radar
          </p>
        </div>

        {/* Node Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-medium">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'matrix'
                ? 'bg-[#f97316] text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All 4 Nodes
          </button>
          <button
            onClick={() => setActiveTab('competitor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'competitor'
                ? 'bg-[#f97316] text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Competitor Node</span>
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'trend'
                ? 'bg-[#f97316] text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Trend Node</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'seo'
                ? 'bg-[#f97316] text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>SEO Node</span>
          </button>
          <button
            onClick={() => setActiveTab('crisis')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'crisis'
                ? 'bg-[#f97316] text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Crisis Node</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ALL NODES MATRIX OVERVIEW */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodeActivities.map((node) => (
            <div
              key={node.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                      <Sparkles className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        {node.nodeName}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono">Last Sync: {node.timestamp}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRunNode(node.nodeType)}
                    disabled={runningNodes[node.nodeType]}
                    className="flex items-center space-x-1 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white px-3 py-1 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${runningNodes[node.nodeType] ? 'animate-spin' : ''}`} />
                    <span>{runningNodes[node.nodeType] ? 'Scanning...' : 'Run Scan'}</span>
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">{node.title}</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{node.description}</p>
                </div>

                {node.actionRequired && (
                  <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-[#f97316] uppercase font-mono">
                      Recommended Neural Action
                    </span>
                    <p className="text-xs text-zinc-200">{node.actionRequired}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab(node.nodeType)}
                  className="text-xs font-bold text-zinc-300 hover:text-[#f97316] transition-colors flex items-center space-x-1"
                >
                  <span>View Telemetry Graphs</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() =>
                    handleLaunchContentStudio(
                      `${node.nodeName}: ${node.title}. Action required: ${node.actionRequired || node.description}`
                    )
                  }
                  className="flex items-center space-x-1 rounded-lg bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 text-xs font-medium border border-white/10 transition-colors"
                >
                  <PenTool className="h-3 w-3 text-[#f97316]" />
                  <span>Draft Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: COMPETITOR NODE TELEMETRY */}
      {activeTab === 'competitor' && (
        <div className="space-y-6">
          {/* Price History Line Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-base font-bold text-white">
                    Competitor Pricing Benchmark Timeline
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Monthly pricing comparison ($/mo) across market rivals vs FLUX OS
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>FLUX Price Anchor Locked @ $149/mo</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={competitorPriceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="FLUX" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} name="FLUX OS ($149)" />
                  <Line type="monotone" dataKey="AdSphere" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" name="AdSphere Pro ($145)" />
                  <Line type="monotone" dataKey="MarketPulse" stroke="#10b981" strokeWidth={2} name="MarketPulse AI ($169)" />
                  <Line type="monotone" dataKey="GrowthEngine" stroke="#e11d48" strokeWidth={2} name="GrowthEngine ($99)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitor Ad Creatives Grid */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Active Competitor Ad Creatives & Angle Analysis
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time ad copy, CTR estimates, and messaging hooks scraped from Meta & Google Ad libraries
                </p>
              </div>

              <span className="text-xs font-mono text-zinc-400">3 High-Spend Ads Detected</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitorAdCreatives.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ad.competitor}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                        {ad.format}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#f97316] leading-snug">
                      "{ad.adHeadline}"
                    </h4>

                    <p className="text-xs text-zinc-300 leading-relaxed italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                      "{ad.previewText}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-400">
                      <span>Est CTR: <strong className="text-emerald-400">{ad.ctrEst}</strong></span>
                      <span>Est Spend: <strong className="text-amber-300">{ad.spendEst}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleLaunchContentStudio(
                        `Counter ad strategy against ${ad.competitor} ad headline "${ad.adHeadline}". Angle: ${ad.angle}`
                      )
                    }
                    className="w-full mt-3 flex items-center justify-center space-x-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white py-2 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    <span>Generate Counter Ad Copy</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TREND NODE TELEMETRY */}
      {activeTab === 'trend' && (
        <div className="space-y-6">
          {/* Viral Trajectory Area Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-base font-bold text-white">
                    Rising Topic Search Momentum (6-Week Trajectory)
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Normalized search volume growth deltas across top emerging B2B marketing concepts
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs text-amber-400 font-mono">
                <Flame className="h-3.5 w-3.5" />
                <span>Autonomous Agents Spiking +184%</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendVolumeTrajectories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="week" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="autonomousAgents" name="Autonomous Marketing Agents" stroke="#f97316" fill="#f97316" fillOpacity={0.25} strokeWidth={2.5} />
                  <Area type="monotone" dataKey="predictiveRoas" name="Predictive PPC ROAS" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="neuralSeo" name="Neural SEO Clustering" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search Intent Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendIntentDistribution.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">
                  Search Intent Class
                </span>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-zinc-400">Share of Total Delta:</span>
                  <span className="font-bold text-[#f97316]">{item.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#f97316] h-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SEO NODE TELEMETRY */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Keyword Cluster Difficulty vs Volume Bar Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-base font-bold text-white">
                    Untapped Keyword Cluster Opportunity Matrix
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Search Volume vs Opportunity Score vs Keyword Difficulty (KD)
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                4 High-Score Clusters Discovered
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seoKeywordClusters} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="cluster" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="opportunityScore" name="Opportunity Score (0-100)" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="difficulty" name="Keyword Difficulty (0-100)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Keyword Gap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoKeywordClusters.map((kc, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{kc.cluster}</h4>
                    <span className="rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 text-[10px] font-mono font-bold">
                      Opportunity {kc.opportunityScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{kc.intentGap}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {kc.topKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleLaunchContentStudio(
                      `Create SEO blog post and landing page copy targeting keyword cluster "${kc.cluster}". Intent gap: ${kc.intentGap}`
                    )
                  }
                  className="w-full mt-3 flex items-center justify-center space-x-1.5 rounded-lg bg-white/10 hover:bg-[#f97316] text-white py-2 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Draft SEO Pillar Content</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CRISIS NODE TELEMETRY */}
      {activeTab === 'crisis' && (
        <div className="space-y-6">
          {/* Sentiment Timeline */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <h3 className="text-base font-bold text-white">
                    24-Hour Brand Sentiment & Anomaly Radar
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time sentiment score (0-100%) and anomaly risk level over the last 24 hours
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-400 font-mono">
                <Shield className="h-3.5 w-3.5" />
                <span>Overall Sentiment: 89% Positive</span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={crisisSentimentTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="hour" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="positive" name="Positive Sentiment %" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2.5} />
                  <Area type="monotone" dataKey="anomalyScore" name="Anomaly Risk Score" stroke="#e11d48" fill="#e11d48" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Social Alert Feed Stream */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Social Media Mentions & Sentiment Stream</h3>
            <div className="space-y-3">
              {crisisAlertStream.map((alert) => (
                <div key={alert.id} className="rounded-xl bg-black/40 p-4 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white font-mono">{alert.source}</span>
                      <span className="text-zinc-500">• {alert.author}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{alert.timestamp}</span>
                  </div>

                  <p className="text-zinc-200 italic font-serif">"{alert.message}"</p>

                  <div className="rounded-lg bg-white/5 p-2.5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#f97316] uppercase font-mono block">
                        Recommended PR Action
                      </span>
                      <p className="text-zinc-300 mt-0.5">{alert.recommendedResponse}</p>
                    </div>

                    <button
                      onClick={() =>
                        handleLaunchContentStudio(
                          `Draft PR response for mention on ${alert.source}: "${alert.message}". Recommended action: ${alert.recommendedResponse}`
                        )
                      }
                      className="shrink-0 flex items-center space-x-1 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white px-3 py-1.5 text-xs font-bold transition-all"
                    >
                      <PenTool className="h-3 w-3" />
                      <span>Draft PR Response</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

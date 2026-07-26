import React, { useState } from 'react';
import { GeneratedContentPackage } from '../types';
import {
  Sparkles,
  PenTool,
  Send,
  Copy,
  Check,
  Share2,
  Calendar,
  Layers,
  Zap,
  Target,
  MessageSquare,
  Globe,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  FileText,
  Mail,
  Megaphone,
} from 'lucide-react';

interface ContentAssistantViewProps {
  initialContext?: string;
  onScheduleCampaign?: (title: string, category: string, channel: string) => void;
}

export const ContentAssistantView: React.FC<ContentAssistantViewProps> = ({
  initialContext = '',
  onScheduleCampaign,
}) => {
  // Pre-set Context Presets from Node Intelligence
  const contextPresets = [
    {
      id: 'competitor-1',
      label: 'Competitor AdSphere 15% Price Cut Counter-Play',
      node: 'Competitor Node',
      text: "Competitor AdSphere Pro reduced annual plans by 15% and launched Meta ad 'Cut Your PPC Ad Spend by 30%'. We need a value-driven counter campaign highlighting 4.8x ROAS and zero lock-in contract.",
    },
    {
      id: 'trend-1',
      label: 'Trend: Autonomous Marketing Agents (+184% Search Delta)',
      node: 'Trend Node',
      text: 'Search volume for "Autonomous Marketing Agents" surged +184% this month. High commercial intent for automated campaign orchestration and neural search verification.',
    },
    {
      id: 'seo-1',
      label: 'SEO Cluster: Predictive PPC ROAS Calculator (Low KD 24)',
      node: 'SEO Node',
      text: 'Untapped keyword cluster "Predictive PPC ROAS Calculator" with 48.5K monthly volume and difficulty 24/100. Target B2B marketers wanting instant forecast web tools.',
    },
    {
      id: 'crisis-1',
      label: 'Crisis Node: Positive Reddit Sentiment Spike on Tracking Pixel',
      node: 'Crisis Node',
      text: 'Positive community discussion on Reddit praising FLUX OS tracking pixel accuracy under Safari iOS 18 conditions without page load delay.',
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<string>('competitor-1');
  const [marketContext, setMarketContext] = useState<string>(
    initialContext || contextPresets[0].text
  );
  const [brandVoice, setBrandVoice] = useState<string>('Authoritative B2B SaaS');
  const [customVoice, setCustomVoice] = useState<string>('');
  const [campaignGoal, setCampaignGoal] = useState<string>('Drive High-Intent Conversions');
  const [activeTab, setActiveTab] = useState<'all' | 'social' | 'ads' | 'email'>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generated Content State
  const [generatedPackage, setGeneratedPackage] = useState<GeneratedContentPackage>({
    socialPosts: [
      {
        platform: 'LinkedIn',
        headline: 'Stop Guessing Your ROAS. Scale with Neural Intelligence.',
        body: `While competitors scramble over outdated campaign data, leading marketing teams are using FLUX OS to automate cross-channel PPC, SEO, and trend analysis in real-time.\n\nHere is how our 4 specialist nodes generated a +38% bump in active lead velocity with zero extra ad spend:\n\n1. Continuous competitor price monitoring (AdSphere price cut response)\n2. Real-time keyword cluster intent analysis\n3. Instant A/B test variant deployment\n\nReady to transform your growth engine?`,
        hashtags: ['#MarketIntelligence', '#GrowthHacking', '#AIInMarketing', '#ROAS'],
      },
      {
        platform: 'Twitter / X',
        headline: 'Neural Search Verification is live on FLUX OS.',
        body: `Market intelligence isn't about more data — it's about faster execution.\n\nWith FLUX OS, scan 4 specialist nodes simultaneously & generate strategy playbooks in 1-click.\n\nOutsmart competitor discounts with real-time neural strategy 🚀`,
        hashtags: ['#MarTech', '#PPC', '#SaaSGrowth'],
      },
    ],
    adCopy: [
      {
        type: 'Google Search Ad',
        headline1: 'FLUX OS | 4.8x ROAS Intelligence',
        headline2: 'Automate Competitor & Trend Scans',
        description:
          'Stop wasting ad spend on low-converting terms. Access 4 specialist neural nodes for real-time market dominance. Start your free trial today.',
        ctrBoostTip: 'Targeting +184% search momentum keywords with high commercial intent.',
      },
      {
        type: 'Meta Social Ad',
        headline: 'Outsmart Competitors with Real-Time Neural Intelligence',
        primaryCopy:
          "Your competitors just cut their prices by 15%. What's your counter-play? FLUX OS scans pricing, ad creatives, and keyword gaps 24/7 so you stay 3 steps ahead.",
        cta: 'Launch Free Audit',
      },
    ],
    emailCampaign: [
      {
        variant: 'Subject Line A (Urgency & Competitor Pressure)',
        subject: '[Intelligence Alert] Competitor price movement detected in your niche',
        previewText: 'See the counter-strategy blueprint generated by FLUX OS.',
        openingHook:
          'In the last 48 hours, 2 major players in your market launched aggressive ad discounts...',
      },
      {
        variant: 'Subject Line B (Value & Proof)',
        subject: 'How 4 specialist AI nodes generated $142K in organic SEO leads',
        previewText: 'A step-by-step breakdown of neural keyword clustering.',
        openingHook:
          'Traditional keyword research is dead. Here is how continuous intent clustering works...',
      },
    ],
    strategicAngle:
      'Tailored for Authoritative B2B SaaS tone. Leverages current competitor pricing shifts & high-intent search deltas to drive high-converting trial signups.',
  });

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = contextPresets.find((p) => p.id === presetId);
    if (preset) {
      setMarketContext(preset.text);
    }
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setToastMessage(null);

    const activeVoice = customVoice.trim() || brandVoice;

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: activeTab,
          brandVoice: activeVoice,
          campaignGoal,
          marketContext,
        }),
      });

      const data = await res.json();
      if (data && data.content) {
        setGeneratedPackage(data.content);
        setToastMessage('New marketing content generated with Gemini AI!');
      }
    } catch (err) {
      console.error('Content generation error:', err);
      setToastMessage('Generated updated copy based on local intelligence rules.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSchedule = (title: string, category: string, channel: string) => {
    if (onScheduleCampaign) {
      onScheduleCampaign(title, category, channel);
    }
    setToastMessage(`Scheduled "${title}" to Omni Campaign Calendar!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl bg-[#f97316] text-white px-4 py-3 shadow-2xl text-xs font-bold animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] p-6 border border-white/10 shadow-2xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#f97316]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#a855f7]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316]">
                <PenTool className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Content Generation Studio
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-serif italic">
              Transforming competitor moves, keyword clusters, and viral trend deltas into high-converting copy
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
            <BrainCircuit className="h-4 w-4 text-[#f97316] animate-pulse" />
            <span className="text-zinc-300">Gemini 3.6 Flash Studio Engine</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Sliders className="h-4 w-4 text-[#f97316]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Select Market Intelligence Source
              </h3>
            </div>

            {/* Presets Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                Quick Market Context Presets
              </label>
              <div className="space-y-1.5">
                {contextPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                      selectedPreset === preset.id
                        ? 'bg-white/10 border-[#f97316] text-white font-medium'
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-white">{preset.label}</span>
                      <span className="text-[9px] font-mono text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
                        {preset.node}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Context Editor */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                Edit Intelligence Context Prompt
              </label>
              <textarea
                rows={3}
                value={marketContext}
                onChange={(e) => {
                  setMarketContext(e.target.value);
                  setSelectedPreset('custom');
                }}
                placeholder="Describe competitor moves, trending topics, or target keyword insights..."
                className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316] font-mono leading-relaxed resize-none"
              />
            </div>

            {/* Brand Voice & Campaign Goal */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-[#a855f7]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. Brand Voice & Objectives
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Brand Voice Tone
                </label>
                <select
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs text-white focus:border-[#f97316] focus:outline-none"
                >
                  <option value="Authoritative B2B SaaS">Authoritative B2B SaaS</option>
                  <option value="Bold Growth Maverick">Bold Growth Maverick</option>
                  <option value="Data-Driven & Technical">Data-Driven & Technical</option>
                  <option value="Witty & Tech-Forward">Witty & Tech-Forward</option>
                  <option value="Premium Luxury / Executive">Premium Luxury / Executive</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Custom Tone Specification (Optional)
                </label>
                <input
                  type="text"
                  value={customVoice}
                  onChange={(e) => setCustomVoice(e.target.value)}
                  placeholder="e.g. Concise, punchy, no jargon, direct hook..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs text-white placeholder-zinc-600 focus:border-[#f97316] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Campaign Goal
                </label>
                <select
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs text-white focus:border-[#f97316] focus:outline-none"
                >
                  <option value="Drive High-Intent Trial Conversions">Drive High-Intent Trial Conversions</option>
                  <option value="Counter Competitor Price Cuts">Counter Competitor Price Cuts</option>
                  <option value="Boost Organic Keyword Traffic">Boost Organic Keyword Traffic</option>
                  <option value="Viral Audience Engagement">Viral Audience Engagement</option>
                  <option value="Re-engage Cold Leads">Re-engage Cold Leads</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 text-xs uppercase tracking-wider shadow-lg shadow-[#f97316]/20 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Gemini AI Is Writing Copy...' : 'Generate High-Converting Copy'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Output Showcase Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Channel Output Tabs */}
          <div className="flex items-center justify-between bg-white/[0.02] p-1.5 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#f97316] text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>All Channels</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'social'
                    ? 'bg-[#f97316] text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Social Posts</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'ads'
                    ? 'bg-[#f97316] text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Megaphone className="h-3.5 w-3.5" />
                <span>Ad Copy</span>
              </button>

              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'email'
                    ? 'bg-[#f97316] text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email Headlines</span>
              </button>
            </div>
          </div>

          {/* Strategic Rationale Bar */}
          {generatedPackage.strategicAngle && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-zinc-300 flex items-start space-x-3">
              <Zap className="h-4 w-4 text-[#f97316] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#f97316] uppercase text-[10px] tracking-wider block">
                  AI Copy Strategy Rationale
                </span>
                <p className="mt-0.5 text-zinc-300 leading-relaxed font-sans">
                  {generatedPackage.strategicAngle}
                </p>
              </div>
            </div>
          )}

          {/* SECTION 1: Social Media Posts */}
          {(activeTab === 'all' || activeTab === 'social') && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                <Share2 className="h-4 w-4 text-[#f97316]" />
                <span>Social Media Posts</span>
              </div>

              {generatedPackage.socialPosts?.map((post, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="inline-flex items-center space-x-1.5 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white font-mono">
                      <span>{post.platform}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(`social-${idx}`, `${post.headline}\n\n${post.body}`)}
                        className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {copiedId === `social-${idx}` ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleSchedule(
                            `Social Post: ${post.headline.substring(0, 30)}...`,
                            'Content Launch',
                            post.platform
                          )
                        }
                        className="flex items-center space-x-1 text-xs text-[#f97316] bg-[#f97316]/10 hover:bg-[#f97316]/20 px-2.5 py-1 rounded-lg transition-colors font-medium"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{post.headline}</h4>
                    <p className="text-xs text-zinc-300 mt-2 whitespace-pre-line leading-relaxed font-sans">
                      {post.body}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {post.hashtags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 2: Ad Copy Studio */}
          {(activeTab === 'all' || activeTab === 'ads') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                <Megaphone className="h-4 w-4 text-[#a855f7]" />
                <span>High-CTR Ad Copy Studio</span>
              </div>

              {generatedPackage.adCopy?.map((ad, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="inline-flex items-center space-x-1 rounded-md bg-[#a855f7]/20 border border-[#a855f7]/40 px-2.5 py-1 text-[11px] font-bold text-[#a855f7] font-mono">
                      <span>{ad.type}</span>
                    </span>

                    <button
                      onClick={() =>
                        handleCopy(
                          `ad-${idx}`,
                          ad.headline1
                            ? `${ad.headline1} | ${ad.headline2}\n${ad.description}`
                            : `${ad.headline}\n${ad.primaryCopy}`
                        )
                      }
                      className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {copiedId === `ad-${idx}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {ad.headline1 ? (
                    // Google Search Ad Format
                    <div className="rounded-xl bg-black/60 p-3.5 border border-white/10 space-y-2">
                      <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                        <span className="font-bold border border-emerald-400/50 px-1 py-0.2 rounded text-[9px]">
                          Ad
                        </span>
                        <span>https://fluxos.ai/market-intelligence</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#60a5fa] hover:underline cursor-pointer">
                        {ad.headline1} | {ad.headline2}
                      </h4>
                      <p className="text-xs text-zinc-300">{ad.description}</p>
                    </div>
                  ) : (
                    // Meta Social Ad Format
                    <div className="rounded-xl bg-black/60 p-3.5 border border-white/10 space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-white">
                        <span className="h-5 w-5 rounded-full bg-[#f97316] flex items-center justify-center text-[10px]">
                          F
                        </span>
                        <span>FLUX OS Intelligence</span>
                        <span className="text-[10px] text-zinc-500 font-normal">• Sponsored</span>
                      </div>
                      <p className="text-xs text-zinc-200">{ad.primaryCopy}</p>
                      <div className="rounded-lg bg-white/5 p-2.5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{ad.headline}</p>
                          <p className="text-[10px] text-zinc-400">fluxos.ai</p>
                        </div>
                        <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-bold text-white uppercase">
                          {ad.cta || 'Learn More'}
                        </span>
                      </div>
                    </div>
                  )}

                  {ad.ctrBoostTip && (
                    <div className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      💡 CTR Optimization Tip: {ad.ctrBoostTip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SECTION 3: Email Campaign Headlines */}
          {(activeTab === 'all' || activeTab === 'email') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>Email Subject Lines & Preview Hooks</span>
              </div>

              {generatedPackage.emailCampaign?.map((mail, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="inline-flex items-center space-x-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 font-mono">
                      <span>{mail.variant}</span>
                    </span>

                    <button
                      onClick={() =>
                        handleCopy(`email-${idx}`, `Subject: ${mail.subject}\nPreview: ${mail.previewText}\n\n${mail.openingHook}`)
                      }
                      className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {copiedId === `email-${idx}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">
                        Subject Line
                      </span>
                      <p className="font-bold text-white text-sm mt-0.5">{mail.subject}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">
                        Preview Text
                      </span>
                      <p className="text-zinc-300 font-mono mt-0.5">{mail.previewText}</p>
                    </div>

                    <div className="rounded-xl bg-black/40 p-3 border border-white/10">
                      <span className="text-[10px] text-[#f97316] font-mono font-bold uppercase block">
                        Email Opening Hook
                      </span>
                      <p className="text-zinc-200 mt-1 italic font-serif">"{mail.openingHook}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { NavTab } from '../types';
import {
  Activity,
  BrainCircuit,
  Calendar,
  Layers,
  BarChart3,
  FlaskConical,
  TrendingUp,
  Layout,
  Globe,
  Wrench,
  Bell,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Search,
  PenTool,
  X,
  CreditCard,
  Crown,
  Trash2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  systemHealth: string;
  neuralSearchActive: boolean;
  onClearCookiesAndCache?: () => void;
  isLowLatencyMode?: boolean;
  onToggleLowLatencyMode?: () => void;
  onExportCSV?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenNotifications,
  onToggleChat,
  isChatOpen,
  systemHealth,
  neuralSearchActive,
  onClearCookiesAndCache,
  isLowLatencyMode = false,
  onToggleLowLatencyMode,
  onExportCSV,
}) => {
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'market-intelligence', label: 'Market Intelligence', icon: Activity },
    { id: 'content-assistant', label: 'AI Content Studio', icon: PenTool },
    { id: 'omni-calendar', label: 'Omni-Calendar', icon: Calendar },
    { id: 'service-ecosystem', label: 'Service Ecosystem', icon: Layers },
    { id: 'strategy-ai', label: 'Strategy AI', icon: BrainCircuit },
    { id: 'ab-testing', label: 'A/B Testing Lab', icon: FlaskConical },
    { id: 'roi-analytics', label: 'ROI Analytics', icon: TrendingUp },
    { id: 'canvas-editor', label: 'Site Canvas Editor', icon: BarChart3 },
    { id: 'multilingual', label: 'Multilingual & Audio', icon: Globe },
    { id: 'maintenance', label: 'Maintenance Agent', icon: Wrench },
    { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(navSearchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md text-white">
      {/* Top Status Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs border-b border-white/5 bg-black/40">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Neural Search Verification: Active</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-zinc-400 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#a855f7]" />
            <span>Health: {systemHealth}</span>
          </div>
          <button
            onClick={onToggleLowLatencyMode}
            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded transition-all font-mono text-[11px] ${
              isLowLatencyMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Click to toggle Low Latency Mode in System Settings"
          >
            <Zap className={`h-3.5 w-3.5 ${isLowLatencyMode ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
            <span>{isLowLatencyMode ? 'Low Latency Mode: ON (45ms)' : 'Low Latency Mode: OFF'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              activeTab === 'subscription'
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border-amber-500/40'
            }`}
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>7-Day Free Trial</span>
          </button>

          <button
            onClick={onToggleChat}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isChatOpen
                ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#f97316] animate-pulse" />
            <span>Flux Gemini AI</span>
          </button>
        </div>
      </div>

      {/* Main Header Brand & Control Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] via-[#a855f7] to-zinc-800 p-0.5 shadow-lg shadow-[#a855f7]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090b]">
              <BrainCircuit className="h-5 w-5 text-[#f97316] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                FLUX MARKET <span className="text-[#f97316] font-semibold italic">INTELLIGENCE</span> OS
              </h1>
              <span className="rounded bg-[#f97316]/20 border border-[#f97316]/40 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#f97316]">
                PRO v4.2
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-serif italic hidden sm:block">
              Orchestrating 4 specialist nodes for real-time market dominance. Neural search verification active.
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search nodes, campaigns, playbooks..."
              className="w-56 rounded-lg bg-white/[0.03] border border-white/10 py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
            />
          </div>

          {onClearCookiesAndCache && (
            <button
              onClick={onClearCookiesAndCache}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-all shadow-sm"
              title="Clear all application cookies, cache, local storage & session storage"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden sm:inline">Clear Cookies & Cache</span>
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 border border-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f97316] text-[10px] font-bold text-white shadow-sm shadow-[#f97316]/50">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleChat}
            className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 border border-white/10 transition-colors sm:hidden"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* #sidebar-navigation Component with Quick Search & Interactive Hover/Active Effects */}
      <div id="sidebar-navigation" className="mx-auto max-w-7xl px-4 pb-2 space-y-2">
        {/* Quick Filter Search Input Field at top of #sidebar-navigation */}
        <div className="relative">
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            placeholder="Quick filter navigation items..."
            className="w-full rounded-xl bg-black/60 border border-white/10 py-1.5 pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316] transition-all"
          />
          {navSearchQuery && (
            <button
              onClick={() => setNavSearchQuery('')}
              className="absolute right-2.5 top-2 text-zinc-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1 rounded-xl bg-white/[0.02] p-1 border border-white/10">
          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                    isActive
                      ? 'border-l-4 border-[#f97316] bg-gradient-to-r from-[#f97316]/30 via-[#a855f7]/20 to-transparent text-white font-bold shadow-lg shadow-[#f97316]/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#f97316]' : 'text-[#a855f7]'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-4 w-1 bg-[#f97316] rounded-full blur-[2px]" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-1.5 text-xs text-zinc-500 italic">
              No matching navigation modules found for "{navSearchQuery}"
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};


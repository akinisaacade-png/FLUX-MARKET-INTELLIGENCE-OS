import React, { useState, useEffect } from 'react';
import { clearAllCookiesAndCache, ClearStorageResult } from './utils/storageUtils';
import { exportOverviewToCSV } from './utils/csvExportUtils';
import {
  subscribeToNodeActivities,
  saveNodeActivityToFirebase,
  deleteNodeActivityFromFirebase,
  subscribeToCampaignEvents,
  saveCampaignToFirebase,
} from './lib/firebaseSync';
import { CheckCircle2, Trash2, Database, ShieldCheck, X, RefreshCw } from 'lucide-react';
import { NavTab, NodeType, CampaignEvent, ABExperiment } from './types';
import {
  initialMetricCards,
  initialNodeActivities,
  initialRevenueChartData,
  initialSystemUpdates,
  initialCampaignEvents,
  initialServices,
  initialExperiments,
  initialNotifications,
} from './data/initialData';

import { Header } from './components/Header';
import { HeroPanel } from './components/HeroPanel';
import { MetricCards } from './components/MetricCards';
import { RevenueChart } from './components/RevenueChart';
import { NodeActivityPanel } from './components/NodeActivityPanel';
import { QuickExecutionPanel } from './components/QuickExecutionPanel';
import { RecentSystemUpdates } from './components/RecentSystemUpdates';

import { OmniCalendarView } from './components/OmniCalendarView';
import { ServiceEcosystemView } from './components/ServiceEcosystemView';
import { MarketIntelligenceView } from './components/MarketIntelligenceView';
import { ContentAssistantView } from './components/ContentAssistantView';
import { StrategyAIView } from './components/StrategyAIView';
import { ABTestingLabView } from './components/ABTestingLabView';
import { ROIAnalyticsView } from './components/ROIAnalyticsView';
import { CanvasEditorView } from './components/CanvasEditorView';
import { MultilingualAIView } from './components/MultilingualAIView';
import { MaintenanceAgentView } from './components/MaintenanceAgentView';
import { SubscriptionView } from './components/SubscriptionView';

import { GeminiChatbotDrawer } from './components/GeminiChatbotDrawer';
import { PushNotificationCenter } from './components/PushNotificationCenter';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  // Core State
  const [metricCards, setMetricCards] = useState(initialMetricCards);
  const [nodeActivities, setNodeActivities] = useState(initialNodeActivities);
  const [revenueData] = useState(initialRevenueChartData);
  const [systemUpdates, setSystemUpdates] = useState(initialSystemUpdates);
  const [campaigns, setCampaigns] = useState(initialCampaignEvents);
  const [services] = useState(initialServices);
  const [experiments, setExperiments] = useState(initialExperiments);
  const [notifications, setNotifications] = useState(initialNotifications);

  // System Settings & Latency Management
  const [isLowLatencyMode, setIsLowLatencyMode] = useState<boolean>(false);
  const [latencyThreshold, setLatencyThreshold] = useState<number>(500); // ms
  const [nodeLatencies, setNodeLatencies] = useState<Record<NodeType, number>>({
    competitor: 240,
    trend: 310,
    seo: 190,
    crisis: 620, // Exceeds 500ms initial threshold -> triggers automated alert!
  });

  // Automated Latency Monitoring & Notification Trigger Effect
  useEffect(() => {
    if (isLowLatencyMode) {
      setNodeLatencies({ competitor: 42, trend: 55, seo: 38, crisis: 65 });
      return;
    }

    const interval = setInterval(() => {
      const updated: Record<NodeType, number> = {
        competitor: Math.floor(180 + Math.random() * 320),
        trend: Math.floor(220 + Math.random() * 380),
        seo: Math.floor(140 + Math.random() * 290),
        crisis: Math.floor(280 + Math.random() * 460),
      };
      setNodeLatencies(updated);

      const nodeNames: Record<NodeType, string> = {
        competitor: 'Competitor Node',
        trend: 'Trend Node',
        seo: 'SEO Node',
        crisis: 'Crisis Node',
      };

      (Object.keys(updated) as NodeType[]).forEach((n) => {
        if (updated[n] > latencyThreshold) {
          const nodeName = nodeNames[n];
          setNotifications((prev) => {
            const alreadyAlerted = prev.some(
              (notif) => notif.title.includes('High Latency Alert') && notif.message.includes(nodeName)
            );
            if (alreadyAlerted) return prev;

            return [
              {
                id: `notif_lat_${Date.now()}`,
                title: `High Latency Alert: ${nodeName}`,
                message: `${nodeName} response latency (${updated[n]}ms) exceeded target threshold (${latencyThreshold}ms). Enable 'Low Latency Mode' in System Settings to optimize.`,
                type: 'warning',
                timestamp: 'Just now',
                read: false,
              },
              ...prev,
            ];
          });
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLowLatencyMode, latencyThreshold]);

  const handleToggleLowLatencyMode = () => {
    setIsLowLatencyMode((prev) => {
      const nextVal = !prev;
      if (nextVal) {
        setNodeLatencies({ competitor: 42, trend: 55, seo: 38, crisis: 65 });
        setNotifications((p) => [
          {
            id: `notif_low_${Date.now()}`,
            title: 'Low Latency Mode Activated',
            message: 'Neural edge acceleration and priority routing active. Average latency reduced to 45ms.',
            type: 'success',
            timestamp: 'Just now',
            read: false,
          },
          ...p,
        ]);
      } else {
        setNodeLatencies({ competitor: 240, trend: 310, seo: 190, crisis: 620 });
        setNotifications((p) => [
          {
            id: `notif_std_${Date.now()}`,
            title: 'Standard Latency Mode Enabled',
            message: 'Returned to standard multi-region node routing.',
            type: 'info',
            timestamp: 'Just now',
            read: false,
          },
          ...p,
        ]);
      }
      return nextVal;
    });
  };

  const handleExportOverviewCSV = () => {
    const result = exportOverviewToCSV(metricCards, campaigns, nodeActivities, revenueData);
    setNotifications((prev) => [
      {
        id: `notif_csv_${Date.now()}`,
        title: 'Overview Analytics Exported (CSV)',
        message: `Exported ${result.rowCount} data records to ${result.fileName} containing metrics, campaign event logs, and node telemetry.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  // Real-time Firebase Firestore Sync
  useEffect(() => {
    const unsubActivities = subscribeToNodeActivities((remoteActivities) => {
      if (remoteActivities && remoteActivities.length > 0) {
        setNodeActivities(remoteActivities);
      }
    });

    const unsubCampaigns = subscribeToCampaignEvents((remoteCampaigns) => {
      if (remoteCampaigns && remoteCampaigns.length > 0) {
        setCampaigns(remoteCampaigns);
      }
    });

    return () => {
      unsubActivities();
      unsubCampaigns();
    };
  }, []);

  // Drawer / Modal states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [contentContext, setContentContext] = useState('');

  // Clear Storage Modal state
  const [clearModalResult, setClearModalResult] = useState<ClearStorageResult | null>(null);
  const [isClearingStorage, setIsClearingStorage] = useState(false);

  // Clear All Cookies and Cache Action
  const handleClearCookiesAndCache = async () => {
    setIsClearingStorage(true);
    try {
      const result = await clearAllCookiesAndCache();
      setClearModalResult(result);

      // Add a system push notification
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Cookies & Cache Cleared',
          message: `Purged ${result.cookiesCleared} cookies, local storage, session storage & cache storage.`,
          type: 'success',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Error clearing storage:', err);
    } finally {
      setIsClearingStorage(false);
    }
  };

  // Node running loading state
  const [runningNodes, setRunningNodes] = useState<Record<NodeType, boolean>>({
    competitor: false,
    trend: false,
    seo: false,
    crisis: false,
  });

  // Execute single neural node
  const handleRunNode = async (nodeType: NodeType) => {
    setRunningNodes((prev) => ({ ...prev, [nodeType]: true }));

    try {
      const res = await fetch('/api/nodes/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeType }),
      });
      const result = await res.json();

      setNodeActivities((prev) =>
        prev.map((act) => {
          if (act.nodeType === nodeType) {
            return {
              ...act,
              status: 'synced',
              timestamp: 'Just now',
              description: result.rawAnalysis || result.data?.summary || act.description,
            };
          }
          return act;
        })
      );

      // Add push notification
      const newNotif = {
        id: `notif_${Date.now()}`,
        title: `${nodeType.toUpperCase()} Node Audit Completed`,
        message: `Successfully executed real-time neural scan for ${nodeType} node.`,
        type: 'success' as const,
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setLastSyncTime('Just now');
    } catch (err) {
      console.error('Node execution error:', err);
    } finally {
      setTimeout(() => {
        setRunningNodes((prev) => ({ ...prev, [nodeType]: false }));
      }, 800);
    }
  };

  // Execute all 4 nodes
  const handleRunAllNodes = async () => {
    const types: NodeType[] = ['competitor', 'trend', 'seo', 'crisis'];
    for (const t of types) {
      await handleRunNode(t);
    }
  };

  // Quick Action Job Runner
  const handleRunJob = async (jobType: string) => {
    try {
      if (jobType === 'maintenanceRun') {
        await fetch('/api/maintenance/run', { method: 'POST' });
      } else {
        await fetch('/api/jobs/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobType }),
        });
      }

      setNotifications((prev) => [
        {
          id: `n_${Date.now()}`,
          title: `Job Executed: ${jobType}`,
          message: `Backend job workflow '${jobType}' completed.`,
          type: 'info',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Job error:', err);
    }
  };

  // Comment Thread Handler
  const handleAddComment = (updateId: string, commentText: string) => {
    setSystemUpdates((prev) =>
      prev.map((upd) => {
        if (upd.id === updateId) {
          return {
            ...upd,
            comments: [
              ...upd.comments,
              {
                id: `c_${Date.now()}`,
                user: 'You (Operations Lead)',
                text: commentText,
                time: 'Just now',
              },
            ],
          };
        }
        return upd;
      })
    );
  };

  // System Update Status Toggle
  const handleToggleStatus = (updateId: string) => {
    setSystemUpdates((prev) =>
      prev.map((upd) => {
        if (upd.id === updateId) {
          return {
            ...upd,
            status: upd.status === 'open' ? ('resolved' as const) : ('open' as const),
          };
        }
        return upd;
      })
    );
  };

  // Add Campaign Handler
  const handleAddCampaign = (evt: Partial<CampaignEvent>) => {
    const newEvt: CampaignEvent = {
      id: `evt_${Date.now()}`,
      title: evt.title || 'New Marketing Campaign',
      category: evt.category || 'PPC Campaign',
      date: evt.date || '2026-08-01',
      time: evt.time || '10:00 AM',
      status: 'scheduled',
      assignee: evt.assignee || 'Flux AI Agent',
      channel: evt.channel || 'Google Search Ads',
      budget: evt.budget || '$5,000',
    };
    setCampaigns((prev) => [newEvt, ...prev]);
    saveCampaignToFirebase(newEvt);
  };

  // Add & Delete Node Protocol Activity Handlers
  const handleAddNodeActivity = (activity: any) => {
    setNodeActivities((prev) => [activity, ...prev]);
    saveNodeActivityToFirebase(activity);
  };

  const handleDeleteNodeActivity = (id: string) => {
    setNodeActivities((prev) => prev.filter((a) => a.id !== id));
    deleteNodeActivityFromFirebase(id);
  };

  // Add & Delete System Update Handlers
  const handleAddSystemUpdate = (update: any) => {
    setSystemUpdates((prev) => [update, ...prev]);
  };

  const handleDeleteSystemUpdate = (id: string) => {
    setSystemUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  // Add Experiment Handler
  const handleAddExperiment = (exp: ABExperiment) => {
    setExperiments((prev) => [exp, ...prev]);
  };

  // Reset Metrics to baseline
  const handleResetMetrics = () => {
    setMetricCards(initialMetricCards);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-[#f97316] selection:text-white overflow-x-hidden">
      {/* Top Radial Glow matching Sophisticated Dark theme */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#a855f7_0%,transparent_50%)] h-[600px] w-full z-0" />

      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadNotifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        systemHealth="99.8%"
        neuralSearchActive={true}
        onClearCookiesAndCache={handleClearCookiesAndCache}
        isLowLatencyMode={isLowLatencyMode}
        onToggleLowLatencyMode={handleToggleLowLatencyMode}
        onExportCSV={handleExportOverviewCSV}
      />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Render View based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Panel */}
            <HeroPanel
              onRunAllNodes={handleRunAllNodes}
              onOpenPlaybookModal={() => setActiveTab('strategy-ai')}
              onDownloadBlueprint={() => handleRunJob('downloadBlueprint')}
              onExportCSV={handleExportOverviewCSV}
              isNodeRunning={Object.values(runningNodes).some(Boolean)}
              lastSyncTime={lastSyncTime}
              isLowLatencyMode={isLowLatencyMode}
            />

            {/* Key Metric Cards */}
            <MetricCards
              metrics={metricCards}
              onResetMetrics={handleResetMetrics}
              onUpdateMetrics={(updated) => setMetricCards(updated)}
            />

            {/* Revenue Performance Graph & Quick Execution Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart data={revenueData} />
              </div>
              <div>
                <QuickExecutionPanel onRunJob={handleRunJob} />
              </div>
            </div>

            {/* Specialist Node Activity Panel */}
            <NodeActivityPanel
              activities={nodeActivities}
              onRunNode={handleRunNode}
              runningNodes={runningNodes}
              onAddActivity={handleAddNodeActivity}
              onDeleteActivity={handleDeleteNodeActivity}
              isLowLatencyMode={isLowLatencyMode}
              onToggleLowLatencyMode={handleToggleLowLatencyMode}
              latencyThreshold={latencyThreshold}
              onChangeLatencyThreshold={setLatencyThreshold}
              nodeLatencies={nodeLatencies}
            />

            {/* Recent System Updates & Comments */}
            <RecentSystemUpdates
              updates={systemUpdates}
              onAddComment={handleAddComment}
              onToggleStatus={handleToggleStatus}
              onAddUpdate={handleAddSystemUpdate}
              onDeleteUpdate={handleDeleteSystemUpdate}
            />
          </div>
        )}

        {activeTab === 'omni-calendar' && (
          <OmniCalendarView events={campaigns} onAddEvent={handleAddCampaign} />
        )}

        {activeTab === 'service-ecosystem' && <ServiceEcosystemView services={services} />}

        {activeTab === 'market-intelligence' && (
          <MarketIntelligenceView
            nodeActivities={nodeActivities}
            onRunNode={handleRunNode}
            runningNodes={runningNodes}
            onNavigateToContentAssistant={(ctx) => {
              setContentContext(ctx);
              setActiveTab('content-assistant');
            }}
          />
        )}

        {activeTab === 'content-assistant' && (
          <ContentAssistantView
            initialContext={contentContext}
            onScheduleCampaign={(title, category, channel) => {
              handleAddCampaign({
                title,
                category: category as any,
                channel,
                date: new Date().toISOString().split('T')[0],
              });
            }}
          />
        )}

        {activeTab === 'strategy-ai' && <StrategyAIView />}

        {activeTab === 'ab-testing' && (
          <ABTestingLabView experiments={experiments} onAddExperiment={handleAddExperiment} />
        )}

        {activeTab === 'roi-analytics' && <ROIAnalyticsView />}

        {activeTab === 'canvas-editor' && <CanvasEditorView />}

        {activeTab === 'multilingual' && <MultilingualAIView />}

        {activeTab === 'maintenance' && <MaintenanceAgentView />}

        {activeTab === 'subscription' && <SubscriptionView />}
      </main>

      {/* Gemini Chatbot Drawer */}
      <GeminiChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Push Notification Center */}
      <PushNotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      {/* Clear Storage Confirmation Modal */}
      {clearModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/30 bg-[#0f0a19] p-6 shadow-2xl text-white space-y-4">
            <button
              onClick={() => setClearModalResult(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Cookies & Cache Purged
                </h3>
                <p className="text-xs text-rose-300/80 font-mono">
                  Execution completed at {clearModalResult.timestamp}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              All browser storage items, document cookies, cache storage, and session keys for this domain have been completely cleared.
            </p>

            <div className="rounded-xl border border-white/10 bg-black/50 p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Document Cookies:</span>
                </span>
                <span className="text-emerald-400 font-bold">{clearModalResult.cookiesCleared} cleared</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>LocalStorage:</span>
                </span>
                <span className="text-emerald-400 font-bold">Purged</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>SessionStorage:</span>
                </span>
                <span className="text-emerald-400 font-bold">Purged</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>CacheStorage Caches:</span>
                </span>
                <span className="text-emerald-400 font-bold">{clearModalResult.cachesCleared} caches deleted</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Server Clear-Site-Data:</span>
                </span>
                <span className="text-emerald-400 font-bold">Signal Sent</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setClearModalResult(null)}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold py-2.5 text-xs shadow-lg shadow-rose-500/20 transition-all"
              >
                Close Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-5 text-center text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FLUX MARKET INTELLIGENCE OS • Neural Strategy & Specialist Node Control Panel</span>
          <span>Low-Latency Gemini AI Enabled • Multi-Tenant Architecture</span>
        </div>
      </footer>
    </div>
  );
}

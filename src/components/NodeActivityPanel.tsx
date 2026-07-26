import React, { useState, useEffect } from 'react';
import { NodeProtocolActivity, NodeType } from '../types';
import {
  Cpu,
  TrendingUp,
  Search,
  AlertTriangle,
  Play,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  RefreshCw,
  Download,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Clock,
  Settings,
  Power,
  RotateCcw,
  Check,
  Bell,
} from 'lucide-react';

interface NodeActivityPanelProps {
  activities: NodeProtocolActivity[];
  onRunNode: (nodeType: NodeType) => void;
  runningNodes: Record<NodeType, boolean>;
  onAddActivity?: (activity: NodeProtocolActivity) => void;
  onDeleteActivity?: (id: string) => void;
  isLowLatencyMode?: boolean;
  onToggleLowLatencyMode?: () => void;
  latencyThreshold?: number;
  onChangeLatencyThreshold?: (val: number) => void;
  nodeLatencies?: Record<NodeType, number>;
}

interface NodeScheduleConfig {
  enabled: boolean;
  intervalLabel: string;
  intervalSeconds: number;
  nextRunSeconds: number;
  lastExecutionTime?: string;
}

export const NodeActivityPanel: React.FC<NodeActivityPanelProps> = ({
  activities: initialActivities,
  onRunNode,
  runningNodes,
  onAddActivity,
  onDeleteActivity,
  isLowLatencyMode = false,
  onToggleLowLatencyMode,
  latencyThreshold = 500,
  onChangeLatencyThreshold,
  nodeLatencies = { competitor: 240, trend: 310, seo: 190, crisis: 620 },
}) => {
  const [localActivities, setLocalActivities] = useState<NodeProtocolActivity[]>(initialActivities);

  // Sync if props change
  const currentActivities = onDeleteActivity ? initialActivities : localActivities;

  const [selectedNode, setSelectedNode] = useState<NodeType | 'all'>('all');
  const [activeDetail, setActiveDetail] = useState<NodeProtocolActivity | null>(null);

  // System Settings & Latency Drawer State
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Add Activity Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addNodeType, setAddNodeType] = useState<NodeType>('competitor');
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addAction, setAddAction] = useState('');
  const [addSeverity, setAddSeverity] = useState<'high' | 'medium' | 'positive'>('medium');

  // Automated Node Execution Schedule State
  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [scheduleToast, setScheduleToast] = useState<string | null>(null);

  const [nodeSchedules, setNodeSchedules] = useState<Record<NodeType, NodeScheduleConfig>>({
    competitor: {
      enabled: true,
      intervalLabel: '1 hour',
      intervalSeconds: 3600,
      nextRunSeconds: 3420,
      lastExecutionTime: '10 mins ago',
    },
    trend: {
      enabled: true,
      intervalLabel: '3 hours',
      intervalSeconds: 10800,
      nextRunSeconds: 7200,
      lastExecutionTime: '1 hour ago',
    },
    seo: {
      enabled: false,
      intervalLabel: '6 hours',
      intervalSeconds: 21600,
      nextRunSeconds: 21600,
      lastExecutionTime: 'Never',
    },
    crisis: {
      enabled: true,
      intervalLabel: '1 hour',
      intervalSeconds: 3600,
      nextRunSeconds: 1800,
      lastExecutionTime: '30 mins ago',
    },
  });

  // Countdown and Automated Trigger Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setNodeSchedules((prevSchedules) => {
        const nextState = { ...prevSchedules };
        let updated = false;

        (Object.keys(nextState) as NodeType[]).forEach((nodeType) => {
          const config = nextState[nodeType];
          if (config.enabled) {
            if (config.nextRunSeconds <= 1) {
              // Trigger automated execution!
              onRunNode(nodeType);
              nextState[nodeType] = {
                ...config,
                nextRunSeconds: config.intervalSeconds,
                lastExecutionTime: `${new Date().toLocaleTimeString()} (Auto-Run)`,
              };
              updated = true;
            } else {
              nextState[nodeType] = {
                ...config,
                nextRunSeconds: config.nextRunSeconds - 1,
              };
              updated = true;
            }
          }
        });

        return updated ? nextState : prevSchedules;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRunNode]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatCountdown = (totalSeconds: number) => {
    if (totalSeconds <= 0) return 'Executing now...';
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Helper to change schedule interval
  const handleUpdateScheduleInterval = (nodeType: NodeType, intervalLabel: string, seconds: number) => {
    setNodeSchedules((prev) => ({
      ...prev,
      [nodeType]: {
        ...prev[nodeType],
        intervalLabel,
        intervalSeconds: seconds,
        nextRunSeconds: seconds,
      },
    }));
    triggerScheduleToast(`Updated ${nodeType.toUpperCase()} node schedule interval to ${intervalLabel}`);
  };

  // Toggle node schedule active status
  const handleToggleScheduleEnabled = (nodeType: NodeType) => {
    setNodeSchedules((prev) => {
      const current = prev[nodeType];
      const newEnabled = !current.enabled;
      triggerScheduleToast(`${newEnabled ? 'Enabled' : 'Paused'} automated schedule for ${nodeType.toUpperCase()} node`);
      return {
        ...prev,
        [nodeType]: {
          ...current,
          enabled: newEnabled,
          nextRunSeconds: newEnabled ? current.intervalSeconds : current.nextRunSeconds,
        },
      };
    });
  };

  // Batch update all nodes to 'every 1 hour'
  const handleSetAllToOneHour = () => {
    setNodeSchedules((prev) => {
      const updated: Record<NodeType, NodeScheduleConfig> = { ...prev };
      (Object.keys(updated) as NodeType[]).forEach((n) => {
        updated[n] = {
          ...updated[n],
          enabled: true,
          intervalLabel: '1 hour',
          intervalSeconds: 3600,
          nextRunSeconds: 3600,
        };
      });
      return updated;
    });
    triggerScheduleToast('Set all 4 Specialist Nodes to execute every 1 hour');
  };

  const triggerScheduleToast = (msg: string) => {
    setScheduleToast(msg);
    setTimeout(() => {
      setScheduleToast(null);
    }, 3000);
  };

  // CSV Export for Node Protocol Activity
  const handleDownloadCSV = () => {
    const headers = [
      'Node ID',
      'Node Type',
      'Node Name',
      'Title',
      'Description',
      'Timestamp',
      'Severity',
      'Status',
      'Actionable Strategy',
    ];

    const rows = currentActivities.map((act) => [
      `"${act.id}"`,
      `"${act.nodeType}"`,
      `"${act.nodeName}"`,
      `"${act.title.replace(/"/g, '""')}"`,
      `"${act.description.replace(/"/g, '""')}"`,
      `"${act.timestamp}"`,
      `"${act.severity}"`,
      `"${act.status}"`,
      `"${(act.actionRequired || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `flux_node_protocol_activity_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) return;

    const nodeNameMap: Record<NodeType, string> = {
      competitor: 'COMPETITOR RADAR NODE',
      trend: 'TREND HYPER-SCANNER',
      seo: 'ORGANIC CLUSTER RADAR',
      crisis: 'SENTIMENT SENTINEL',
    };

    const formattedTime = `${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} today (${new Date().toLocaleDateString()})`;

    const newActivity: NodeProtocolActivity = {
      id: `act_${Date.now()}`,
      nodeType: addNodeType,
      nodeName: nodeNameMap[addNodeType],
      title: addTitle.trim(),
      description: addDesc.trim() || 'Custom intelligence protocol report added manually.',
      timestamp: formattedTime,
      severity: addSeverity,
      status: 'synced',
      actionRequired: addAction.trim() || 'Review newly created node telemetry.',
      metadata: [{ label: 'Source', value: 'Manual AI Tool Input' }],
    };

    if (onAddActivity) {
      onAddActivity(newActivity);
    } else {
      setLocalActivities((prev) => [newActivity, ...prev]);
    }

    setAddTitle('');
    setAddDesc('');
    setAddAction('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    if (onDeleteActivity) {
      onDeleteActivity(id);
    } else {
      setLocalActivities((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const getNodeIcon = (nodeType: NodeType) => {
    switch (nodeType) {
      case 'competitor':
        return <Cpu className="h-4 w-4 text-orange-400" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-purple-400" />;
      case 'seo':
        return <Search className="h-4 w-4 text-amber-400" />;
      case 'crisis':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'positive':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  const filteredActivities =
    selectedNode === 'all'
      ? currentActivities
      : currentActivities.filter((act) => act.nodeType === selectedNode);

  const getNodeLeftBorder = (nodeType: NodeType) => {
    switch (nodeType) {
      case 'competitor':
        return 'border-l-2 border-[#a855f7]';
      case 'trend':
        return 'border-l-2 border-[#f97316]';
      case 'seo':
        return 'border-l-2 border-white/40';
      case 'crisis':
        return 'border-l-2 border-rose-500';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#f97316]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Node Protocol Activity
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            4 Specialist Neural Nodes scanning competitor moves, trends, SEO clusters, & crisis sentiment
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Settings & Latency Control Button */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              showSettingsDrawer
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-md shadow-purple-500/10'
                : isLowLatencyMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
            title="System Settings & Node Latency Configuration"
          >
            <Settings className="h-3.5 w-3.5 text-purple-400" />
            <span>Settings & Latency</span>
            {isLowLatencyMode ? (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-black font-extrabold">LOW LATENCY</span>
            ) : (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">{latencyThreshold}ms</span>
            )}
          </button>

          {/* Schedule Settings Button */}
          <button
            onClick={() => setShowScheduleDrawer(!showScheduleDrawer)}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              showScheduleDrawer
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Automated Scheduling</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 text-xs font-bold transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-[#f97316]" />
            <span>{showAddForm ? 'Close Form' : 'Add Node Activity'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-md shadow-[#f97316]/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </button>

          {/* Node Filter Selector */}
          <div className="flex flex-wrap items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {(['all', 'competitor', 'trend', 'seo', 'crisis'] as const).map((node) => (
              <button
                key={node}
                onClick={() => setSelectedNode(node)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all text-xs ${
                  selectedNode === node
                    ? 'bg-[#f97316] text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {node === 'all' ? 'All Nodes' : node}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Automated High Latency Threshold Alert Warning Banner */}
      {!isLowLatencyMode && Object.values(nodeLatencies).some((lat) => lat > latencyThreshold) && !showSettingsDrawer && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3.5 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 shrink-0 border border-rose-500/40">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center space-x-1.5">
                <span>Automated Latency Threshold Alert Triggered</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500 text-white uppercase font-bold">
                  Target Threshold Exceeded (&gt;{latencyThreshold}ms)
                </span>
              </div>
              <p className="text-rose-200/90 text-[11px] mt-0.5">
                Specialist node response time ({Math.max(...Object.values(nodeLatencies))}ms) exceeded target threshold limit ({latencyThreshold}ms). Enable Low Latency Mode to optimize neural edge routing.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onToggleLowLatencyMode) onToggleLowLatencyMode();
            }}
            className="shrink-0 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-3.5 py-2 text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-1.5"
          >
            <Zap className="h-3.5 w-3.5 fill-black" />
            <span>Enable Low Latency Mode Now</span>
          </button>
        </div>
      )}

      {/* System Settings & Node Latency Drawer */}
      {showSettingsDrawer && (
        <div className="rounded-2xl border border-purple-500/30 bg-black/90 p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-purple-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  System Settings & Node Latency Controls
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Configure automated alert thresholds and toggle Low Latency Neural Optimization across all 4 specialist nodes.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Low Latency Mode Toggle */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className={`h-4 w-4 ${isLowLatencyMode ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
                  <span className="font-bold text-white text-sm">Low Latency Mode</span>
                </div>
                <button
                  onClick={onToggleLowLatencyMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isLowLatencyMode ? 'bg-amber-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isLowLatencyMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Routes neural queries through edge CDN acceleration and memory caches. Drops response latencies to &lt;65ms across all specialist nodes.
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-white/5 font-mono text-[11px]">
                <span className="text-zinc-400">Current Routing Mode:</span>
                <span className={isLowLatencyMode ? 'text-amber-400 font-bold' : 'text-zinc-300'}>
                  {isLowLatencyMode ? '⚡ LOW LATENCY EDGE (Avg ~45ms)' : '🌐 STANDARD MULTI-REGION (~380ms)'}
                </span>
              </div>
            </div>

            {/* Latency Threshold Setting */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Automated Alert Threshold</span>
                <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">
                  {latencyThreshold}ms
                </span>
              </div>

              <p className="text-zinc-300 text-[11px]">
                Triggers automated system alerts and notifications when any specialist node response latency exceeds this target limit.
              </p>

              <div className="space-y-2 pt-1">
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={latencyThreshold}
                  onChange={(e) => {
                    if (onChangeLatencyThreshold) onChangeLatencyThreshold(Number(e.target.value));
                  }}
                  className="w-full accent-purple-500 bg-zinc-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                  <span>100ms (Strict)</span>
                  <div className="flex space-x-1">
                    {[250, 500, 750].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          if (onChangeLatencyThreshold) onChangeLatencyThreshold(preset);
                        }}
                        className={`px-1.5 py-0.5 rounded ${
                          latencyThreshold === preset ? 'bg-purple-500 text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                        }`}
                      >
                        {preset}ms
                      </button>
                    ))}
                  </div>
                  <span>1000ms (Relaxed)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Node Latency Telemetry Cards */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
              Live Specialist Node Response Telemetry
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {(
                [
                  { key: 'competitor', label: 'Competitor Node' },
                  { key: 'trend', label: 'Trend Node' },
                  { key: 'seo', label: 'SEO Node' },
                  { key: 'crisis', label: 'Crisis Node' },
                ] as const
              ).map(({ key, label }) => {
                const lat = nodeLatencies[key];
                const isExceeded = !isLowLatencyMode && lat > latencyThreshold;

                return (
                  <div
                    key={key}
                    className={`rounded-xl border p-2.5 flex flex-col justify-between space-y-1 transition-all ${
                      isExceeded
                        ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                        : isLowLatencyMode
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-white/5 border-white/10 text-zinc-200'
                    }`}
                  >
                    <span className="text-[10px] text-zinc-400">{label}</span>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isExceeded ? 'text-rose-400 animate-pulse' : isLowLatencyMode ? 'text-amber-300' : 'text-white'}`}>
                        {lat}ms
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isExceeded ? 'bg-rose-500 text-white' : isLowLatencyMode ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isExceeded ? 'ALERT' : isLowLatencyMode ? 'FAST' : 'OK'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Feedback Toast */}
      {scheduleToast && (
        <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{scheduleToast}</span>
        </div>
      )}

      {/* Automated Schedule Configuration Drawer */}
      {showScheduleDrawer && (
        <div className="rounded-2xl border border-amber-500/30 bg-black/80 p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recurring Automated Execution Intervals
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Configure recurring neural scan timers for each specialist node (e.g. Every 1 Hour, Every 3 Hours).
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSetAllToOneHour}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center space-x-1"
                title="Quick set all 4 nodes to execute every 1 hour"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Set All to Every 1 Hour</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['competitor', 'trend', 'seo', 'crisis'] as NodeType[]).map((nodeType) => {
              const schedule = nodeSchedules[nodeType];
              const isRunning = runningNodes[nodeType];

              const nodeTitleMap: Record<NodeType, string> = {
                competitor: 'Competitor Radar',
                trend: 'Trend Hyper-Scanner',
                seo: 'Organic Cluster Radar',
                crisis: 'Sentiment Sentinel',
              };

              const intervalOptions = [
                { label: 'Every 15 mins', seconds: 900 },
                { label: 'Every 30 mins', seconds: 1800 },
                { label: 'Every 1 hour', seconds: 3600 },
                { label: 'Every 3 hours', seconds: 10800 },
                { label: 'Every 6 hours', seconds: 21600 },
                { label: 'Every 12 hours', seconds: 43200 },
                { label: 'Every 24 hours', seconds: 86400 },
              ];

              return (
                <div
                  key={nodeType}
                  className={`rounded-xl border p-3.5 space-y-3 transition-all ${
                    schedule.enabled
                      ? 'bg-white/[0.03] border-amber-500/30 shadow-lg'
                      : 'bg-white/[0.01] border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getNodeIcon(nodeType)}
                      <span className="font-bold text-white text-xs">{nodeTitleMap[nodeType]}</span>
                    </div>

                    <button
                      onClick={() => handleToggleScheduleEnabled(nodeType)}
                      className={`p-1 rounded-lg border transition-all ${
                        schedule.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                      title={schedule.enabled ? 'Pause Automated Schedule' : 'Enable Automated Schedule'}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Execution Interval</label>
                      <select
                        value={schedule.intervalLabel}
                        onChange={(e) => {
                          const selected = intervalOptions.find((opt) => opt.label === e.target.value);
                          if (selected) {
                            handleUpdateScheduleInterval(nodeType, selected.label, selected.seconds);
                          }
                        }}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-1.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      >
                        {intervalOptions.map((opt) => (
                          <option key={opt.label} value={opt.label} className="bg-[#09090b]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-zinc-400 flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-amber-400 animate-spin" />
                        <span>Next Run:</span>
                      </span>
                      <span className={`font-bold ${schedule.enabled ? 'text-amber-300' : 'text-zinc-500'}`}>
                        {schedule.enabled ? formatCountdown(schedule.nextRunSeconds) : 'Paused'}
                      </span>
                    </div>

                    <button
                      onClick={() => onRunNode(nodeType)}
                      disabled={isRunning}
                      className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin text-[#f97316]" />
                          <span>Executing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 text-amber-400" />
                          <span>Run Task Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Node Activity Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateActivity}
          className="rounded-2xl border border-[#f97316]/40 bg-black/70 p-5 shadow-2xl space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#f97316]" />
              <span>Create New AI Node Protocol Entry</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-[#f97316]" />
              <span>Timestamp: {new Date().toLocaleTimeString()} Today</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Target Node</label>
              <select
                value={addNodeType}
                onChange={(e) => setAddNodeType(e.target.value as NodeType)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white focus:border-[#f97316] focus:outline-none"
              >
                <option value="competitor" className="bg-[#09090b]">Competitor Radar Node</option>
                <option value="trend" className="bg-[#09090b]">Trend Hyper-Scanner</option>
                <option value="seo" className="bg-[#09090b]">Organic Cluster Radar</option>
                <option value="crisis" className="bg-[#09090b]">Sentiment Sentinel</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Activity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Rival Launched Feature Delta X"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Severity Level</label>
              <select
                value={addSeverity}
                onChange={(e) => setAddSeverity(e.target.value as any)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white focus:border-[#f97316] focus:outline-none"
              >
                <option value="medium" className="bg-[#09090b]">Medium Impact</option>
                <option value="high" className="bg-[#09090b]">High Alert</option>
                <option value="positive" className="bg-[#09090b]">Positive Growth</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Description</label>
              <input
                type="text"
                placeholder="Detailed report telemetry..."
                value={addDesc}
                onChange={(e) => setAddDesc(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Actionable Strategy</label>
              <input
                type="text"
                placeholder="e.g. Deploy response ad set immediately"
                value={addAction}
                onChange={(e) => setAddAction(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-xs text-white font-bold shadow-md"
            >
              Create Activity Record
            </button>
          </div>
        </form>
      )}

      {/* Nodes Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((act) => {
          const isRunning = runningNodes[act.nodeType];

          return (
            <div
              key={act.id}
              className={`group relative rounded-xl border-y border-r border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all flex flex-col justify-between ${getNodeLeftBorder(
                act.nodeType
              )}`}
            >
              <div className="space-y-3">
                {/* Card Top Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                      {getNodeIcon(act.nodeType)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                        {act.nodeName}
                      </span>
                      <p className="text-[10px] text-zinc-500">{act.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${getSeverityBadge(
                        act.severity
                      )}`}
                    >
                      {act.severity}
                    </span>

                    <button
                      onClick={() => onRunNode(act.nodeType)}
                      disabled={isRunning}
                      className="flex items-center space-x-1 rounded-lg bg-white/10 hover:bg-[#f97316] text-zinc-200 hover:text-white border border-white/20 px-2.5 py-1 text-xs font-medium transition-all disabled:opacity-50"
                      title={`Run ${act.nodeName} Audit`}
                    >
                      <RefreshCw
                        className={`h-3 w-3 ${isRunning ? 'animate-spin text-[#f97316]' : ''}`}
                      />
                      <span className="text-[11px] font-mono">
                        {isRunning ? 'Auditing...' : 'Run Audit'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteItem(act.id)}
                      className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                      title="Delete activity record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#f97316] transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Actionable Strategy Recommendation */}
                {act.actionRequired && (
                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-[#f97316] text-[11px] uppercase tracking-wider">
                      <Zap className="h-3 w-3" />
                      <span>Actionable Strategy</span>
                    </div>
                    <p className="text-zinc-200 mt-0.5 text-xs">{act.actionRequired}</p>
                  </div>
                )}

                {/* Key Metadata Chips */}
                {act.metadata && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {act.metadata.map((meta, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] font-mono"
                      >
                        <span className="text-zinc-400 mr-1">{meta.label}:</span>
                        <span className="font-bold text-white">{meta.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Quick Trigger */}
              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-zinc-400">
                  Status: <span className="text-emerald-400 font-bold uppercase">{act.status}</span>
                </span>
                <button
                  onClick={() => setActiveDetail(act)}
                  className="flex items-center space-x-1 text-zinc-300 hover:text-[#f97316] transition-colors font-medium text-xs"
                >
                  <span>Full Intelligence Log</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Intelligence Modal Detail */}
      {activeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-purple-800 bg-[#0B0713] p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <div className="flex items-center space-x-2">
                {getNodeIcon(activeDetail.nodeType)}
                <h3 className="text-lg font-bold">{activeDetail.nodeName} Intelligence Report</h3>
              </div>
              <button
                onClick={() => setActiveDetail(null)}
                className="text-purple-400 hover:text-white text-sm font-mono px-2 py-1 bg-purple-950 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-purple-200">
              <div>
                <span className="text-purple-400 uppercase font-mono text-[10px]">Title</span>
                <p className="text-sm font-semibold text-white">{activeDetail.title}</p>
              </div>
              <div>
                <span className="text-purple-400 uppercase font-mono text-[10px]">Description</span>
                <p className="mt-0.5 leading-relaxed">{activeDetail.description}</p>
              </div>
              <div>
                <span className="text-orange-400 uppercase font-mono text-[10px]">Recommended Action</span>
                <p className="mt-0.5 font-medium text-orange-200 bg-orange-950/40 border border-orange-800/40 p-2.5 rounded-lg">
                  {activeDetail.actionRequired || 'Continuously monitor node delta.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => {
                  onRunNode(activeDetail.nodeType);
                  setActiveDetail(null);
                }}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
              >
                Re-Run Neural Scan Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


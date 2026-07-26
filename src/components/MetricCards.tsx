import React, { useState, useEffect } from 'react';
import { MetricCardData } from '../types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Download,
  FileJson,
  FileSpreadsheet,
  History,
  Sparkles,
  ChevronDown,
  Check,
  Info,
  RotateCcw,
  SlidersHorizontal,
  AlertTriangle,
  X,
  Bell,
  CheckCircle2,
  Printer,
  FileText,
  Layers,
  Edit3,
  CheckSquare,
  Percent,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MetricCardsProps {
  metrics: MetricCardData[];
  onSelectMetric?: (metricId: string) => void;
  selectedMetricId?: string;
  onResetMetrics?: () => void;
  onUpdateMetrics?: (updatedMetrics: MetricCardData[]) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics: initialMetrics,
  onSelectMetric,
  selectedMetricId,
  onResetMetrics,
  onUpdateMetrics,
}) => {
  const [currentMetrics, setCurrentMetrics] = useState<MetricCardData[]>(initialMetrics);

  // Sync if prop metrics change
  useEffect(() => {
    setCurrentMetrics(initialMetrics);
  }, [initialMetrics]);

  const [showComparison, setShowComparison] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Batch Modification Feature State
  const [showBatchDrawer, setShowBatchDrawer] = useState(false);
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>([]);
  const [bulkPctAdjustment, setBulkPctAdjustment] = useState<number>(10);
  const [bulkTargetShiftPct, setBulkTargetShiftPct] = useState<number>(0);

  // User-defined threshold state per metric
  const [customThresholds, setCustomThresholds] = useState<Record<string, { min: number; max: number }>>(() => {
    const initial: Record<string, { min: number; max: number }> = {};
    initialMetrics.forEach((m) => {
      initial[m.id] = {
        min: m.minThreshold ?? 0,
        max: m.maxThreshold ?? 9999999,
      };
    });
    return initial;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return <DollarSign className="h-5 w-5 text-[#f97316]" />;
      case 'Users':
        return <Users className="h-5 w-5 text-[#a855f7]" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5 text-amber-400" />;
      default:
        return <Activity className="h-5 w-5 text-[#a855f7]" />;
    }
  };

  // Helper to handle threshold min/max input updates
  const handleThresholdChange = (metricId: string, type: 'min' | 'max', value: number) => {
    setCustomThresholds((prev) => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        [type]: isNaN(value) ? 0 : value,
      },
    }));
  };

  // Batch Selection Toggle
  const toggleSelectMetricForBatch = (id: string) => {
    setSelectedMetricIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllForBatch = () => {
    if (selectedMetricIds.length === currentMetrics.length) {
      setSelectedMetricIds([]);
    } else {
      setSelectedMetricIds(currentMetrics.map((m) => m.id));
    }
  };

  // Apply Batch Modification
  const handleApplyBatchModification = () => {
    if (selectedMetricIds.length === 0) {
      triggerToast('Please select at least one metric to apply batch modification');
      return;
    }

    const updated = currentMetrics.map((card) => {
      if (selectedMetricIds.includes(card.id)) {
        const currentNum = card.numericValue ?? 0;
        const factor = 1 + bulkPctAdjustment / 100;
        const newNum = Math.round(currentNum * factor * 100) / 100;

        let formattedVal = card.value;
        if (card.thresholdUnit === '$' || card.value.startsWith('$')) {
          formattedVal = `$${newNum.toLocaleString()}`;
        } else if (card.thresholdUnit === 'x' || card.value.endsWith('x')) {
          formattedVal = `${newNum.toFixed(2)}x`;
        } else if (card.thresholdUnit?.includes('leads') || card.value.toLowerCase().includes('lead')) {
          formattedVal = `${newNum.toLocaleString()} leads`;
        } else {
          formattedVal = `${newNum.toLocaleString()}`;
        }

        const sign = bulkPctAdjustment >= 0 ? '+' : '';
        const newChange = `${sign}${bulkPctAdjustment}%`;

        return {
          ...card,
          numericValue: newNum,
          value: formattedVal,
          change: newChange,
          isPositive: bulkPctAdjustment >= 0,
          delta: `Batch Bulk Shift (${sign}${bulkPctAdjustment}%)`,
        };
      }
      return card;
    });

    // Apply target bound shifts if configured
    if (bulkTargetShiftPct !== 0) {
      setCustomThresholds((prev) => {
        const nextThresholds = { ...prev };
        selectedMetricIds.forEach((id) => {
          const existing = nextThresholds[id] || { min: 0, max: 999999 };
          const shiftFactor = 1 + bulkTargetShiftPct / 100;
          nextThresholds[id] = {
            min: Math.round(existing.min * shiftFactor),
            max: Math.round(existing.max * shiftFactor),
          };
        });
        return nextThresholds;
      });
    }

    setCurrentMetrics(updated);
    if (onUpdateMetrics) {
      onUpdateMetrics(updated);
    }

    triggerToast(
      `Applied ${bulkPctAdjustment >= 0 ? '+' : ''}${bulkPctAdjustment}% batch modification across ${selectedMetricIds.length} metrics`
    );
  };

  // Reset metrics and custom threshold configuration to defaults
  const handleReset = () => {
    const defaultThresholds: Record<string, { min: number; max: number }> = {};
    initialMetrics.forEach((m) => {
      defaultThresholds[m.id] = {
        min: m.minThreshold ?? 0,
        max: m.maxThreshold ?? 9999999,
      };
    });
    setCurrentMetrics(initialMetrics);
    setCustomThresholds(defaultThresholds);
    setShowComparison(false);
    setShowThresholdConfig(false);
    setShowBatchDrawer(false);
    setSelectedMetricIds([]);
    setActiveTooltipId(null);

    if (onResetMetrics) {
      onResetMetrics();
    }

    triggerToast('Reset all metrics and target bounds to baseline');
  };

  // Download Printable PDF Report Handler
  const handleDownloadPDFReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Popup blocked. Please allow popups to generate printable PDF report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Flux AI - Metrics Executive PDF Snapshot Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 28px; color: #111; background: #fff; line-height: 1.4; }
          .header { border-bottom: 2px solid #ea580c; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .brand { font-size: 22px; font-weight: 800; color: #09090b; letter-spacing: -0.5px; }
          .brand span { color: #ea580c; }
          .subtitle { font-size: 12px; color: #555; margin-top: 2px; }
          .meta { text-align: right; font-size: 11px; color: #666; font-family: monospace; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11px; }
          th { background: #f4f4f5; text-align: left; padding: 10px; border: 1px solid #d4d4d8; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; color: #27272a; }
          td { padding: 10px; border: 1px solid #e4e4e7; vertical-align: top; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          .badge-positive { background: #dcfce7; color: #15803d; }
          .badge-alert { background: #fef3c7; color: #b45309; }
          .footer { margin-top: 30px; font-size: 10px; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 12px; text-align: center; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">FLUX MARKET <span>INTELLIGENCE</span> OS</div>
            <div class="subtitle">Executive Metric Snapshot & Target Bounds Performance Report</div>
          </div>
          <div class="meta">
            <div><strong>Report Date:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Window:</strong> Active 30-Day Performance Horizon</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Metric Title</th>
              <th>Current Snapshot</th>
              <th>Variance (%)</th>
              <th>Baseline Value</th>
              <th>Target Range</th>
              <th>Target Alert Status</th>
              <th>Calculation Formula</th>
            </tr>
          </thead>
          <tbody>
            ${currentMetrics
              .map((m) => {
                const threshold = customThresholds[m.id] || { min: m.minThreshold || 0, max: m.maxThreshold || 999999 };
                const numVal = m.numericValue ?? 0;
                const isAlert = numVal < threshold.min || numVal > threshold.max;
                return `
                  <tr>
                    <td><strong>${m.title}</strong></td>
                    <td style="font-family: monospace; font-size: 13px; font-weight: bold;">${m.value}</td>
                    <td><span class="badge ${m.isPositive ? 'badge-positive' : 'badge-alert'}">${m.change}</span></td>
                    <td>${m.previousValue || 'N/A'} (${m.delta || 'N/A'})</td>
                    <td>${threshold.min} - ${threshold.max} ${m.thresholdUnit || ''}</td>
                    <td><span class="badge ${isAlert ? 'badge-alert' : 'badge-positive'}">${isAlert ? 'TARGET ALERT' : 'OPTIMAL'}</span></td>
                    <td style="font-size: 9px; color: #444;">${m.calculationFormula || 'N/A'}</td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>

        <div style="margin-top: 20px; font-size: 11px; line-height: 1.5; background: #fafafa; padding: 12px; border-radius: 8px; border: 1px solid #e4e4e7;">
          <strong>Data Ingestion Verification:</strong> Aggregated in real time via Flux multi-channel telemetry streams (Stripe Sales, Google Ads Conversion API, Meta Ads Pixel, HubSpot CRM).
        </div>

        <div class="footer">
          Confidential Executive Report • Generated by Flux Market Intelligence OS
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setShowExportMenu(false);
    triggerToast('Generated printable PDF report document');
  };

  // Trigger JSON Export
  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      period: '30-Day Performance Window',
      metrics: currentMetrics.map((m) => {
        const threshold = customThresholds[m.id] || { min: m.minThreshold || 0, max: m.maxThreshold || 999999 };
        const numVal = m.numericValue ?? 0;
        const isAlert = numVal < threshold.min || numVal > threshold.max;
        return {
          id: m.id,
          title: m.title,
          currentValue: m.value,
          changePercentage: m.change,
          isPositive: m.isPositive,
          previousValue: m.previousValue || 'N/A',
          delta: m.delta || 'N/A',
          subtext: m.subtext,
          calculationFormula: m.calculationFormula || 'N/A',
          calculationDescription: m.calculationDescription || 'N/A',
          targetRange: `${threshold.min} - ${threshold.max} ${m.thresholdUnit || ''}`,
          alertTriggered: isAlert,
          chartData: m.chartData,
        };
      }),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flux_metrics_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setShowExportMenu(false);
    triggerToast('Exported metrics report as JSON');
  };

  // Trigger CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Metric ID',
      'Metric Title',
      'Current Value',
      'Change (%)',
      'Previous Value',
      'Delta Variance',
      'Target Min',
      'Target Max',
      'Alert Status',
      'Calculation Formula',
    ];
    const rows = currentMetrics.map((m) => {
      const threshold = customThresholds[m.id] || { min: m.minThreshold || 0, max: m.maxThreshold || 999999 };
      const numVal = m.numericValue ?? 0;
      const isAlert = numVal < threshold.min || numVal > threshold.max;
      return [
        `"${m.id}"`,
        `"${m.title}"`,
        `"${m.value}"`,
        `"${m.change}"`,
        `"${m.previousValue || 'N/A'}"`,
        `"${m.delta || 'N/A'}"`,
        `"${threshold.min}"`,
        `"${threshold.max}"`,
        `"${isAlert ? 'ALERT OUT OF RANGE' : 'NORMAL'}"`,
        `"${(m.calculationFormula || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `flux_metrics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportMenu(false);
    triggerToast('Exported metrics report as CSV');
  };

  const triggerToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3200);
  };

  return (
    <div className="space-y-3">
      {/* Metrics Control Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-3 shadow-xl">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-[#f97316]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Real-Time Telemetry & Target Monitoring
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
            Live Sync
          </span>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Modify Button */}
          <button
            onClick={() => setShowBatchDrawer(!showBatchDrawer)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showBatchDrawer
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-md shadow-purple-500/10'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Batch Modify</span>
          </button>

          {/* Threshold Config Toggle */}
          <button
            onClick={() => setShowThresholdConfig(!showThresholdConfig)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showThresholdConfig
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
            <span>Target Thresholds</span>
          </button>

          {/* Compare with Previous Toggle Button */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showComparison
                ? 'bg-[#f97316] text-white border-[#f97316] shadow-md shadow-[#f97316]/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
          >
            <History className="h-3.5 w-3.5 text-[#f97316]" />
            <span>Compare with Previous</span>
            {showComparison && <Check className="h-3 w-3 ml-1 text-white" />}
          </button>

          {/* Download PDF Report Direct Button */}
          <button
            onClick={handleDownloadPDFReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f97316] hover:bg-[#ea580c] text-white transition-all shadow-md shadow-[#f97316]/20"
            title="Generate formatted printable executive PDF report"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Download PDF Report</span>
          </button>

          {/* Reset Metrics & Thresholds Button */}
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-all"
            title="Reset metrics, threshold targets, and filters to baseline values"
          >
            <RotateCcw className="h-3.5 w-3.5 text-sky-400" />
            <span>Reset</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              <Download className="h-3.5 w-3.5 text-[#f97316]" />
              <span>Export</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#09090b] border border-white/10 shadow-2xl z-50 py-1 text-xs animate-fadeIn">
                <button
                  onClick={handleDownloadPDFReport}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-zinc-200 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5"
                >
                  <FileText className="h-4 w-4 text-[#f97316]" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-zinc-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileJson className="h-4 w-4 text-amber-400" />
                  <span>Export as JSON</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-zinc-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  <span>Export as CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batch Modification Drawer */}
      {showBatchDrawer && (
        <div className="rounded-2xl border border-purple-500/30 bg-black/80 p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Batch Metric & Target Bounds Modification
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Select multiple metrics and apply simultaneous percentage adjustments or target shifts.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSelectAllForBatch}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-bold transition-all flex items-center space-x-1"
              >
                <CheckSquare className="h-3.5 w-3.5 text-purple-400" />
                <span>
                  {selectedMetricIds.length === currentMetrics.length ? 'Deselect All' : 'Select All'}
                </span>
              </button>

              <button
                onClick={() => setShowBatchDrawer(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Metric Selection Chips */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              1. Select Metrics to Batch Modify ({selectedMetricIds.length} of {currentMetrics.length} selected)
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {currentMetrics.map((m) => {
                const isSelected = selectedMetricIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleSelectMetricForBatch(m.id)}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 font-medium ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/50 font-bold shadow-sm'
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <CheckSquare className={`h-3.5 w-3.5 ${isSelected ? 'text-purple-400' : 'text-zinc-500'}`} />
                    <span>{m.title}</span>
                    <span className="font-mono text-[10px] opacity-75">({m.value})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Batch Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-white/10 text-xs">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                2. Metric Value Adjustment (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={bulkPctAdjustment}
                  onChange={(e) => setBulkPctAdjustment(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 px-3 text-xs font-mono text-white focus:border-purple-400 focus:outline-none"
                  placeholder="e.g. 10 for +10%"
                />
                <span className="text-zinc-400 font-mono">%</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {[5, 10, 25, -5, -10].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBulkPctAdjustment(preset)}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-300"
                  >
                    {preset >= 0 ? `+${preset}%` : `${preset}%`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                3. Shift Target Bounds (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={bulkTargetShiftPct}
                  onChange={(e) => setBulkTargetShiftPct(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 px-3 text-xs font-mono text-white focus:border-purple-400 focus:outline-none"
                  placeholder="e.g. 5 to increase target bounds by 5%"
                />
                <span className="text-zinc-400 font-mono">%</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Shifts both min and max thresholds simultaneously.
              </p>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleApplyBatchModification}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>Apply Bulk Changes ({selectedMetricIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Threshold Configuration Drawer */}
      {showThresholdConfig && (
        <div className="rounded-2xl border border-amber-500/30 bg-black/80 p-4 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Configure Target Ranges & Alert Triggers</span>
            </div>
            <button
              onClick={() => setShowThresholdConfig(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400">
            Set custom minimum and maximum target bounds for telemetry monitoring. Metrics outside target bounds will trigger a prominent yellow alert glow.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {currentMetrics.map((card) => {
              const th = customThresholds[card.id] || { min: card.minThreshold || 0, max: card.maxThreshold || 999999 };
              const numVal = card.numericValue ?? 0;
              const isAlert = numVal < th.min || numVal > th.max;

              return (
                <div
                  key={card.id}
                  className={`p-3 rounded-xl border space-y-2 bg-white/[0.02] ${
                    isAlert ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-white text-xs">
                    <span>{card.title}</span>
                    {isAlert ? (
                      <span className="text-[10px] text-amber-400 font-mono flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-400 animate-bounce" />
                        ALERT
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono">NORMAL</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Min Target</label>
                      <input
                        type="number"
                        value={th.min}
                        onChange={(e) => handleThresholdChange(card.id, 'min', parseFloat(e.target.value))}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-1.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Max Target</label>
                      <input
                        type="number"
                        value={th.max}
                        onChange={(e) => handleThresholdChange(card.id, 'max', parseFloat(e.target.value))}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-1.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast Feedback Banner */}
      {feedbackMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentMetrics.map((card) => {
          const isSelected = selectedMetricId === card.id;
          const chartFormatted = card.chartData.map((val, idx) => ({ idx, val }));

          // Calculate threshold status
          const threshold = customThresholds[card.id] || {
            min: card.minThreshold ?? 0,
            max: card.maxThreshold ?? 9999999,
          };
          const numValue = card.numericValue ?? 0;
          const isOutOfBounds = numValue < threshold.min || numValue > threshold.max;
          const isTooltipOpen = activeTooltipId === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectMetric && onSelectMetric(card.id)}
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all cursor-pointer ${
                isOutOfBounds
                  ? 'border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.35)] bg-amber-500/10'
                  : isSelected
                  ? 'bg-white/[0.06] border-[#f97316] shadow-lg shadow-[#f97316]/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Top Row: Icon + Percentage Change Trend Indicator + Info Tooltip Button */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-[#f97316]/50 transition-colors">
                  {getIcon(card.iconName)}
                </div>

                {/* Percentage Change Trend Indicator Badge & Alert Warning Pill */}
                <div className="flex items-center space-x-1.5">
                  {isOutOfBounds && (
                    <div className="inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse">
                      <AlertTriangle className="h-3 w-3 text-amber-400 mr-0.5" />
                      <span>TARGET ALERT</span>
                    </div>
                  )}

                  <div
                    className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      card.isPositive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full animate-pulse mr-0.5 ${
                        card.isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    {card.isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-0.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-0.5 text-rose-400" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
              </div>

              {/* Title & Calculation Info Tooltip Trigger */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center space-x-1">
                    <span>{card.title}</span>
                  </p>

                  {/* Calculation Tooltip Trigger Icon */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltipId(isTooltipOpen ? null : card.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      title="View calculation formula and telemetry logic"
                    >
                      <Info className="h-3.5 w-3.5 text-[#f97316]" />
                    </button>

                    {/* Informative Tooltip Popover */}
                    {isTooltipOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-6 w-72 rounded-2xl bg-[#09090b] border border-[#f97316]/50 p-3.5 shadow-2xl z-50 text-xs space-y-2 animate-fadeIn"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          <span className="font-bold text-white text-xs flex items-center space-x-1">
                            <Sparkles className="h-3.5 w-3.5 text-[#f97316]" />
                            <span>Calculation Logic</span>
                          </span>
                          <button
                            onClick={() => setActiveTooltipId(null)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {card.calculationFormula && (
                          <div>
                            <span className="text-[10px] font-mono text-zinc-400 block mb-1">Formula:</span>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-2 font-mono text-[10px] text-amber-300 leading-relaxed">
                              {card.calculationFormula}
                            </div>
                          </div>
                        )}

                        {card.calculationDescription && (
                          <p className="text-[11px] text-zinc-300 leading-snug">
                            {card.calculationDescription}
                          </p>
                        )}

                        {card.dataSources && card.dataSources.length > 0 && (
                          <div className="pt-1 border-t border-white/10">
                            <span className="text-[10px] font-mono text-zinc-400 block mb-1">
                              Data Ingestion Sources:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {card.dataSources.map((src, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-zinc-300 border border-white/10"
                                >
                                  {src}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Metric Value */}
                <h3 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
                  {card.value}
                </h3>

                {/* Threshold Alert Warning Banner inside card */}
                {isOutOfBounds && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[11px] text-amber-200 font-mono space-y-0.5">
                    <div className="font-bold text-amber-300 flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                      <span>Value out of target bounds</span>
                    </div>
                    <div>
                      Target range: {threshold.min} - {threshold.max} {card.thresholdUnit || ''}
                    </div>
                  </div>
                )}

                {/* Comparison vs Baseline Mode */}
                {showComparison ? (
                  <div className="mt-2 pt-2 border-t border-white/10 space-y-1 bg-white/5 p-2 rounded-lg">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 font-mono">Previous:</span>
                      <span className="text-zinc-200 font-mono font-semibold">
                        {card.previousValue || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 font-mono">Variance Delta:</span>
                      <span
                        className={`font-mono font-bold ${
                          card.isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {card.delta || card.change}
                      </span>
                    </div>
                  </div>
                ) : (
                  !isOutOfBounds && <p className="text-[11px] text-zinc-400 mt-0.5">{card.subtext}</p>
                )}
              </div>

              {/* Mini Sparkline Area Chart */}
              <div className="h-10 mt-3 -mx-2 -mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartFormatted}>
                    <defs>
                      <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isOutOfBounds ? '#f59e0b' : card.isPositive ? '#f97316' : '#a855f7'}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={isOutOfBounds ? '#f59e0b' : card.isPositive ? '#f97316' : '#a855f7'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={isOutOfBounds ? '#f59e0b' : card.isPositive ? '#f97316' : '#a855f7'}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#grad-${card.id})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



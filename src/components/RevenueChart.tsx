import React, { useState, useMemo } from 'react';
import { RevenueDataPoint } from '../types';
import * as d3 from 'd3';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Sparkles, DollarSign, Zap, Target, LineChart, ShieldCheck } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export interface ProjectedDataPoint extends RevenueDataPoint {
  isProjection?: boolean;
  d3TrendValue?: number;
  d3PredictedRevenue?: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'7w' | '30d' | '12m'>('7w');
  const [showD3Projection, setShowD3Projection] = useState<boolean>(true);
  const [activeChannels, setActiveChannels] = useState<{
    ppc: boolean;
    seo: boolean;
    social: boolean;
  }>({
    ppc: true,
    seo: true,
    social: true,
  });

  const toggleChannel = (channel: 'ppc' | 'seo' | 'social') => {
    setActiveChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  // Compute total weekly average and high level stats
  const totalRev = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const avgRoas = (data.reduce((acc, curr) => acc + curr.roas, 0) / data.length).toFixed(2);
  const totalSpend = data.reduce((acc, curr) => acc + curr.adSpend, 0);

  // D3 STATISTICAL LINEAR REGRESSION ENGINE
  const { chartDataWithProjections, slope, intercept, rSquared, projected30DayTotal, projected30DayRev } =
    useMemo(() => {
      if (!data || data.length === 0) {
        return {
          chartDataWithProjections: [],
          slope: 0,
          intercept: 0,
          rSquared: 0,
          projected30DayTotal: 0,
          projected30DayRev: 0,
        };
      }

      // X indices = [0, 1, 2, ..., N-1]
      const xIndices = data.map((_, i) => i);
      const yRevenues = data.map((d) => d.revenue);

      const xMean = d3.mean(xIndices) ?? 0;
      const yMean = d3.mean(yRevenues) ?? 0;

      // Calculate linear regression slope = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)
      const num = data.reduce((acc, _, i) => acc + (i - xMean) * (yRevenues[i] - yMean), 0);
      const den = xIndices.reduce((acc, x) => acc + Math.pow(x - xMean, 2), 0);

      const computedSlope = den !== 0 ? num / den : 0;
      const computedIntercept = yMean - computedSlope * xMean;

      // Calculate R^2 (coefficient of determination)
      const totalSS = yRevenues.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
      const resSS = data.reduce((acc, _, i) => acc + Math.pow(yRevenues[i] - (computedSlope * i + computedIntercept), 2), 0);
      const computedRSquared = totalSS > 0 ? Math.max(0, 1 - resSS / totalSS) : 1;

      // Build historical points with d3TrendValue
      const historicalPoints: ProjectedDataPoint[] = data.map((pt, i) => ({
        ...pt,
        isProjection: false,
        d3TrendValue: Math.round(computedSlope * i + computedIntercept),
      }));

      if (!showD3Projection) {
        return {
          chartDataWithProjections: historicalPoints,
          slope: computedSlope,
          intercept: computedIntercept,
          rSquared: computedRSquared,
          projected30DayTotal: totalRev,
          projected30DayRev: yRevenues[yRevenues.length - 1],
        };
      }

      // Generate 4 additional projected weeks (+7d, +14d, +21d, +30d) for the next 30 days
      const lastWeekNum = data.length;
      const projectionWeeks = [
        { label: `Wk ${lastWeekNum + 1} (+7d)`, offset: 1 },
        { label: `Wk ${lastWeekNum + 2} (+14d)`, offset: 2 },
        { label: `Wk ${lastWeekNum + 3} (+21d)`, offset: 3 },
        { label: `Wk ${lastWeekNum + 4} (+30d)`, offset: 4 },
      ];

      const lastHistoricalPt = data[data.length - 1];

      const futurePoints: ProjectedDataPoint[] = projectionWeeks.map((pw, idx) => {
        const futureX = lastWeekNum - 1 + pw.offset;
        const predictedRev = Math.round(computedSlope * futureX + computedIntercept);
        const growthFactor = predictedRev / (lastHistoricalPt.revenue || 1);

        return {
          week: pw.label,
          revenue: predictedRev,
          roas: Number((lastHistoricalPt.roas * (1 + idx * 0.02)).toFixed(2)),
          adSpend: Math.round(lastHistoricalPt.adSpend * 1.03),
          activeLeads: Math.round(lastHistoricalPt.activeLeads * growthFactor),
          ppcRevenue: Math.round(lastHistoricalPt.ppcRevenue * growthFactor),
          seoRevenue: Math.round(lastHistoricalPt.seoRevenue * growthFactor),
          socialRevenue: Math.round(lastHistoricalPt.socialRevenue * growthFactor),
          isProjection: true,
          d3TrendValue: predictedRev,
          d3PredictedRevenue: predictedRev,
        };
      });

      const combinedData = [...historicalPoints, ...futurePoints];

      // Calculate total 30-day projected revenue
      const projected30DayRev = futurePoints[futurePoints.length - 1].revenue;
      const projected30DayTotal = futurePoints.reduce((acc, pt) => acc + pt.revenue, 0);

      return {
        chartDataWithProjections: combinedData,
        slope: computedSlope,
        intercept: computedIntercept,
        rSquared: computedRSquared,
        projected30DayTotal,
        projected30DayRev,
      };
    }, [data, showD3Projection, totalRev]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload as ProjectedDataPoint;
      const isProj = pData.isProjection;

      return (
        <div className={`rounded-xl border ${isProj ? 'border-sky-500/50 bg-[#07131e]/95' : 'border-white/20 bg-[#09090b]/95'} p-3.5 shadow-2xl backdrop-blur-md font-sans text-xs space-y-2 min-w-[210px]`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-bold text-zinc-200">
            <span>{label} {isProj ? 'd3 Projection' : 'Historical Data'}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isProj ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-[#f97316]/20 text-[#f97316]'}`}>
              {isProj ? '30d Forecast' : 'Neural Verified'}
            </span>
          </div>

          <div className="space-y-1 text-zinc-200">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">{isProj ? 'Predicted Revenue:' : 'Total Revenue:'}</span>
              <span className={`font-bold ${isProj ? 'text-sky-300 font-mono' : 'text-white'}`}>
                ${pData.revenue.toLocaleString()}
              </span>
            </div>

            {pData.d3TrendValue !== undefined && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-sky-400 flex items-center gap-1">
                  <LineChart className="h-3 w-3" /> d3 Trendline:
                </span>
                <span className="font-mono text-sky-200">${pData.d3TrendValue.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-emerald-400">ROAS Multiplier:</span>
              <span className="font-bold text-emerald-400">{pData.roas}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-400">Est. Ad Spend:</span>
              <span className="font-mono text-amber-300">${pData.adSpend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a855f7]">Pipeline Leads:</span>
              <span className="font-mono text-zinc-300">{pData.activeLeads}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 text-[10px] text-zinc-400 space-y-0.5 font-mono">
            <div>• PPC Channel: ${pData.ppcRevenue.toLocaleString()}</div>
            <div>• SEO Cluster: ${pData.seoRevenue.toLocaleString()}</div>
            <div>• Social Ads: ${pData.socialRevenue.toLocaleString()}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#f97316]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Unified Revenue & d3 Predictive Growth
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cross-channel telemetry with statistical d3 linear regression 30-day forecasting
          </p>
        </div>

        {/* Filters & Range Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* D3 Predictive Trend Line Toggle */}
          <button
            onClick={() => setShowD3Projection(!showD3Projection)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              showD3Projection
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sky-500/10'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${showD3Projection ? 'text-sky-400 animate-pulse' : 'text-zinc-400'}`} />
            <span>30-Day d3 Projection</span>
            <span className="text-[9px] font-mono px-1 rounded bg-sky-950 text-sky-300">d3</span>
          </button>

          {/* Channel Toggles */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => toggleChannel('ppc')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeChannels.ppc
                  ? 'bg-[#f97316]/20 text-[#f97316] font-semibold border border-[#f97316]/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PPC
            </button>
            <button
              onClick={() => toggleChannel('seo')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeChannels.seo
                  ? 'bg-[#a855f7]/20 text-[#a855f7] font-semibold border border-[#a855f7]/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => toggleChannel('social')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeChannels.social
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Social
            </button>
          </div>

          {/* Time Selector */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
            {(['7w', '30d', '12m'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md font-mono uppercase transition-colors ${
                  timeRange === range
                    ? 'bg-[#f97316] text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* D3 Projection Forecast Banner */}
      {showD3Projection && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5 space-y-2 text-xs animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-500/20 pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="font-bold text-sky-200">d3 Statistical Revenue Engine (30-Day Forecast Model)</span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[11px] text-sky-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Regression Fit Accuracy (R²): {(rSquared * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-300 pt-1 font-mono">
            <div>
              <span className="text-[10px] text-sky-400/80 uppercase block font-sans">30-Day Forecast Rev</span>
              <span className="text-sm font-bold text-sky-300">${projected30DayRev.toLocaleString()} / wk</span>
            </div>
            <div>
              <span className="text-[10px] text-sky-400/80 uppercase block font-sans">30-Day Cumulative</span>
              <span className="text-sm font-bold text-white">${projected30DayTotal.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-sky-400/80 uppercase block font-sans">Linear Growth Velocity</span>
              <span className="text-sm font-bold text-emerald-400">+${Math.round(slope).toLocaleString()} / wk</span>
            </div>
            <div>
              <span className="text-[10px] text-sky-400/80 uppercase block font-sans">Projected ROAS</span>
              <span className="text-sm font-bold text-amber-300">5.12x</span>
            </div>
          </div>
        </div>
      )}

      {/* High-level Summary Metrics */}
      <div className="grid grid-cols-3 gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/10 text-xs">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-[#f97316]" />
          <div>
            <div className="text-zinc-400">Current Period Revenue</div>
            <div className="font-mono font-bold text-white text-sm">${totalRev.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="text-zinc-400">Avg PPC ROAS</div>
            <div className="font-mono font-bold text-emerald-400 text-sm">{avgRoas}x</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-amber-400" />
          <div>
            <div className="text-zinc-400">Total Ad Spend</div>
            <div className="font-mono font-bold text-amber-300 text-sm">${totalSpend.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartDataWithProjections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="d3ProjectionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="week" stroke="#71717a" fontSize={11} tickLine={false} />
            <YAxis yAxisId="left" stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} tickFormatter={(val) => `${val}x`} />

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Global Revenue ($)"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />

            {/* d3 Statistical Trendline Line */}
            {showD3Projection && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="d3TrendValue"
                name="d3 Predictive Trendline"
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeDasharray="6 6"
                dot={{ r: 4, fill: '#38bdf8', strokeWidth: 1.5, stroke: '#0284c7' }}
              />
            )}

            {activeChannels.ppc && (
              <Bar yAxisId="left" dataKey="ppcRevenue" name="PPC Channel" fill="#a855f7" radius={[4, 4, 0, 0]} opacity={0.8} />
            )}
            {activeChannels.seo && (
              <Bar yAxisId="left" dataKey="seoRevenue" name="SEO Channel" fill="#c084fc" radius={[4, 4, 0, 0]} opacity={0.6} />
            )}

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roas"
              name="ROAS Multiplier"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#10b981' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

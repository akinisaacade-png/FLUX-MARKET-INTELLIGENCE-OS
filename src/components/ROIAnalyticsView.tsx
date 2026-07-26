import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  CreditCard,
  ArrowUpRight,
  BarChart3,
  Download,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ROIAnalyticsView: React.FC = () => {
  const [channelData, setChannelData] = useState([
    { id: '1', channel: 'Google Search Ads', spend: 38200, revenue: 198000, roas: 5.18, cac: '$84', addedAt: '2026-07-24' },
    { id: '2', channel: 'Meta Ads (FB/IG)', spend: 24500, revenue: 112000, roas: 4.57, cac: '$96', addedAt: '2026-07-24' },
    { id: '3', channel: 'LinkedIn B2B', spend: 14000, revenue: 68000, roas: 4.85, cac: '$142', addedAt: '2026-07-24' },
    { id: '4', channel: 'Organic SEO Clusters', spend: 4500, revenue: 78000, roas: 17.3, cac: '$28', addedAt: '2026-07-24' },
    { id: '5', channel: 'Email Retargeting', spend: 3000, revenue: 26950, roas: 8.98, cac: '$18', addedAt: '2026-07-24' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  const [newSpend, setNewSpend] = useState('');
  const [newRevenue, setNewRevenue] = useState('');
  const [newCac, setNewCac] = useState('');

  // Download CSV Export Function
  const handleDownloadCSV = () => {
    const headers = ['Channel', 'Ad Spend ($)', 'Revenue ($)', 'ROAS Multiplier', 'Target CAC', 'Date Added'];
    const rows = channelData.map((c) => [
      `"${c.channel}"`,
      c.spend,
      c.revenue,
      c.roas,
      `"${c.cac}"`,
      `"${c.addedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `flux_roi_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.trim()) return;

    const spendNum = parseFloat(newSpend) || 0;
    const revNum = parseFloat(newRevenue) || 0;
    const roasCalc = spendNum > 0 ? parseFloat((revNum / spendNum).toFixed(2)) : 0;
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const newItem = {
      id: `chan_${Date.now()}`,
      channel: newChannel.trim(),
      spend: spendNum,
      revenue: revNum,
      roas: roasCalc,
      cac: newCac.startsWith('$') ? newCac.trim() : `$${newCac.trim() || '50'}`,
      addedAt: currentDate,
    };

    setChannelData((prev) => [newItem, ...prev]);
    setNewChannel('');
    setNewSpend('');
    setNewRevenue('');
    setNewCac('');
    setShowAddForm(false);
  };

  const handleDeleteChannel = (id: string) => {
    setChannelData((prev) => prev.filter((item) => item.id !== id));
  };

  const totalSpend = channelData.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = channelData.reduce((acc, c) => acc + c.revenue, 0);
  const blendedROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-[#f97316]" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              ROI Analytics & Multi-Touch Attribution Studio
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Cross-channel revenue breakdown, ROAS optimization, CAC vs LTV ratios, and multi-touch attribution telemetry
          </p>
        </div>

        {/* Export & Add Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 text-xs font-bold transition-all"
          >
            <Plus className="h-4 w-4 text-[#f97316]" />
            <span>{showAddForm ? 'Close Form' : 'Add Channel Data'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-lg shadow-[#f97316]/20"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Add Channel Data Input Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddChannel}
          className="rounded-2xl border border-[#f97316]/40 bg-black/60 p-5 shadow-2xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#f97316]" />
              <span>Add New Marketing Channel Performance Entry</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-[#f97316]" />
              <span>Timestamp: {new Date().toLocaleDateString()}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Channel Name</label>
              <input
                type="text"
                required
                placeholder="e.g. TikTok Ads"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Ad Spend ($)</label>
              <input
                type="number"
                required
                placeholder="e.g. 5000"
                value={newSpend}
                onChange={(e) => setNewSpend(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Revenue ($)</label>
              <input
                type="number"
                required
                placeholder="e.g. 24000"
                value={newRevenue}
                onChange={(e) => setNewRevenue(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Target CAC ($)</label>
              <input
                type="text"
                placeholder="e.g. $45"
                value={newCac}
                onChange={(e) => setNewCac(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-xs text-white font-bold shadow-md"
            >
              Add Channel Entry
            </button>
          </div>
        </form>
      )}

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
          <span className="text-zinc-400 block mb-1">Blended ROAS</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{blendedROAS}x</span>
          <span className="text-[10px] text-zinc-500 mt-1 block">+12.4% vs last period</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
          <span className="text-zinc-400 block mb-1">Customer Acquisition Cost (CAC)</span>
          <span className="text-2xl font-bold text-amber-300 font-mono">$88.40</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">-6.2% cost reduction</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
          <span className="text-zinc-400 block mb-1">Customer Lifetime Value (LTV)</span>
          <span className="text-2xl font-bold text-zinc-200 font-mono">$1,420.00</span>
          <span className="text-[10px] text-zinc-400 mt-1 block">LTV:CAC Ratio = 16.0x</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
          <span className="text-zinc-400 block mb-1">Total Ad Revenue Attributed</span>
          <span className="text-2xl font-bold text-[#f97316] font-mono">${totalRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-400 mt-1 block">Across {channelData.length} channels</span>
        </div>
      </div>

      {/* Attribution Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Channel Revenue vs Ad Spend Breakdown</h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="channel" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="revenue" name="Revenue Attributed ($)" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" name="Ad Spend ($)" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Table with Delete Action */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Channel ROAS & CAC Matrix</h3>
          <span className="text-xs font-mono text-zinc-500">{channelData.length} Active Channels</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-6 gap-2 bg-white/5 p-3 rounded-xl font-bold text-zinc-300 font-mono">
            <div>Channel</div>
            <div>Ad Spend</div>
            <div>Revenue</div>
            <div>ROAS Multiplier</div>
            <div>Target CAC</div>
            <div className="text-right">Actions</div>
          </div>

          {channelData.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-6 gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/10 items-center font-mono hover:bg-white/5 transition-colors"
            >
              <div className="font-bold text-white font-sans truncate">{c.channel}</div>
              <div className="text-amber-300">${c.spend.toLocaleString()}</div>
              <div className="text-[#f97316] font-bold">${c.revenue.toLocaleString()}</div>
              <div className="text-emerald-400 font-bold">{c.roas}x</div>
              <div className="text-zinc-300">{c.cac}</div>
              <div className="flex justify-end items-center space-x-2">
                <button
                  onClick={() => handleDeleteChannel(c.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                  title="Delete channel row"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


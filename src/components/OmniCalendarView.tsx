import React, { useState } from 'react';
import { CampaignEvent } from '../types';
import { Calendar as CalendarIcon, Plus, Filter, Clock, Tag, User, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface OmniCalendarViewProps {
  events: CampaignEvent[];
  onAddEvent: (evt: Partial<CampaignEvent>) => void;
}

export const OmniCalendarView: React.FC<OmniCalendarViewProps> = ({ events, onAddEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CampaignEvent['category']>('PPC Campaign');
  const [newDate, setNewDate] = useState<string>('2026-07-28');
  const [newChannel, setNewChannel] = useState<string>('Google Search & Meta Ads');
  const [newBudget, setNewBudget] = useState<string>('$5,000');

  const categories = ['All', 'PPC Campaign', 'Content Launch', 'A/B Test', 'SEO Push', 'Product Release'];

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onAddEvent({
      title: newTitle,
      category: newCategory,
      date: newDate,
      time: '10:00 AM',
      status: 'scheduled',
      assignee: 'Flux AI Agent',
      channel: newChannel,
      budget: newBudget,
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Omni-Calendar: Campaign & Launch Schedule
            </h2>
          </div>
          <p className="text-xs text-purple-300/70 mt-1">
            Centralized timeline for PPC ad blitzes, content schedule, A/B experiment rollouts, and SEO pushes
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold px-4 py-2 text-xs shadow-lg shadow-orange-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Campaign</span>
        </button>
      </div>

      {/* Add Campaign Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-orange-500/50 bg-[#130D24] p-5 shadow-2xl space-y-4 text-xs"
        >
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Plus className="h-4 w-4 text-orange-400" />
            <span>Create Omni-Calendar Campaign Event</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-purple-300 block mb-1">Campaign Title</label>
              <input
                type="text"
                placeholder="e.g. Q3 High-Intent PPC Blitz"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white placeholder-purple-400/50 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-purple-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="PPC Campaign">PPC Campaign</option>
                <option value="Content Launch">Content Launch</option>
                <option value="A/B Test">A/B Test</option>
                <option value="SEO Push">SEO Push</option>
                <option value="Product Release">Product Release</option>
              </select>
            </div>

            <div>
              <label className="text-purple-300 block mb-1">Target Launch Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-purple-300 block mb-1">Target Channel</label>
              <input
                type="text"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-purple-300 block mb-1">Allocated Budget</label>
              <input
                type="text"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-full rounded-lg bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold'
                : 'bg-[#130D24] text-purple-300 border border-purple-900/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Timeline List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 space-y-3 hover:border-purple-700/60 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                {evt.category}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  evt.status === 'live'
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'bg-purple-950 text-purple-300'
                }`}
              >
                {evt.status.toUpperCase()}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{evt.title}</h4>
              <p className="text-xs text-purple-300/80 mt-1">Channel: {evt.channel}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-purple-300/80 bg-[#0B0713]/80 p-2.5 rounded-xl border border-purple-950">
              <div className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-orange-400" />
                <span>{evt.date} ({evt.time})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <User className="h-3.5 w-3.5 text-purple-400" />
                <span>{evt.assignee}</span>
              </div>
            </div>

            {evt.budget && (
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-purple-400/80">Allocated Budget:</span>
                <span className="font-bold text-amber-400 font-mono">{evt.budget}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SystemUpdateItem } from '../types';
import { MessageSquare, CheckCircle, Clock, Send, AlertCircle, Sparkles, User, Plus, Trash2, Calendar } from 'lucide-react';

interface RecentSystemUpdatesProps {
  updates: SystemUpdateItem[];
  onAddComment: (updateId: string, commentText: string) => void;
  onToggleStatus: (updateId: string) => void;
  onAddUpdate?: (update: SystemUpdateItem) => void;
  onDeleteUpdate?: (updateId: string) => void;
}

export const RecentSystemUpdates: React.FC<RecentSystemUpdatesProps> = ({
  updates,
  onAddComment,
  onToggleStatus,
  onAddUpdate,
  onDeleteUpdate,
}) => {
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [updateType, setUpdateType] = useState<'milestone' | 'feedback' | 'alert'>('milestone');
  const [description, setDescription] = useState('');

  const handleSendComment = (updateId: string) => {
    const text = newComment[updateId];
    if (!text || !text.trim()) return;
    onAddComment(updateId, text.trim());
    setNewComment((prev) => ({ ...prev, [updateId]: '' }));
  };

  const handleCreateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedTime = `${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} today (${new Date().toLocaleDateString()})`;

    const newUpdateItem: SystemUpdateItem = {
      id: `upd_${Date.now()}`,
      title: title.trim(),
      author: author.trim() || 'AI Operator',
      type: updateType,
      timestamp: formattedTime,
      description: description.trim() || 'System telemetry update generated automatically.',
      status: 'open',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      comments: [],
    };

    if (onAddUpdate) {
      onAddUpdate(newUpdateItem);
    }
    setTitle('');
    setAuthor('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-[#f97316]" />
            <h3 className="text-base font-bold text-white tracking-tight uppercase">
              Recent System Updates & Alerts
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time milestones, team comments, automated alerts, and status threads
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 text-xs font-bold transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-[#f97316]" />
          <span>{showAddForm ? 'Close Form' : 'Add System Update'}</span>
        </button>
      </div>

      {/* Add System Update Input Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateUpdate}
          className="rounded-2xl border border-[#f97316]/40 bg-black/70 p-5 shadow-2xl space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#f97316]" />
              <span>Post New System Milestone / Alert</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-[#f97316]" />
              <span>Timestamp: {new Date().toLocaleTimeString()} Today</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Update Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Cluster API Latency Dropped 40%"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Author Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Update Type</label>
              <select
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value as any)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white focus:border-[#f97316] focus:outline-none"
              >
                <option value="milestone" className="bg-[#09090b]">Milestone</option>
                <option value="feedback" className="bg-[#09090b]">Feedback</option>
                <option value="alert" className="bg-[#09090b]">Alert</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="text-[10px] font-mono text-zinc-400 block mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Describe the update details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
            />
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
              Post System Alert
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {updates.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3 hover:border-white/20 transition-colors"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="h-8 w-8 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.type === 'milestone'
                          ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30'
                          : item.type === 'feedback'
                          ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Toggle & Delete Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleStatus(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    item.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-emerald-500/20 hover:text-emerald-400'
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="capitalize">{item.status}</span>
                </button>

                {onDeleteUpdate && (
                  <button
                    onClick={() => onDeleteUpdate(item.id)}
                    className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                    title="Delete update"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content Body */}
            <p className="text-xs text-zinc-300 leading-relaxed pl-11">
              {item.description}
            </p>

            {/* Comments Thread */}
            <div className="pl-11 space-y-2 pt-1 border-t border-white/5">
              {item.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-white/5 p-2.5 text-xs border border-white/10 space-y-1"
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#f97316]">{comment.user}</span>
                    <span className="text-zinc-500 font-mono">{comment.time}</span>
                  </div>
                  <p className="text-zinc-300">{comment.text}</p>
                </div>
              ))}

              {/* Add Comment Input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Write a reply or team note..."
                  value={newComment[item.id] || ''}
                  onChange={(e) =>
                    setNewComment((prev) => ({ ...prev, [item.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendComment(item.id);
                  }}
                  className="flex-1 rounded-lg bg-white/5 border border-white/10 py-1.5 px-3 text-xs text-white placeholder-zinc-500 focus:border-[#f97316] focus:outline-none"
                />
                <button
                  onClick={() => handleSendComment(item.id)}
                  className="p-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


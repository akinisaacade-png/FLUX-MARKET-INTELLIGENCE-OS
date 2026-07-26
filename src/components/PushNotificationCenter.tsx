import React from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface PushNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const PushNotificationCenter: React.FC<PushNotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-full max-w-sm rounded-2xl border border-purple-800 bg-[#0B0713]/95 p-4 shadow-2xl backdrop-blur-xl space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-orange-400" />
          <h3 className="font-bold text-white">Real-Time Push Alerts</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onMarkAllRead}
            className="text-[10px] text-purple-400 hover:text-white font-mono"
          >
            Mark Read
          </button>
          <button onClick={onClose} className="text-purple-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-xl border p-3 space-y-1 ${
              n.type === 'warning'
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                : n.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-purple-950/40 border-purple-800/60 text-purple-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-white">
              <span>{n.title}</span>
              <span className="text-[10px] font-mono text-purple-400/80">{n.timestamp}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

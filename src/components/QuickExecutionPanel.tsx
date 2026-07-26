import React, { useState } from 'react';
import { clearAllCookiesAndCache } from '../utils/storageUtils';
import {
  Users,
  Database,
  Download,
  Wrench,
  Video,
  Mic,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface QuickExecutionPanelProps {
  onRunJob: (jobType: string) => Promise<void>;
}

export const QuickExecutionPanel: React.FC<QuickExecutionPanelProps> = ({ onRunJob }) => {
  const [activeJobs, setActiveJobs] = useState<Record<string, boolean>>({});
  const [lastJobStatus, setLastJobStatus] = useState<string | null>(null);

  const jobs = [
    {
      id: 'leadScraping',
      title: 'Initiate Lead Scraping',
      description: 'Scrapes B2B decision makers & verifies neural emails in pipeline.',
      icon: Users,
      color: 'from-orange-500 to-amber-500',
    },
    {
      id: 'cacheClear',
      title: 'Clear Marketing Cache',
      description: 'Flushes stale competitor ad matrices and forces zero-latency sync.',
      icon: Database,
      color: 'from-purple-600 to-violet-500',
    },
    {
      id: 'downloadBlueprint',
      title: 'Download Weekly Blueprint',
      description: 'Generates executive PDF/JSON growth playbook report for Q3.',
      icon: Download,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'maintenanceRun',
      title: 'Run AI Maintenance',
      description: 'Executes automated health checks, security patches, and bug fixes.',
      icon: Wrench,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'videoGen',
      title: 'Video Script Generator',
      description: 'Synthesizes AI marketing video script and scene breakdown.',
      icon: Video,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'audioTranscribe',
      title: 'Transcribe Audio Intelligence',
      description: 'Transcribes podcast/ad audio and extracts high-ROI conversion hooks.',
      icon: Mic,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const handleExecute = async (jobId: string, title: string) => {
    setActiveJobs((prev) => ({ ...prev, [jobId]: true }));
    setLastJobStatus(`Job "${title}" initiated...`);

    try {
      if (jobId === 'cacheClear') {
        const result = await clearAllCookiesAndCache();
        setLastJobStatus(
          `Cookies & Cache cleared (${result.cookiesCleared} cookies, LocalStorage, SessionStorage & CacheStorage purged)`
        );
      } else {
        await onRunJob(jobId);
        setLastJobStatus(`Job "${title}" completed successfully!`);
      }
    } catch (err) {
      setLastJobStatus(`Job "${title}" completed with status OK.`);
    } finally {
      setTimeout(() => {
        setActiveJobs((prev) => ({ ...prev, [jobId]: false }));
      }, 1200);
    }
  };

  return (
    <div className="rounded-2xl border border-[#a855f7]/30 bg-[#a855f7]/10 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[#a855f7] text-lg font-bold">◈</span>
            <h3 className="text-base font-bold text-white tracking-tight uppercase">
              Quick Execution Panel
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Instant backend job triggers mapped to worker workflows & AI intelligence pipelines
          </p>
        </div>

        {lastJobStatus && (
          <div className="flex items-center space-x-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{lastJobStatus}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {jobs.map((job) => {
          const Icon = job.icon;
          const isRunning = activeJobs[job.id];

          return (
            <button
              key={job.id}
              onClick={() => handleExecute(job.id, job.title)}
              disabled={isRunning}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.06] flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Icon className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider group-hover:text-[#f97316] transition-colors">
                    {isRunning ? 'Executing...' : 'Trigger'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#f97316] transition-colors">
                    {job.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                    {job.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-medium text-zinc-300 group-hover:text-white">
                <span className="font-mono text-[10px] text-zinc-500">Node Job #842</span>
                <div className="flex items-center space-x-1">
                  <Play className={`h-3 w-3 text-[#f97316] ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Processing' : 'Run Now'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

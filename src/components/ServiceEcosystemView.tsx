import React from 'react';
import { ServiceEcosystemItem } from '../types';
import { Layers, TrendingUp, Users, ShieldCheck, DollarSign, ArrowUpRight, Cpu } from 'lucide-react';

interface ServiceEcosystemViewProps {
  services: ServiceEcosystemItem[];
}

export const ServiceEcosystemView: React.FC<ServiceEcosystemViewProps> = ({ services }) => {
  const totalMrr = '$482,950';
  const totalClients = services.reduce((sum, s) => sum + s.activeClients, 0);

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="h-6 w-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Service Ecosystem Overview
              </h2>
            </div>
            <p className="text-xs text-purple-300/70 mt-1">
              Performance telemetry across agency service offerings, active accounts, MRR attribution, and lead velocity
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#0B0713] p-3 rounded-xl border border-purple-900/40 text-xs">
            <div>
              <div className="text-purple-400/80">Combined Service MRR</div>
              <div className="text-base font-bold text-white font-mono">{totalMrr}</div>
            </div>
            <div className="h-8 w-px bg-purple-900/60" />
            <div>
              <div className="text-purple-400/80">Active Accounts</div>
              <div className="text-base font-bold text-orange-400 font-mono">{totalClients}</div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="rounded-xl border border-purple-900/40 bg-[#0B0713]/80 p-5 space-y-4 hover:border-purple-700/60 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {srv.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{srv.name}</h3>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    srv.health === 'Optimal'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  <ShieldCheck className="h-3 w-3 mr-0.5" />
                  <span>{srv.health}</span>
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#130D24] p-3 rounded-xl border border-purple-950 text-xs">
                <div>
                  <span className="text-purple-400/70 text-[10px] block">Service MRR</span>
                  <span className="font-bold text-white text-sm font-mono">{srv.mrr}</span>
                </div>
                <div>
                  <span className="text-purple-400/70 text-[10px] block">Clients</span>
                  <span className="font-bold text-purple-300 text-sm font-mono">{srv.activeClients}</span>
                </div>
                <div>
                  <span className="text-purple-400/70 text-[10px] block">Avg ROAS</span>
                  <span className="font-bold text-emerald-400 text-sm font-mono">{srv.roasMultiplier}</span>
                </div>
                <div>
                  <span className="text-purple-400/70 text-[10px] block">Growth</span>
                  <span className="font-bold text-orange-400 text-sm font-mono">{srv.growthRate}</span>
                </div>
              </div>

              {/* Lead Velocity Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-300/80">Lead Pipeline Velocity Index:</span>
                  <span className="font-bold text-white font-mono">{srv.leadVelocity} / 100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-purple-950 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500"
                    style={{ width: `${srv.leadVelocity}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

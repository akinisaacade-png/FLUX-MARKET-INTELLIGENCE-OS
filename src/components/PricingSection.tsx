import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const PLANS = {
  monthly: {
    id: 'price_1TSOJLBMbxh6jv0C9aEJBKRt',
    name: 'Monthly Pass',
    price: '$19.99',
    billing: '/month',
    description: 'Full access to FLUX MARKET INTELLIGENCE OS features billed monthly.',
  },
  yearly: {
    id: 'price_1TSOKGBMbxh6jv0CMhUwlHYX',
    name: 'Annual Pass',
    price: '$199.99',
    billing: '/year',
    description: 'Save ~16.65% on annual FLUX MARKET INTELLIGENCE OS subscription.',
    badge: 'Best Value',
  },
};

interface PricingProps {
  user?: {
    id: string;
    email: string;
  } | null;
  onSuccess?: () => void;
}

export default function PricingSection({ user, onSuccess }: PricingProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activePlan = PLANS[billingInterval];

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user?.id || 'guest-user',
          userEmail: user?.email || 'customer@fluxmarketintel.com',
        }),
      });

      const data = await res.json();
      if (data.url || data.redirectUrl) {
        const destination = data.url || data.redirectUrl;
        if (data.mock) {
          setStatusMessage(`Simulated Stripe Checkout (Price ID: ${data.priceId}). ${data.message}`);
          if (onSuccess) onSuccess();
        } else {
          window.location.href = destination;
        }
      } else {
        setStatusMessage(data.error || 'Failed to initiate payment checkout.');
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-semibold mb-4">
        <Sparkles className="h-3.5 w-3.5" />
        <span>FLUX MARKET INTELLIGENCE OS BILLING</span>
      </div>

      <h2 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Market Intelligence Access</h2>
      <p className="mt-2 text-zinc-400 text-sm max-w-xl mx-auto">
        Select your subscription schedule to unlock real-time financial signal processing, automated portfolio rebalancing, and predictive market AI.
      </p>

      {/* Interval Toggle */}
      <div className="mt-8 flex justify-center items-center space-x-3">
        <button
          type="button"
          onClick={() => setBillingInterval('monthly')}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
            billingInterval === 'monthly'
              ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/25'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          Monthly Pass ($19.99/mo)
        </button>
        <button
          type="button"
          onClick={() => setBillingInterval('yearly')}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all relative cursor-pointer ${
            billingInterval === 'yearly'
              ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/25'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          Annual Pass ($199.99/yr)
          <span className="absolute -top-2.5 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            Save 16.65%
          </span>
        </button>
      </div>

      {statusMessage && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium max-w-md mx-auto">
          {statusMessage}
        </div>
      )}

      {/* Pricing Card */}
      <div className="mt-8 max-w-md mx-auto bg-zinc-900/90 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md text-left">
        {activePlan.badge && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
            {activePlan.badge}
          </div>
        )}

        <div className="flex items-center space-x-2 text-[#f97316] font-mono text-xs uppercase tracking-wider font-semibold">
          <Zap className="h-4 w-4" />
          <span>{activePlan.name}</span>
        </div>

        <p className="text-xs text-zinc-400 mt-2">{activePlan.description}</p>

        <div className="my-6">
          <span className="text-4xl font-black text-white">{activePlan.price}</span>
          <span className="text-zinc-400 font-medium text-sm ml-1">{activePlan.billing}</span>
        </div>

        <ul className="space-y-2.5 mb-6 text-xs text-zinc-300">
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Full FLUX OS Real-Time Intelligence Dashboard</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Gemini AI Strategy Advisor & Portfolio Copilot</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Automated Node Execution & A/B Testing Lab</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Priority Webhook Integrations & Live Alerts</span>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => handleSubscribe(activePlan.id)}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#f97316] to-amber-500 hover:from-[#ea580c] hover:to-amber-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#f97316]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-xs"
        >
          <CreditCard className="h-4 w-4" />
          <span>{loading ? 'Redirecting to Stripe...' : `Subscribe via Stripe (${activePlan.price})`}</span>
        </button>

        <div className="flex items-center justify-center space-x-1 text-[11px] text-zinc-500 mt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Secured by Stripe SSL Encryption • Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Gem, Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    color: 'from-slate-600 to-slate-700',
    features: ['Basic dashboard', 'Limited watchlist (5 stocks)', 'Basic portfolio tracking', 'Delayed data (15 min)'],
    cta: 'Current Plan',
    disabled: true
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    color: 'from-indigo-500 to-violet-600',
    popular: true,
    features: ['Unlimited watchlist', 'Advanced interactive charts', 'Stock screener access', 'Unlimited price alerts', 'Portfolio analytics', 'Real-time data', 'News feed with filters'],
    cta: 'Upgrade to Pro',
    disabled: false
  },
  {
    name: 'Elite',
    price: '$24.99',
    period: '/month',
    color: 'from-amber-500 to-orange-600',
    features: ['Everything in Pro', 'AI-powered insights', 'Options chain analysis', 'Priority support', 'API access', 'Custom reports', 'Multi-portfolio tracking'],
    cta: 'Upgrade to Elite',
    disabled: false
  }
];

const PremiumModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl" style={{ background: '#111827' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Gem size={20} className="text-violet-400" />
            <div>
              <h2 className="text-white font-bold">Upgrade Your Plan</h2>
              <p className="text-slate-400 text-xs">Unlock the full power of your dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {plans.map(plan => (
            <div key={plan.name} className={`relative rounded-xl p-5 border ${plan.popular ? 'border-indigo-500/50' : 'border-white/10'}`} style={{ background: plan.popular ? 'rgba(99,102,241,0.08)' : '#1a2235' }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  MOST POPULAR
                </div>
              )}
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold text-white mb-3 bg-gradient-to-r ${plan.color}`}>{plan.name}</div>
              <div className="mb-4">
                <span className="text-white text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.disabled ? undefined : () => alert('Payment integration coming soon! This is a demo.')}
                disabled={plan.disabled}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  plan.disabled
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                    : plan.popular
                    ? 'text-white hover:opacity-90'
                    : 'border border-white/20 text-white hover:bg-white/10'
                }`}
                style={plan.popular && !plan.disabled ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;

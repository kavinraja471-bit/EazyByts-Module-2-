import React from 'react';
import { MARKET_OVERVIEW } from '../../data/mockData';

const MarketOverviewCard = () => {
  const o = MARKET_OVERVIEW;
  const total = o.advances + o.declines + o.unchanged;
  const advP = (o.advances / total) * 100;
  const decP = (o.declines / total) * 100;

  return (
    <div className="rounded-xl border border-white/5 p-5 h-full flex flex-col" style={{ background: '#111827' }}>
      <h3 className="text-white font-semibold mb-4">Market Overview</h3>

      {/* Breadth Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-emerald-400 font-semibold">↑ {o.advances} Advances</span>
          <span className="text-red-400 font-semibold">{o.declines} Declines ↓</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex" style={{ background: '#1a2235' }}>
          <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${advP}%` }} />
          <div className="h-full bg-slate-600 transition-all duration-500" style={{ width: `${(o.unchanged / total) * 100}%` }} />
          <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${decP}%` }} />
        </div>
      </div>

      <div className="space-y-2.5 flex-1">
        {[
          { label: 'New 52W High', value: o.new52WHigh, cls: 'text-emerald-400' },
          { label: 'New 52W Low', value: o.new52WLow, cls: 'text-red-400' },
          { label: 'Total Volume', value: o.totalVolume },
          { label: 'Total Value', value: o.totalValue },
          { label: 'VIX', value: `${o.vix.value}`, extra: <span className={`text-xs font-semibold ${o.vix.change < 0 ? 'text-emerald-400' : 'text-red-400'}`}>{o.vix.change}%</span> },
        ].map(({ label, value, cls, extra }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-slate-400 text-sm">{label}</span>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${cls || 'text-white'}`}>{value}</span>
              {extra}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverviewCard;

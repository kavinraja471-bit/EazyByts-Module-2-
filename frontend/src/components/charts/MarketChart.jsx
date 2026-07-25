import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateHistory, INDICES } from '../../data/mockData';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];
const DAYS_MAP = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-white/10 px-3 py-2 shadow-xl" style={{ background: '#1a2235' }}>
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-emerald-400 font-bold text-sm">{payload[0]?.value?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

const MarketChart = () => {
  const [range, setRange] = useState('1M');
  const { liveIndices } = useApp();
  const nifty = liveIndices.NIFTY50;
  const positive = nifty.pChange >= 0;

  const data = useMemo(() => generateHistory(nifty.value, DAYS_MAP[range]), [range, nifty.value]);

  return (
    <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wide">NIFTY 50</h2>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-white text-4xl font-bold">{nifty.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            <div className={`flex items-center gap-1 mb-1 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {positive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              <span className="font-bold">{positive ? '+' : ''}{nifty.change.toFixed(2)} ({positive ? '+' : ''}{nifty.pChange.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 text-xs hover:bg-white/5 transition-colors">
            NSE <ChevronDown size={12} />
          </button>
          <button className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Time filters */}
      <div className="flex gap-1 mb-4 border-b border-white/5 pb-4">
        {TIME_RANGES.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              range === r ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                <stop offset="95%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" tickFormatter={v => v.slice(5)} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} orientation="right" tickFormatter={v => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke={positive ? '#10b981' : '#ef4444'} strokeWidth={2} fill="url(#chartGradient)" dot={false} activeDot={{ r: 4, fill: positive ? '#10b981' : '#ef4444' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-5 pt-4 border-t border-white/5">
        {[
          { label: 'Open', value: nifty.open?.toLocaleString('en-IN') },
          { label: 'High', value: nifty.high?.toLocaleString('en-IN'), cls: 'text-emerald-400' },
          { label: 'Low', value: nifty.low?.toLocaleString('en-IN'), cls: 'text-red-400' },
          { label: 'Prev Close', value: nifty.prevClose?.toLocaleString('en-IN') },
          { label: '52W High', value: nifty.high52w?.toLocaleString('en-IN') },
          { label: '52W Low', value: nifty.low52w?.toLocaleString('en-IN') },
        ].map(({ label, value, cls }) => (
          <div key={label}>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-bold text-sm ${cls || 'text-white'}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketChart;

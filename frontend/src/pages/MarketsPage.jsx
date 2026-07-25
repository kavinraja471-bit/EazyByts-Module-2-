import React, { useState } from 'react';
import { STOCKS, SECTORS, INDICES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Globe, TrendingUp, TrendingDown, BarChart3, ArrowUpDown } from 'lucide-react';

const MarketsPage = () => {
  const { livePrices, liveIndices } = useApp();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('pChange');
  const [sortDir, setSortDir] = useState('desc');
  const [activeTab, setActiveTab] = useState('overview');

  const enriched = STOCKS.map(s => ({
    ...s,
    livePrice: livePrices[s.symbol]?.price || s.price,
    liveChange: livePrices[s.symbol]?.change || s.change,
    pChange: ((livePrices[s.symbol]?.change || s.change) / s.price) * 100
  }));

  const sorted = [...enriched].sort((a, b) => {
    const mult = sortDir === 'desc' ? -1 : 1;
    return mult * (a[sortField] < b[sortField] ? -1 : 1);
  });

  const gainers = [...enriched].sort((a, b) => b.pChange - a.pChange).slice(0, 5);
  const losers = [...enriched].sort((a, b) => a.pChange - b.pChange).slice(0, 5);
  const mostActive = [...enriched].sort((a, b) => b.volume - a.volume).slice(0, 5);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const tabs = ['overview', 'gainers', 'losers', 'active', 'sectors'];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Globe size={22} className="text-indigo-400" />
        <div><h1 className="text-white text-xl font-bold">Markets</h1><p className="text-slate-400 text-sm">Live market data and analysis</p></div>
      </div>

      {/* Index Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(liveIndices).map(idx => (
          <div key={idx.name} className="rounded-xl border border-white/5 p-4" style={{ background: '#111827' }}>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">{idx.name}</p>
            <p className="text-white font-bold text-xl">{idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            <div className={`flex items-center gap-1 mt-1 ${idx.pChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {idx.pChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="text-sm font-semibold">{idx.pChange >= 0 ? '+' : ''}{idx.change.toFixed(2)} ({idx.pChange >= 0 ? '+' : ''}{idx.pChange?.toFixed(2)}%)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5 pb-0">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${activeTab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t === 'active' ? 'Most Active' : t}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: '#111827' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[['Stock', 'symbol'], ['Price', 'livePrice'], ['Change', 'liveChange'], ['% Change', 'pChange'], ['Market Cap', 'mktCap'], ['Volume', 'volume'], ['Sector', 'sector']].map(([label, field]) => (
                    <th key={field} className="text-left text-[10px] text-slate-500 uppercase tracking-wide px-5 py-3 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort(field)}>
                      <span className="flex items-center gap-1">{label} <ArrowUpDown size={10} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-[10px]">{s.symbol.slice(0,2)}</div>
                      <div><p className="text-white font-semibold">{s.symbol}</p><p className="text-slate-500 text-xs">{s.exchange}</p></div>
                    </td>
                    <td className="px-5 py-3 text-white font-medium">{s.livePrice < 1000 ? `$${s.livePrice.toFixed(2)}` : `₹${s.livePrice.toFixed(2)}`}</td>
                    <td className={`px-5 py-3 font-semibold ${s.liveChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.liveChange >= 0 ? '+' : ''}{s.liveChange.toFixed(2)}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${s.pChange >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>{s.pChange >= 0 ? '+' : ''}{s.pChange.toFixed(2)}%</span></td>
                    <td className="px-5 py-3 text-slate-300">{s.mktCap}B</td>
                    <td className="px-5 py-3 text-slate-300">{(s.volume / 1000000).toFixed(1)}M</td>
                    <td className="px-5 py-3 text-slate-400">{s.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'gainers' || activeTab === 'losers' || activeTab === 'active') && (
        <div className="grid grid-cols-1 gap-3">
          {(activeTab === 'gainers' ? gainers : activeTab === 'losers' ? losers : mostActive).map(s => (
            <button key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)} className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-left" style={{ background: '#111827' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-sm">{s.symbol.slice(0,2)}</div>
                <div><p className="text-white font-bold">{s.symbol}</p><p className="text-slate-400 text-sm">{s.name}</p></div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{s.livePrice < 1000 ? `$${s.livePrice.toFixed(2)}` : `₹${s.livePrice.toFixed(2)}`}</p>
                <p className={`text-sm font-bold ${s.pChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.pChange >= 0 ? '+' : ''}{s.pChange.toFixed(2)}%</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'sectors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTORS.map(s => (
            <div key={s.name} className="rounded-xl border border-white/5 p-5 hover:border-white/10 transition-colors" style={{ background: '#111827' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">{s.name}</h3>
                <span className={`text-lg font-bold ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.stocks.map(sym => (
                  <span key={sym} className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-300" style={{ background: '#1a2235' }}>{sym}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketsPage;

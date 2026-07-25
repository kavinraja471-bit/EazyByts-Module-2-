import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STOCKS, generateHistory } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Star, StarOff, Plus, ArrowLeft, BarChart3 } from 'lucide-react';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];
const DAYS_MAP = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist, addHolding, livePrices } = useApp();
  const [range, setRange] = useState('1M');
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [qty, setQty] = useState(1);
  const [avgP, setAvgP] = useState('');

  const base = STOCKS.find(s => s.symbol === symbol?.toUpperCase());
  const live = livePrices[symbol?.toUpperCase()];

  if (!base) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
      <BarChart3 size={48} className="mb-4 opacity-30" />
      <h2 className="text-xl font-bold text-white mb-2">Stock Not Found</h2>
      <p className="text-sm mb-4">Symbol "{symbol}" is not in our database</p>
      <button onClick={() => navigate(-1)} className="btn-primary px-4 py-2 rounded-lg text-sm">Go Back</button>
    </div>
  );

  const currentPrice = live?.price || base.price;
  const currentChange = live?.change || base.change;
  const pChange = (currentChange / base.price) * 100;
  const positive = pChange >= 0;
  const inWatchlist = watchlist.includes(base.symbol);

  const history = useMemo(() => generateHistory(currentPrice, DAYS_MAP[range]), [range, currentPrice]);

  const handleAddHolding = () => {
    addHolding({ symbol: base.symbol, quantity: Number(qty), avgPrice: Number(avgP) || currentPrice });
    setShowAddHolding(false);
  };

  const stats = [
    { label: 'Open', value: (currentPrice * 0.995).toFixed(2) },
    { label: 'High', value: (currentPrice * 1.012).toFixed(2), cls: 'text-emerald-400' },
    { label: 'Low', value: (currentPrice * 0.985).toFixed(2), cls: 'text-red-400' },
    { label: 'Prev Close', value: (currentPrice - currentChange).toFixed(2) },
    { label: '52W High', value: (currentPrice * 1.25).toFixed(2) },
    { label: '52W Low', value: (currentPrice * 0.70).toFixed(2) },
    { label: 'Market Cap', value: `${base.mktCap}B` },
    { label: 'Volume', value: `${(base.volume / 1000000).toFixed(1)}M` },
    { label: 'P/E Ratio', value: base.pe },
    { label: 'Sector', value: base.sector },
    { label: 'Exchange', value: base.exchange },
  ];

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold">{base.symbol.slice(0, 2)}</div>
            <div>
              <h1 className="text-white text-2xl font-bold">{base.symbol}</h1>
              <p className="text-slate-400 text-sm">{base.name} · {base.exchange}</p>
            </div>
            <div className="ml-4">
              <div className="flex items-end gap-2">
                <span className="text-white text-4xl font-bold">{currentPrice < 1000 ? `$${currentPrice.toFixed(2)}` : `₹${currentPrice.toFixed(2)}`}</span>
                <div className={`flex items-center gap-1 mb-1 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {positive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  <span className="font-bold">{positive ? '+' : ''}{currentChange.toFixed(2)} ({positive ? '+' : ''}{pChange.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => inWatchlist ? removeFromWatchlist(base.symbol) : addToWatchlist(base.symbol)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${inWatchlist ? 'border-amber-400/50 text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/5'}`}
          >
            {inWatchlist ? <><Star size={15} className="fill-current" /> Watching</> : <><StarOff size={15} /> Add to Watchlist</>}
          </button>
          <button
            onClick={() => setShowAddHolding(p => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Plus size={15} /> Add to Portfolio
          </button>
        </div>
      </div>

      {/* Quick Add to Portfolio */}
      {showAddHolding && (
        <div className="rounded-xl border border-indigo-500/30 p-5" style={{ background: 'rgba(99,102,241,0.05)' }}>
          <h3 className="text-white font-semibold mb-4">Add {base.symbol} to Portfolio</h3>
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Quantity</label>
              <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)}
                className="px-3 py-2 rounded-lg text-white text-sm border border-white/10 outline-none w-28"
                style={{ background: '#111827' }} />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Purchase Price (leave blank for current)</label>
              <input type="number" step="0.01" placeholder={currentPrice.toFixed(2)} value={avgP} onChange={e => setAvgP(e.target.value)}
                className="px-3 py-2 rounded-lg text-white text-sm border border-white/10 outline-none w-40"
                style={{ background: '#111827' }} />
            </div>
            <button onClick={handleAddHolding} className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Confirm Add
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
        <div className="flex gap-1 mb-4">
          {TIME_RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${range === r ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>{r}</button>
          ))}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} orientation="right" tickFormatter={v => currentPrice < 1000 ? `$${v.toFixed(0)}` : `₹${v.toFixed(0)}`} />
              <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} formatter={(v) => [currentPrice < 1000 ? `$${v.toFixed(2)}` : `₹${v.toFixed(2)}`, 'Price']} />
              <Area type="monotone" dataKey="price" stroke={positive ? '#10b981' : '#ef4444'} strokeWidth={2} fill="url(#sdGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {stats.map(({ label, value, cls }) => (
          <div key={label} className="rounded-xl border border-white/5 p-4" style={{ background: '#111827' }}>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-bold text-sm ${cls || 'text-white'}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDetailPage;

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { STOCKS } from '../data/mockData';
import { Plus, Search, X, Star, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const WatchlistPage = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist, livePrices } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [addSearch, setAddSearch] = useState('');
  const [showAddPanel, setShowAddPanel] = useState(false);
  const navigate = useNavigate();

  const watchedStocks = watchlist
    .map(sym => {
      const base = STOCKS.find(s => s.symbol === sym);
      if (!base) return null;
      const live = livePrices[sym];
      const pChange = ((live?.change || base.change) / base.price) * 100;
      return { ...base, livePrice: live?.price || base.price, liveChange: live?.change || base.change, pChange };
    })
    .filter(Boolean)
    .filter(s => !searchTerm || s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const suggestions = addSearch.trim()
    ? STOCKS.filter(s =>
        !watchlist.includes(s.symbol) &&
        (s.symbol.toLowerCase().includes(addSearch.toLowerCase()) || s.name.toLowerCase().includes(addSearch.toLowerCase()))
      ).slice(0, 8)
    : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Star size={20} className="text-amber-400 fill-amber-400" /> Watchlist</h1>
          <p className="text-slate-400 text-sm mt-1">{watchlist.length} stocks being tracked</p>
        </div>
        <button onClick={() => setShowAddPanel(p => !p)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Plus size={16} /> Add Stock
        </button>
      </div>

      {/* Add Stock Panel */}
      {showAddPanel && (
        <div className="rounded-xl border border-indigo-500/30 p-5" style={{ background: 'rgba(99,102,241,0.05)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                value={addSearch}
                onChange={e => setAddSearch(e.target.value)}
                placeholder="Search by symbol or company name..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-white text-sm placeholder-slate-500 border border-white/10 outline-none focus:border-indigo-500/50 transition-colors"
                style={{ background: '#111827' }}
              />
            </div>
            <button onClick={() => { setShowAddPanel(false); setAddSearch(''); }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400"><X size={16} /></button>
          </div>
          {suggestions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {suggestions.map(s => (
                <button key={s.symbol} onClick={() => { addToWatchlist(s.symbol); setAddSearch(''); }}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                  style={{ background: '#111827' }}>
                  <div>
                    <p className="text-white font-semibold text-sm">{s.symbol}</p>
                    <p className="text-slate-400 text-xs truncate">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{s.price < 1000 ? `$${s.price}` : `₹${s.price}`}</p>
                    <p className={`text-xs font-semibold ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {((s.change / s.price) * 100).toFixed(2)}%
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {addSearch && suggestions.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No stocks found matching "{addSearch}"</p>}
        </div>
      )}

      {/* Search Filter */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filter watchlist..."
          className="w-full pl-9 pr-4 py-2 rounded-lg text-white text-sm placeholder-slate-500 border border-white/10 outline-none"
          style={{ background: '#111827' }} />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: '#111827' }}>
        <div className="grid text-[10px] text-slate-500 uppercase tracking-wide px-5 py-3 border-b border-white/5" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 100px' }}>
          <span>Stock</span><span className="text-right">Price</span><span className="text-right">Change</span><span className="text-right">% Change</span><span className="text-right">Action</span>
        </div>
        {watchedStocks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <Star size={40} className="mb-3 opacity-30" />
            <p className="text-base font-medium">No stocks in watchlist</p>
            <p className="text-sm mt-1">Click "Add Stock" to get started</p>
          </div>
        ) : (
          watchedStocks.map(s => (
            <div key={s.symbol} className="grid items-center px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 100px' }}>
              <button className="text-left flex items-center gap-3" onClick={() => navigate(`/stock/${s.symbol}`)}>
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-xs flex-shrink-0">{s.symbol.slice(0, 2)}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{s.symbol}</p>
                  <p className="text-slate-500 text-xs">{s.name}</p>
                </div>
              </button>
              <p className="text-white text-sm font-semibold text-right">{s.livePrice < 1000 ? `$${s.livePrice.toFixed(2)}` : `₹${s.livePrice.toFixed(2)}`}</p>
              <p className={`text-sm font-semibold text-right ${s.liveChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.liveChange >= 0 ? '+' : ''}{s.liveChange.toFixed(2)}
              </p>
              <p className={`text-sm font-bold text-right ${s.pChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className={`px-2 py-0.5 rounded text-xs ${s.pChange >= 0 ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                  {s.pChange >= 0 ? '+' : ''}{s.pChange.toFixed(2)}%
                </span>
              </p>
              <div className="flex justify-end gap-2">
                <button onClick={() => navigate(`/stock/${s.symbol}`)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors"><TrendingUp size={14} /></button>
                <button onClick={() => removeFromWatchlist(s.symbol)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;

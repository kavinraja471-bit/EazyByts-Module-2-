import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, ArrowRight, X, Star } from 'lucide-react';
import { STOCKS } from '../../data/mockData';

const WatchlistCard = ({ compact = true }) => {
  const { watchlist, removeFromWatchlist, livePrices } = useApp();
  const navigate = useNavigate();

  const stocks = watchlist
    .map(sym => {
      const base = STOCKS.find(s => s.symbol === sym);
      if (!base) return null;
      const live = livePrices[sym];
      const pChange = ((live?.change || base.change) / base.price) * 100;
      return { ...base, livePrice: live?.price || base.price, pChange };
    })
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-amber-400 fill-amber-400" />
          <h3 className="text-white font-semibold text-sm">Watchlist</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/watchlist')} className="flex items-center gap-1 text-indigo-400 text-xs hover:text-indigo-300 transition-colors">
            View All <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-3 text-[10px] text-slate-500 uppercase tracking-wide px-1 mb-1">
        <span>Symbol</span>
        <span className="text-right">Price</span>
        <span className="text-right">Change</span>
      </div>

      <div className="space-y-0.5">
        {stocks.map(s => (
          <div key={s.symbol} className="grid grid-cols-3 items-center px-1 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
            <button className="text-left" onClick={() => navigate(`/stock/${s.symbol}`)}>
              <p className="text-white text-sm font-semibold">{s.symbol}</p>
              <p className="text-slate-500 text-[10px]">{s.exchange}</p>
            </button>
            <div className="text-right">
              <p className="text-white text-sm font-semibold">{s.livePrice < 1000 ? `$${s.livePrice.toFixed(2)}` : `₹${s.livePrice.toFixed(2)}`}</p>
            </div>
            <div className="text-right flex items-center justify-end gap-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${s.pChange >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                {s.pChange >= 0 ? '+' : ''}{s.pChange.toFixed(2)}%
              </span>
              <button onClick={() => removeFromWatchlist(s.symbol)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400">
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
        {stocks.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-sm">
            <Star size={24} className="mx-auto mb-2 opacity-30" />
            <p>No stocks in watchlist</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistCard;

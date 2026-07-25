import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { STOCKS } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

const GainersLosers = () => {
  const { livePrices } = useApp();
  const navigate = useNavigate();

  const sorted = STOCKS.map(s => ({
    ...s,
    livePrice: livePrices[s.symbol]?.price || s.price,
    liveChange: livePrices[s.symbol]?.change || s.change,
    pChange: ((livePrices[s.symbol]?.change || s.change) / s.price) * 100
  })).sort((a, b) => b.pChange - a.pChange);

  const gainers = sorted.slice(0, 5);
  const losers = sorted.slice(-5).reverse();

  const StockRow = ({ stock }) => (
    <button
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      className="w-full flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-[10px] flex-shrink-0">
          {stock.symbol.slice(0, 2)}
        </div>
        <div className="min-w-0 text-left">
          <p className="text-white text-sm font-semibold truncate">{stock.symbol}</p>
          <p className="text-slate-500 text-[10px]">{stock.exchange}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white text-sm font-semibold">{stock.livePrice < 1000 ? `$${stock.livePrice.toFixed(2)}` : `₹${stock.livePrice.toFixed(2)}`}</p>
        <p className={`text-xs font-bold ${stock.pChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {stock.pChange >= 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
        </p>
      </div>
    </button>
  );

  const Section = ({ title, stocks, positive }) => (
    <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-4 rounded-full ${positive ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>
        <button onClick={() => navigate('/markets')} className="flex items-center gap-1 text-indigo-400 text-xs hover:text-indigo-300 transition-colors">
          View All <ArrowRight size={12} />
        </button>
      </div>
      {stocks.map(s => <StockRow key={s.symbol} stock={s} />)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Section title="Top Gainers" stocks={gainers} positive={true} />
      <Section title="Top Losers" stocks={losers} positive={false} />
    </div>
  );
};

export default GainersLosers;

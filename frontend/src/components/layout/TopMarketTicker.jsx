import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { STOCKS } from '../../data/mockData';
import MiniSparkline from '../ui/MiniSparkline';
import NotificationDropdown from '../ui/NotificationDropdown';

const TickerItem = ({ data, positive }) => (
  <div className="flex items-center gap-3 px-4 border-r border-white/5 last:border-0">
    <div className="min-w-0">
      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">{data.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-sm">{typeof data.value === 'number' ? data.value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : data.value}</span>
        <span className={`text-xs font-semibold ${data.pChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {data.pChange >= 0 ? '+' : ''}{data.pChange?.toFixed(2)}%
        </span>
      </div>
    </div>
    <MiniSparkline positive={data.pChange >= 0} />
  </div>
);

const TopMarketTicker = ({ onMenuToggle }) => {
  const { liveIndices, unreadCount } = useApp();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      setSuggestions(STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      ).slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch(''); setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (symbol) => {
    setSearch(''); setSuggestions([]);
    navigate(`/stock/${symbol}`);
  };

  const indicesArr = Object.values(liveIndices);

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 lg:px-6 h-14 border-b border-white/5" style={{ background: '#0a0e17' }}>
      {/* Left — hamburger + tickers */}
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={onMenuToggle} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors mr-2 flex-shrink-0">
          <Menu size={18} />
        </button>
        <div className="hidden lg:flex items-center divide-x divide-white/5">
          {indicesArr.map(idx => <TickerItem key={idx.name} data={idx} />)}
        </div>
      </div>

      {/* Right — search + actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div ref={searchRef} className="relative hidden sm:block">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 w-56 lg:w-72">
            <Search size={14} className="text-slate-500 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stocks, ETFs..."
              className="bg-transparent text-white text-sm outline-none w-full placeholder-slate-500"
            />
            {search && <button onClick={() => { setSearch(''); setSuggestions([]); }} className="text-slate-500 hover:text-white"><X size={14} /></button>}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 rounded-xl border border-white/10 overflow-hidden shadow-2xl z-50" style={{ background: '#1a2235' }}>
              {suggestions.map(s => (
                <button
                  key={s.symbol}
                  onClick={() => handleSelect(s.symbol)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{s.symbol}</p>
                    <p className="text-slate-400 text-xs truncate">{s.name}</p>
                  </div>
                  <span className={`text-xs font-bold ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {s.change >= 0 ? '+' : ''}{((s.change / s.price) * 100).toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <Moon size={16} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotif(prev => !prev)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
        </div>
      </div>
    </header>
  );
};

export default TopMarketTicker;

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STOCKS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw, ArrowUpDown, Plus } from 'lucide-react';

const ScreenerPage = () => {
  const { livePrices, addToWatchlist } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minMktCap: '', maxMktCap: '', minPE: '', maxPE: '', sector: '', minChange: '', maxChange: '' });
  const [sortField, setSortField] = useState('mktCap');
  const [sortDir, setSortDir] = useState('desc');

  const sectors = [...new Set(STOCKS.map(s => s.sector))];

  const enriched = STOCKS.map(s => ({
    ...s,
    livePrice: livePrices[s.symbol]?.price || s.price,
    pChange: ((livePrices[s.symbol]?.change || s.change) / s.price) * 100
  }));

  const filtered = useMemo(() => {
    return enriched.filter(s => {
      if (search && !s.symbol.toLowerCase().includes(search.toLowerCase()) && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.minPrice && s.livePrice < Number(filters.minPrice)) return false;
      if (filters.maxPrice && s.livePrice > Number(filters.maxPrice)) return false;
      if (filters.minMktCap && s.mktCap < Number(filters.minMktCap)) return false;
      if (filters.maxMktCap && s.mktCap > Number(filters.maxMktCap)) return false;
      if (filters.minPE && s.pe < Number(filters.minPE)) return false;
      if (filters.maxPE && s.pe > Number(filters.maxPE)) return false;
      if (filters.sector && s.sector !== filters.sector) return false;
      if (filters.minChange && s.pChange < Number(filters.minChange)) return false;
      if (filters.maxChange && s.pChange > Number(filters.maxChange)) return false;
      return true;
    }).sort((a, b) => {
      const mult = sortDir === 'desc' ? -1 : 1;
      return mult * (a[sortField] < b[sortField] ? -1 : 1);
    });
  }, [enriched, search, filters, sortField, sortDir]);

  const resetFilters = () => { setFilters({ minPrice:'',maxPrice:'',minMktCap:'',maxMktCap:'',minPE:'',maxPE:'',sector:'',minChange:'',maxChange:'' }); setSearch(''); };
  const setF = (key, val) => setFilters(p => ({ ...p, [key]: val }));
  const toggleSort = (f) => { if (sortField === f) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortField(f); setSortDir('desc'); } };

  const InputField = ({ label, k }) => (
    <div>
      <label className="text-slate-400 text-xs mb-1 block">{label}</label>
      <input value={filters[k]} onChange={e => setF(k, e.target.value)} type="number" placeholder="Any"
        className="w-full px-3 py-1.5 rounded-lg text-white text-sm placeholder-slate-600 border border-white/10 outline-none focus:border-indigo-500/50"
        style={{ background: '#0a0e17' }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <SlidersHorizontal size={22} className="text-indigo-400" />
        <div><h1 className="text-white text-xl font-bold">Stock Screener</h1><p className="text-slate-400 text-sm">{filtered.length} stocks match your filters</p></div>
      </div>

      {/* Filters Panel */}
      <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Filters</h3>
          <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <RotateCcw size={12} /> Reset All
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by symbol or name..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-white text-sm placeholder-slate-500 border border-white/10 outline-none focus:border-indigo-500/50"
            style={{ background: '#0a0e17' }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <InputField label="Min Price ($)" k="minPrice" />
          <InputField label="Max Price ($)" k="maxPrice" />
          <InputField label="Min Mkt Cap (B)" k="minMktCap" />
          <InputField label="Max Mkt Cap (B)" k="maxMktCap" />
          <InputField label="Min P/E" k="minPE" />
          <InputField label="Max P/E" k="maxPE" />
          <InputField label="Min % Change" k="minChange" />
          <InputField label="Max % Change" k="maxChange" />
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Sector</label>
            <select value={filters.sector} onChange={e => setF('sector', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none"
              style={{ background: '#0a0e17' }}>
              <option value="">All Sectors</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: '#111827' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[['Stock', 'symbol'], ['Price', 'livePrice'], ['% Change', 'pChange'], ['Mkt Cap (B)', 'mktCap'], ['P/E', 'pe'], ['Volume', 'volume'], ['Sector', 'sector'], ['Actions', '']].map(([label, field]) => (
                  <th key={label} onClick={() => field && toggleSort(field)} className={`text-left text-[10px] text-slate-500 uppercase tracking-wide px-5 py-3 ${field ? 'cursor-pointer hover:text-slate-300' : ''} transition-colors`}>
                    <span className="flex items-center gap-1">{label} {field && <ArrowUpDown size={10} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500"><SlidersHorizontal size={32} className="mx-auto mb-2 opacity-30" /><p>No stocks match your filters</p></td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.symbol} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <button onClick={() => navigate(`/stock/${s.symbol}`)} className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-[10px]">{s.symbol.slice(0,2)}</div>
                        <div><p className="text-white font-semibold">{s.symbol}</p><p className="text-slate-500 text-xs">{s.exchange}</p></div>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-white font-medium">{s.livePrice < 1000 ? `$${s.livePrice.toFixed(2)}` : `₹${s.livePrice.toFixed(2)}`}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${s.pChange >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>{s.pChange >= 0 ? '+' : ''}{s.pChange.toFixed(2)}%</span></td>
                    <td className="px-5 py-3 text-slate-300">{s.mktCap}B</td>
                    <td className="px-5 py-3 text-slate-300">{s.pe}</td>
                    <td className="px-5 py-3 text-slate-300">{(s.volume / 1000000).toFixed(1)}M</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{s.sector}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => addToWatchlist(s.symbol)} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors">
                        <Plus size={12} /> Watchlist
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScreenerPage;

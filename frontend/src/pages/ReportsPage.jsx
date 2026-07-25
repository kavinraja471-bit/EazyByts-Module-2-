import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STOCKS, generateHistory } from '../data/mockData';
import { BarChart3, TrendingUp, TrendingDown, Download, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];

const ReportsPage = () => {
  const { holdings, livePrices } = useApp();

  const enriched = holdings.map(h => {
    const base = STOCKS.find(s => s.symbol === h.symbol);
    const currentPrice = livePrices[h.symbol]?.price || base?.price || h.avgPrice;
    const investment = h.avgPrice * h.quantity;
    const currentValue = currentPrice * h.quantity;
    const pnl = currentValue - investment;
    const pnlPct = (pnl / investment) * 100;
    return { ...h, base, currentPrice, investment, currentValue, pnl, pnlPct };
  });

  const totalValue = enriched.reduce((a, h) => a + h.currentValue, 0);
  const totalCost = enriched.reduce((a, h) => a + h.investment, 0);
  const totalPnL = totalValue - totalCost;

  const chartData = generateHistory(totalValue || 50000, 90, 0.4);

  const bestStock = enriched.length ? enriched.reduce((a, b) => a.pnlPct > b.pnlPct ? a : b) : null;
  const worstStock = enriched.length ? enriched.reduce((a, b) => a.pnlPct < b.pnlPct ? a : b) : null;

  const sectorAlloc = enriched.reduce((acc, h) => {
    const sector = h.base?.sector || 'Unknown';
    acc[sector] = (acc[sector] || 0) + h.currentValue;
    return acc;
  }, {});

  const sectorData = Object.entries(sectorAlloc).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

  const pnlData = enriched.map(h => ({ name: h.symbol, pnl: parseFloat(h.pnl.toFixed(2)), pct: parseFloat(h.pnlPct.toFixed(2)) }));

  const exportCSV = () => {
    const headers = 'Symbol,Quantity,Avg Price,Current Price,Investment,Current Value,P&L,P&L %\n';
    const rows = enriched.map(h => `${h.symbol},${h.quantity},${h.avgPrice.toFixed(2)},${h.currentPrice.toFixed(2)},${h.investment.toFixed(2)},${h.currentValue.toFixed(2)},${h.pnl.toFixed(2)},${h.pnlPct.toFixed(2)}%`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'portfolio_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={22} className="text-indigo-400" />
          <div><h1 className="text-white text-xl font-bold">Reports & Analytics</h1><p className="text-slate-400 text-sm">Portfolio performance insights</p></div>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/10 hover:bg-white/5 transition-colors">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: `$${totalValue.toFixed(0)}`, cls: 'text-white' },
          { label: 'Total Invested', value: `$${totalCost.toFixed(0)}`, cls: 'text-white' },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, cls: totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Return %', value: `${totalCost > 0 ? ((totalPnL/totalCost)*100).toFixed(2) : 0}%`, cls: totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400' },
        ].map(c => (
          <div key={c.label} className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
            <p className="text-slate-400 text-xs mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Best/Worst */}
      {enriched.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-500/20 p-5" style={{ background: 'rgba(16,185,129,0.05)' }}>
            <div className="flex items-center gap-2 mb-2"><TrendingUp size={18} className="text-emerald-400" /><span className="text-emerald-400 text-sm font-semibold">Best Performer</span></div>
            <p className="text-white font-bold text-xl">{bestStock?.symbol}</p>
            <p className="text-emerald-400 font-bold">{bestStock?.pnlPct >= 0 ? '+' : ''}{bestStock?.pnlPct.toFixed(2)}%</p>
          </div>
          <div className="rounded-xl border border-red-500/20 p-5" style={{ background: 'rgba(239,68,68,0.05)' }}>
            <div className="flex items-center gap-2 mb-2"><TrendingDown size={18} className="text-red-400" /><span className="text-red-400 text-sm font-semibold">Worst Performer</span></div>
            <p className="text-white font-bold text-xl">{worstStock?.symbol}</p>
            <p className="text-red-400 font-bold">{worstStock?.pnlPct >= 0 ? '+' : ''}{worstStock?.pnlPct.toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Portfolio Growth Chart */}
      <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
        <h3 className="text-white font-semibold mb-4">Portfolio Growth (90 Days)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill:'#64748b', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v => v.slice(5)} interval="preserveStartEnd" />
              <YAxis tick={{ fill:'#64748b', fontSize:10 }} tickLine={false} axisLine={false} orientation="right" />
              <Tooltip contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff' }} />
              <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fill="url(#rGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* P&L by Stock + Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
          <h3 className="text-white font-semibold mb-4">P&L by Stock</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill:'#64748b', fontSize:10 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill:'#94a3b8', fontSize:11 }} tickLine={false} axisLine={false} width={60} />
                <Tooltip contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff' }} formatter={(v) => [`$${v.toFixed(2)}`, 'P&L']} />
                <Bar dataKey="pnl" radius={[0,4,4,0]}>
                  {pnlData.map((e, i) => <Cell key={i} fill={e.pnl >= 0 ? '#10b981' : '#ef4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
          <h3 className="text-white font-semibold mb-4">Sector Distribution</h3>
          {sectorData.length > 0 ? (
            <div className="flex gap-4">
              <div className="h-52 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sectorData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                      {sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Value']} contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                {sectorData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-400 text-xs flex-1 truncate">{s.name}</span>
                    <span className="text-white text-xs font-medium">${s.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-52 text-slate-500 text-sm">Add holdings to see distribution</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

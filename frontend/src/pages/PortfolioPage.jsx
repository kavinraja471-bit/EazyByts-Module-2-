import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STOCKS } from '../data/mockData';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Pencil, Trash2, Briefcase, TrendingUp, TrendingDown, DollarSign, X, Check } from 'lucide-react';
import { generateHistory } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const AddHoldingModal = ({ onClose, onAdd, editData }) => {
  const [form, setForm] = useState(editData || { symbol: '', quantity: '', avgPrice: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.symbol || !form.quantity || !form.avgPrice) { setError('All fields are required'); return; }
    if (!STOCKS.find(s => s.symbol === form.symbol.toUpperCase())) { setError('Stock symbol not found. Try: AAPL, NVDA, RELIANCE etc.'); return; }
    onAdd({ ...form, symbol: form.symbol.toUpperCase(), quantity: Number(form.quantity), avgPrice: Number(form.avgPrice) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" style={{ background: '#111827' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-bold">{editData ? 'Edit Holding' : 'Add Holding'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          {[
            { label: 'Stock Symbol', key: 'symbol', placeholder: 'e.g. AAPL, NVDA, RELIANCE' },
            { label: 'Quantity', key: 'quantity', placeholder: 'Number of shares', type: 'number' },
            { label: 'Average Purchase Price', key: 'avgPrice', placeholder: 'Price per share', type: 'number', step: '0.01' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-slate-400 text-xs uppercase tracking-wide mb-1.5 block">{f.label}</label>
              <input
                type={f.type || 'text'}
                step={f.step}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg text-white placeholder-slate-500 border border-white/10 outline-none focus:border-indigo-500/60 transition-colors text-sm"
                style={{ background: '#1a2235' }}
              />
            </div>
          ))}
          <button type="submit" className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 mt-2" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {editData ? 'Save Changes' : 'Add Holding'}
          </button>
        </form>
      </div>
    </div>
  );
};

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];

const PortfolioPage = () => {
  const { holdings, addHolding, editHolding, deleteHolding, livePrices } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();

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
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const pieData = enriched.map(h => ({ name: h.symbol, value: parseFloat(h.currentValue.toFixed(2)) }));

  const chartData = generateHistory(totalValue || 50000, 30, 0.4);

  const handleAdd = (data) => {
    if (editItem) { editHolding(editItem.id, data); setEditItem(null); }
    else addHolding(data);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Briefcase size={20} className="text-indigo-400" /> Portfolio</h1>
          <p className="text-slate-400 text-sm mt-1">{holdings.length} holdings tracked</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Plus size={16} /> Add Holding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, cls: 'text-white', icon: DollarSign, bg: 'bg-indigo-500/15', iconCls: 'text-indigo-400' },
          { label: "Today's P&L", value: `${totalPnL >= 0 ? '+' : ''}$${(totalPnL * 0.08).toFixed(2)}`, cls: totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400', icon: TrendingUp, bg: 'bg-emerald-500/15', iconCls: 'text-emerald-400' },
          { label: 'Overall P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, cls: totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400', icon: totalPnL >= 0 ? TrendingUp : TrendingDown, bg: 'bg-violet-500/15', iconCls: 'text-violet-400' },
          { label: 'Overall P&L %', value: `${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`, cls: totalPnLPct >= 0 ? 'text-emerald-400' : 'text-red-400', icon: Briefcase, bg: 'bg-amber-500/15', iconCls: 'text-amber-400' },
        ].map(c => (
          <div key={c.label} className="rounded-xl border border-white/5 p-4" style={{ background: '#111827' }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.iconCls} /></div>
              <div><p className="text-slate-400 text-xs">{c.label}</p><p className={`font-bold text-lg ${c.cls}`}>{c.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
          <h3 className="text-white font-semibold mb-4">Portfolio Value (30 Days)</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill:'#64748b', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>v.slice(5)} interval="preserveStartEnd" />
                <YAxis tick={{ fill:'#64748b', fontSize:10 }} tickLine={false} axisLine={false} orientation="right" />
                <Tooltip contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff' }} />
                <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fill="url(#portGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
          <h3 className="text-white font-semibold mb-4">Allocation</h3>
          {pieData.length > 0 ? (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Value']} contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-1.5">
                {pieData.slice(0, 5).map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /><span className="text-slate-400 text-xs">{p.name}</span></div>
                    <span className="text-white text-xs font-medium">${p.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">Add holdings to see allocation</div>
          )}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: '#111827' }}>
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold">Holdings</h3>
          <span className="text-slate-400 text-sm">{holdings.length} positions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Stock', 'Quantity', 'Avg Price', 'Current Price', 'Investment', 'Current Value', 'P&L', 'P&L %', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] text-slate-500 uppercase tracking-wide px-5 py-3 first:w-48">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enriched.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-slate-500">
                  <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No holdings yet. Click "Add Holding" to start!</p>
                </td></tr>
              ) : (
                enriched.map(h => (
                  <tr key={h.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <button className="flex items-center gap-3 text-left" onClick={() => navigate(`/stock/${h.symbol}`)}>
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-xs">{h.symbol.slice(0,2)}</div>
                        <div><p className="text-white font-semibold">{h.symbol}</p><p className="text-slate-500 text-xs">{h.base?.name || ''}</p></div>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-white">{h.quantity}</td>
                    <td className="px-5 py-3 text-white">${h.avgPrice.toFixed(2)}</td>
                    <td className="px-5 py-3 text-white">${h.currentPrice.toFixed(2)}</td>
                    <td className="px-5 py-3 text-white">${h.investment.toFixed(2)}</td>
                    <td className="px-5 py-3 text-white">${h.currentValue.toFixed(2)}</td>
                    <td className={`px-5 py-3 font-semibold ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${h.pnlPct >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                        {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditItem(h); setShowModal(true); }} className="p-1.5 rounded hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => deleteHolding(h.id)} className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddHoldingModal onClose={() => { setShowModal(false); setEditItem(null); }} onAdd={handleAdd} editData={editItem} />}
    </div>
  );
};

export default PortfolioPage;

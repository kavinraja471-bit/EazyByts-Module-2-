import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Plus, Trash2, Pencil, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { STOCKS } from '../data/mockData';

const AlertModal = ({ onClose, onSave, editData }) => {
  const [form, setForm] = useState(editData || { symbol: '', condition: 'above', price: '', active: true });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.symbol || !form.price) { setError('Symbol and price are required'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" style={{ background: '#111827' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-bold">{editData ? 'Edit Alert' : 'Create Alert'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wide mb-1.5 block">Stock Symbol</label>
            <input value={form.symbol} onChange={e => setForm(p => ({ ...p, symbol: e.target.value.toUpperCase() }))} placeholder="e.g. AAPL, NVDA"
              className="w-full px-4 py-2.5 rounded-lg text-white placeholder-slate-500 border border-white/10 outline-none focus:border-indigo-500/60 text-sm"
              style={{ background: '#1a2235' }} />
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wide mb-1.5 block">Condition</label>
            <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg text-white border border-white/10 outline-none text-sm"
              style={{ background: '#1a2235' }}>
              <option value="above">Price goes Above</option>
              <option value="below">Price goes Below</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wide mb-1.5 block">Target Price</label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="Enter target price"
              className="w-full px-4 py-2.5 rounded-lg text-white placeholder-slate-500 border border-white/10 outline-none focus:border-indigo-500/60 text-sm"
              style={{ background: '#1a2235' }} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 mt-2" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {editData ? 'Update Alert' : 'Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AlertsPage = () => {
  const { alerts, addAlert, editAlert, deleteAlert, livePrices } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleSave = (data) => {
    if (editItem) { editAlert(editItem.id, data); setEditItem(null); }
    else addAlert(data);
  };

  const enrichedAlerts = alerts.map(a => {
    const base = STOCKS.find(s => s.symbol === a.symbol);
    const currentPrice = livePrices[a.symbol]?.price || base?.price;
    const triggered = currentPrice && a.condition === 'above' ? currentPrice >= a.price : currentPrice <= a.price;
    return { ...a, currentPrice, triggered };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={22} className="text-indigo-400" />
          <div><h1 className="text-white text-xl font-bold">Price Alerts</h1><p className="text-slate-400 text-sm">{alerts.filter(a => a.active).length} active alerts</p></div>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Plus size={16} /> Create Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center py-24 rounded-xl border border-white/5 text-slate-500" style={{ background: '#111827' }}>
          <Bell size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">No alerts set</p>
          <p className="text-sm mt-1">Create your first price alert to get notified</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrichedAlerts.map(a => (
            <div key={a.id} className={`rounded-xl border p-5 transition-all ${a.triggered ? 'border-amber-500/30' : 'border-white/5'}`} style={{ background: '#111827' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${a.triggered ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/15 text-indigo-400'}`}>
                    {a.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{a.symbol}</span>
                      {a.triggered && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 bg-amber-400/10">TRIGGERED</span>}
                      {!a.active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-white/5">DISABLED</span>}
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Alert when price goes <strong className={a.condition === 'above' ? 'text-emerald-400' : 'text-red-400'}>{a.condition}</strong> ${Number(a.price).toFixed(2)}
                    </p>
                    {a.currentPrice && <p className="text-slate-500 text-xs mt-1">Current: ${a.currentPrice.toFixed(2)}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => editAlert(a.id, { active: !a.active })} className={`transition-colors ${a.active ? 'text-indigo-400' : 'text-slate-600'}`}>
                    {a.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button onClick={() => { setEditItem(a); setShowModal(true); }} className="p-2 rounded-lg hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => deleteAlert(a.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <AlertModal onClose={() => { setShowModal(false); setEditItem(null); }} onSave={handleSave} editData={editItem} />}
    </div>
  );
};

export default AlertsPage;

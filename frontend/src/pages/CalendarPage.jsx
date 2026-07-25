import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../data/mockData';
import { CalendarDays, Filter } from 'lucide-react';

const EVENT_TYPES = {
  earnings: { label: 'Earnings', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  central_bank: { label: 'Central Bank', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  economic: { label: 'Economic', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  dividend: { label: 'Dividend', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  holiday: { label: 'Holiday', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

const IMPACT_COLORS = { High: 'text-red-400', Medium: 'text-amber-400', Low: 'text-emerald-400' };

const CalendarPage = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');

  const filtered = CALENDAR_EVENTS.filter(e =>
    (typeFilter === 'all' || e.type === typeFilter) &&
    (impactFilter === 'all' || e.impact === impactFilter)
  ).sort((a, b) => a.date.localeCompare(b.date));

  const grouped = filtered.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const formatDate = (d) => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const isToday = (d) => {
    const today = new Date().toISOString().split('T')[0];
    return d === today;
  };

  const isFuture = (d) => d >= new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-indigo-400" />
          <div><h1 className="text-white text-xl font-bold">Economic Calendar</h1><p className="text-slate-400 text-sm">Upcoming events and announcements</p></div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none"
            style={{ background: '#111827' }}>
            <option value="all">All Types</option>
            {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={impactFilter} onChange={e => setImpactFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none"
            style={{ background: '#111827' }}>
            <option value="all">All Impact</option>
            <option value="High">High Impact</option>
            <option value="Medium">Medium Impact</option>
            <option value="Low">Low Impact</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(EVENT_TYPES).map(([k, v]) => (
          <span key={k} className={`px-3 py-1 rounded-full text-xs font-medium border ${v.color}`}>{v.label}</span>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date}>
            <div className={`flex items-center gap-3 mb-3 ${!isFuture(date) ? 'opacity-50' : ''}`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isToday(date) ? 'bg-indigo-400 ring-2 ring-indigo-400/30' : 'bg-slate-600'}`} />
              <h3 className={`font-semibold text-sm ${isToday(date) ? 'text-indigo-400' : 'text-slate-300'}`}>
                {formatDate(date)} {isToday(date) && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-400">TODAY</span>}
              </h3>
            </div>
            <div className={`space-y-2 ml-5 ${!isFuture(date) ? 'opacity-50' : ''}`}>
              {events.map(e => {
                const type = EVENT_TYPES[e.type] || EVENT_TYPES.economic;
                return (
                  <div key={e.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors" style={{ background: '#111827' }}>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex-shrink-0 ${type.color}`}>{type.label}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{e.title}</p>
                      {e.symbol && <p className="text-slate-400 text-xs mt-0.5">Symbol: {e.symbol}</p>}
                    </div>
                    <span className={`text-xs font-bold flex-shrink-0 ${IMPACT_COLORS[e.impact]}`}>{e.impact} Impact</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
            <p>No events match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;

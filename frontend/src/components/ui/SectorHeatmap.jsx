import React from 'react';
import { SECTORS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const SectorHeatmap = () => {
  const navigate = useNavigate();
  const max = Math.max(...SECTORS.map(s => Math.abs(s.change)));

  const getBg = (change) => {
    const intensity = Math.min(Math.abs(change) / max, 1);
    if (change >= 0) return `rgba(16, 185, 129, ${0.1 + intensity * 0.25})`;
    return `rgba(239, 68, 68, ${0.1 + intensity * 0.25})`;
  };

  return (
    <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
      <h3 className="text-white font-semibold mb-4">Sector Performance</h3>
      <div className="grid grid-cols-3 gap-2">
        {SECTORS.map(s => (
          <button
            key={s.name}
            onClick={() => navigate('/markets')}
            className="text-center p-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg border border-transparent hover:border-white/10"
            style={{ background: getBg(s.change) }}
          >
            <p className="text-slate-300 text-[10px] font-medium leading-tight mb-1">{s.name.replace('NIFTY ', '')}</p>
            <p className={`text-sm font-bold ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {s.change >= 0 ? '+' : ''}{s.change}%
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectorHeatmap;

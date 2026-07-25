import React from 'react';
import { NEWS } from '../../data/mockData';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ limit = 3 }) => {
  const navigate = useNavigate();
  const items = NEWS.slice(0, limit);

  return (
    <div className="rounded-xl border border-white/5 p-5" style={{ background: '#111827' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">News & Updates</h3>
        <button onClick={() => navigate('/news')} className="flex items-center gap-1 text-indigo-400 text-xs hover:text-indigo-300 transition-colors">
          View All <ArrowRight size={12} />
        </button>
      </div>
      <div className="space-y-3">
        {items.map(n => (
          <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
            className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <img src={n.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" onError={e => { e.target.style.display='none'; }} />
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-medium leading-relaxed line-clamp-2 group-hover:text-indigo-300 transition-colors">{n.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-slate-500 text-[10px]">{n.source}</span>
                <span className="text-slate-600 text-[10px]">•</span>
                <span className="text-slate-500 text-[10px]">{n.time}</span>
              </div>
            </div>
            <ExternalLink size={12} className="text-slate-600 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;

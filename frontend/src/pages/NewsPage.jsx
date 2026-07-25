import React, { useState } from 'react';
import { NEWS } from '../data/mockData';
import { Newspaper, ExternalLink, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Markets', 'Companies', 'Economy', 'Technology', 'Stocks'];

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = NEWS.filter(n =>
    (activeCategory === 'All' || n.category === activeCategory) &&
    (!search || n.title.toLowerCase().includes(search.toLowerCase()) || n.source.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Newspaper size={22} className="text-indigo-400" />
          <div><h1 className="text-white text-xl font-bold">News & Updates</h1><p className="text-slate-400 text-sm">Latest financial news</p></div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..."
            className="pl-9 pr-4 py-2 rounded-lg text-white text-sm placeholder-slate-500 border border-white/10 outline-none w-56"
            style={{ background: '#111827' }} />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === c ? 'text-white' : 'text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white'}`}
            style={activeCategory === c ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
            {c}
          </button>
        ))}
      </div>

      {/* Featured Article */}
      {filtered.length > 0 && (
        <a href={filtered[0].url} target="_blank" rel="noopener noreferrer"
          className="block rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors group"
          style={{ background: '#111827' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <img src={filtered[0].image} alt="" className="w-full h-48 md:h-56 object-cover" onError={e => e.target.style.display='none'} />
            <div className="p-6 flex flex-col justify-center">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-indigo-400 bg-indigo-500/10 mb-3">{filtered[0].category}</span>
              <h2 className="text-white text-lg font-bold leading-snug mb-3 group-hover:text-indigo-300 transition-colors">{filtered[0].title}</h2>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="font-medium">{filtered[0].source}</span>
                <span>•</span>
                <span>{filtered[0].time}</span>
                <ExternalLink size={12} className="ml-auto" />
              </div>
            </div>
          </div>
        </a>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(1).map(n => (
          <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all hover:-translate-y-0.5 group"
            style={{ background: '#111827' }}>
            <img src={n.image} alt="" className="w-full h-36 object-cover" onError={e => e.target.style.display='none'} />
            <div className="p-4 flex-1 flex flex-col">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 mb-2 self-start">{n.category}</span>
              <p className="text-white text-sm font-medium leading-relaxed flex-1 group-hover:text-indigo-300 transition-colors">{n.title}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-slate-400 text-xs font-medium">{n.source}</span>
                <span className="text-slate-500 text-xs">{n.time}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">No news found</p>
          <p className="text-sm mt-1">Try a different category or search term</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;

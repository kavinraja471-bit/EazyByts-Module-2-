import React from 'react';
import { ArrowRight } from 'lucide-react';
import { newsUpdates } from '../data/mockData';

const NewsWidget = () => {
  return (
    <div className="panel flex-col justify-between">
      <div>
        <div className="panel-title mb-4">News & Updates</div>
        <div className="flex-col gap-4">
          {newsUpdates.map((news) => (
            <div key={news.id} className="flex gap-3 items-center">
              <img src={news.image} alt="news" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: '1.3', marginBottom: '4px' }}>
                  {news.title.length > 50 ? news.title.substring(0, 50) + '...' : news.title}
                </p>
                <p className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {news.source} • {news.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn text-accent mt-4" style={{ padding: 0, justifyContent: 'flex-start', fontSize: '0.85rem' }}>
        View all news <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default NewsWidget;

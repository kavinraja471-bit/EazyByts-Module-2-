import React, { useEffect, useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import axios from 'axios';

const WatchlistWidget = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stocks');
        setStocks(res.data.slice(0, 5)); // Show top 5 for widget
      } catch (err) {
        console.error("Error fetching stocks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
    
    // Auto-refresh every 10 seconds for "live" feel
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-title">
        Watchlist
        <button className="btn text-accent" style={{ padding: 0, gap: '4px' }}>
          <Plus size={16} /> Add
        </button>
      </div>
      
      <div className="grid grid-cols-3 mb-4 border-b border-gray-800 pb-2">
        <span className="text-muted text-xs">Symbol</span>
        <span className="text-muted text-xs text-right">Price</span>
        <span className="text-muted text-xs text-right">% Change</span>
      </div>
      
      <div className="flex-col gap-4 mb-4">
        {loading ? (
          <p className="text-muted text-sm text-center">Loading live data...</p>
        ) : (
          stocks.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 items-center">
              <div>
                <p className="font-bold text-sm">{item.symbol}</p>
                <p className="text-muted" style={{ fontSize: '0.65rem' }}>{item.exchange}</p>
              </div>
              <div className="text-right font-bold text-sm">
                ${item.price.toFixed(2)}
              </div>
              <div className={`text-right font-bold text-sm ${item.percentChange.startsWith('-') ? 'text-danger' : 'text-success'}`}>
                <div style={{ background: item.percentChange.startsWith('-') ? 'var(--danger-bg)' : 'var(--success-bg)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                  {item.percentChange}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="btn text-accent w-full justify-start" style={{ padding: 0, fontSize: '0.85rem' }}>
        View all watchlist <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default WatchlistWidget;

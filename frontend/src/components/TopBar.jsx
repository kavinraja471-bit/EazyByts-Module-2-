import React, { useState, useEffect } from 'react';
import { Search, Moon, Bell } from 'lucide-react';
import axios from 'axios';
import './TopBar.css';

const TopBar = () => {
  const [topStocks, setTopStocks] = useState([]);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stocks');
        setTopStocks(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching top stocks", err);
      }
    };
    fetchTopStocks();
    const interval = setInterval(fetchTopStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-stats">
        {topStocks.map((stock, idx) => (
          <div key={idx} className="stat-item">
            <span className="stat-label">{stock.symbol}</span>
            <div className="stat-values">
              <span className="font-bold">${stock.price.toFixed(2)}</span>
              <span className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {stock.percentChange}
              </span>
            </div>
            <svg className={`mini-chart ${stock.change >= 0 ? 'success' : 'danger'}`} viewBox="0 0 50 20">
              {stock.change >= 0 ? (
                <polyline points="0,20 10,15 20,18 30,5 40,10 50,0" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              ) : (
                <polyline points="0,0 10,10 20,5 30,15 40,10 50,20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              )}
            </svg>
          </div>
        ))}
        {topStocks.length === 0 && <span className="text-muted text-sm">Loading market data...</span>}
      </div>
      
      <div className="topbar-actions">
        <div className="search-bar">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search stocks, ETFs, indices..." />
        </div>
        
        <button className="icon-btn">
          <Moon size={18} />
        </button>
        
        <button className="icon-btn relative">
          <Bell size={18} />
          <span className="badge-dot">3</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;

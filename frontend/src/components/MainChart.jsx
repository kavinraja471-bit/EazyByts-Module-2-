import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { ChevronDown, MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const MainChart = () => {
  const [activeFilter, setActiveFilter] = useState('1M');
  const filters = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];
  
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stocks/AAPL');
        setStockData(res.data);
      } catch (err) {
        console.error("Error fetching stock history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStockHistory();
  }, []);

  if (loading || !stockData) {
    return <div className="panel h-full flex items-center justify-center text-muted">Loading chart data...</div>;
  }

  const isPositive = stockData.change >= 0;

  const chartData = {
    labels: stockData.history.map(h => h.date),
    datasets: [{
      data: stockData.history.map(h => h.price),
      borderColor: isPositive ? '#10b981' : '#ef4444',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.1,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { display: false },
      y: { position: 'right', grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  return (
    <div className="panel">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{stockData.name} ({stockData.symbol})</h2>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>${stockData.price.toFixed(2)}</span>
            <span className={`font-bold flex items-center ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />} 
              ${Math.abs(stockData.change).toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="btn btn-outline text-sm">{stockData.exchange} <ChevronDown size={14}/></button>
          <button className="btn btn-outline px-2"><MoreVertical size={16}/></button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-4 border-b border-gray-800 pb-2">
        {filters.map(f => (
          <button 
            key={f} 
            className={`btn px-2 py-1 text-sm ${activeFilter === f ? 'text-accent border-b-2 border-accent rounded-none' : 'text-muted'}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MainChart;

import React, { useEffect, useState } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { generateChartData } from '../data/mockData'; // Keeping this for the visual sparkline

const PortfolioSummary = () => {
  const { token, user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/portfolio', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio", err);
      }
    };
    if (token) fetchPortfolio();
  }, [token, user]); // Refetch when user balance updates

  const chartData = {
    labels: Array.from({length: 20}, (_, i) => i),
    datasets: [{
      data: generateChartData().slice(0, 20),
      borderColor: '#8b5cf6',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  return (
    <div className="panel flex-1">
      <div className="panel-title">
        <div className="flex items-center gap-2">
          My Portfolio <Eye size={16} className="text-muted" />
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-muted text-sm mb-1">Available Cash Balance</p>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          ${user?.balance !== undefined ? user.balance.toFixed(2) : '0.00'}
        </h2>
        <p className="text-sm">
          <span className="text-muted">Holdings Value</span>{' '}
          <span className="font-bold text-accent">
            ${portfolio?.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0).toFixed(2) || '0.00'}
          </span>
        </p>
      </div>
      
      <div style={{ height: '100px', width: '100%', marginBottom: '24px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-800 text-center">
        <div>
          <p className="text-muted text-xs mb-1">Holdings</p>
          <p className="font-bold text-lg">{portfolio?.length || 0}</p>
        </div>
        <div>
          <p className="text-muted text-xs mb-1">Total Equities</p>
          <p className="font-bold text-lg">
            {portfolio?.reduce((acc, curr) => acc + curr.quantity, 0) || 0}
          </p>
        </div>
      </div>
      
      <button className="btn text-accent w-full justify-start" style={{ padding: 0, fontSize: '0.85rem' }}>
        View portfolio details <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default PortfolioSummary;

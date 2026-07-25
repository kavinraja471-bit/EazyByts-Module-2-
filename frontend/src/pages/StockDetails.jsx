import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import './StockDetails.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { token, updateBalance, user } = useAuth();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
        setStock(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStockDetail();
  }, [symbol]);

  const handleTrade = async (type) => {
    setActionError('');
    setActionSuccess('');
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      setActionError('Please enter a valid quantity.');
      return;
    }

    try {
      const endpoint = type === 'BUY' ? '/api/portfolio/buy' : '/api/portfolio/sell';
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        symbol: stock.symbol,
        quantity: Number(quantity),
        price: stock.price
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      updateBalance(res.data.balance);
      setActionSuccess(`Successfully ${type === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${stock.symbol}.`);
      setQuantity('');
    } catch (err) {
      setActionError(err.response?.data?.msg || 'Transaction failed');
    }
  };

  if (loading) return <div>Loading stock data...</div>;
  if (!stock) return <div>Stock not found.</div>;

  const chartData = {
    labels: stock.history.map(h => h.date).reverse(),
    datasets: [
      {
        label: `${stock.symbol} Price`,
        data: stock.history.map(h => h.price).reverse(),
        borderColor: stock.change >= 0 ? '#10b981' : '#ef4444',
        backgroundColor: stock.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false, color: 'rgba(255,255,255,0.05)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="stock-details animate-fade-in">
      <button className="btn btn-icon back-btn mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card">
          <div className="stock-header mb-4">
            <div>
              <h2 style={{ fontSize: '2rem' }}>{stock.symbol}</h2>
              <p className="text-muted">{stock.name}</p>
            </div>
            <div className="text-right">
              <h2 style={{ fontSize: '2.5rem' }}>${stock.price.toFixed(2)}</h2>
              <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'} justify-center`}>
                {stock.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="chart-container" style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card trading-panel">
          <h3>Trade {stock.symbol}</h3>
          <div className="balance-info mb-4">
            <span className="text-muted">Available Balance</span>
            <h4>${user.balance.toFixed(2)}</h4>
          </div>
          
          {actionError && <div className="alert alert-danger">{actionError}</div>}
          {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

          <div className="trade-form">
            <label>Quantity (Shares)</label>
            <input 
              type="number" 
              className="input-field mb-4" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              min="1"
            />
            
            <div className="trade-summary mb-4">
              <span className="text-muted">Estimated Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                ${quantity ? (Number(quantity) * stock.price).toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="flex gap-4">
              <button className="btn btn-success w-full flex items-center justify-center gap-2" onClick={() => handleTrade('BUY')}>
                <DollarSign size={18} /> Buy
              </button>
              <button className="btn btn-danger w-full flex items-center justify-center gap-2" onClick={() => handleTrade('SELL')}>
                <DollarSign size={18} /> Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;

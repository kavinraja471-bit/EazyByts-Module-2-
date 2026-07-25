import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

const TradeWidget = () => {
  const { token, updateBalance } = useAuth();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('buy');
  const [message, setMessage] = useState('');

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/portfolio/trade',
        { symbol: symbol.toUpperCase(), quantity: Number(quantity), type },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(`Successfully ${type === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${symbol.toUpperCase()}`);
      updateBalance(res.data.balance);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Trade failed');
    }
  };

  return (
    <div className="panel">
      <div className="panel-title">
        <div className="flex items-center gap-2">
          Trade Stocks <ShoppingCart size={16} className="text-muted" />
        </div>
      </div>
      
      {message && <div className={`text-sm p-2 mb-4 rounded ${message.includes('failed') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{message}</div>}

      <form onSubmit={handleTrade} className="flex-col gap-4">
        <div className="flex gap-2">
          <button 
            type="button" 
            className={`btn w-1/2 py-2 text-sm ${type === 'buy' ? 'bg-success text-white' : 'btn-outline'}`}
            onClick={() => setType('buy')}
          >
            Buy
          </button>
          <button 
            type="button" 
            className={`btn w-1/2 py-2 text-sm ${type === 'sell' ? 'bg-danger text-white' : 'btn-outline'}`}
            onClick={() => setType('sell')}
          >
            Sell
          </button>
        </div>

        <input 
          type="text" 
          placeholder="Symbol (e.g. AAPL)" 
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full bg-[#111827] border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-[#6366f1] text-sm"
          required
        />
        
        <input 
          type="number" 
          min="1"
          placeholder="Quantity" 
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full bg-[#111827] border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-[#6366f1] text-sm"
          required
        />
        
        <button type="submit" className="btn btn-primary w-full py-2 text-sm">
          Execute Trade
        </button>
      </form>
    </div>
  );
};

export default TradeWidget;

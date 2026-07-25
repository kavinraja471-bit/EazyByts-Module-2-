import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { topGainers, topLosers } from '../data/mockData';

const TopMovers = () => {
  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      {/* Gainers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-success" size={20} />
          <h3 style={{ fontSize: '1.1rem' }}>Top Gainers</h3>
        </div>
        <div className="flex-col gap-4">
          {topGainers.map((stock, idx) => (
            <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-800">
              <div className="w-1/3">
                <span className="font-bold">{stock.symbol}</span>
                <span className="text-muted text-xs ml-2">{stock.exchange}</span>
              </div>
              <div className="w-1/3 text-center">{stock.price}</div>
              <div className="w-1/3 text-right text-success flex justify-end gap-3">
                <span>{stock.change}</span>
                <span>{stock.percentChange}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Losers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-danger" size={20} />
          <h3 style={{ fontSize: '1.1rem' }}>Top Losers</h3>
        </div>
        <div className="flex-col gap-4">
          {topLosers.map((stock, idx) => (
            <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-800">
              <div className="w-1/3">
                <span className="font-bold">{stock.symbol}</span>
                <span className="text-muted text-xs ml-2">{stock.exchange}</span>
              </div>
              <div className="w-1/3 text-center">{stock.price}</div>
              <div className="w-1/3 text-right text-danger flex justify-end gap-3">
                <span>{stock.change}</span>
                <span>{stock.percentChange}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;

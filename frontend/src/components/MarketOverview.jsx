import React from 'react';
import { marketOverview } from '../data/mockData';

const MarketOverview = () => {
  const total = marketOverview.advances + marketOverview.declines;
  const advancePercent = (marketOverview.advances / total) * 100;

  return (
    <div className="panel">
      <div className="panel-title">Market Overview</div>
      
      <div className="mb-6">
        <p className="text-muted text-sm mb-2">Market Breadth</p>
        <div style={{ height: '6px', width: '100%', background: 'var(--danger)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }} className="mb-2">
          <div style={{ width: `${advancePercent}%`, background: 'var(--success)' }}></div>
        </div>
        <div className="flex justify-between">
          <div><span className="font-bold text-success">{marketOverview.advances}</span> <span className="text-muted text-xs">Advances</span></div>
          <div><span className="font-bold text-danger">{marketOverview.declines}</span> <span className="text-muted text-xs">Declines</span></div>
        </div>
      </div>
      
      <div className="flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-800">
          <span className="text-muted text-sm">New 52W High</span>
          <span className="font-bold text-success">{marketOverview.new52WHigh}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-800 pt-3">
          <span className="text-muted text-sm">New 52W Low</span>
          <span className="font-bold text-danger">{marketOverview.new52WLow}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-800 pt-3">
          <span className="text-muted text-sm">Total Volume</span>
          <span className="font-bold">{marketOverview.totalVolume}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-800 pt-3">
          <span className="text-muted text-sm">Total Value</span>
          <span className="font-bold">{marketOverview.totalValue}</span>
        </div>
        <div className="flex justify-between items-center pt-3">
          <span className="text-muted text-sm">VIX</span>
          <div className="flex gap-2">
            <span className="font-bold">{marketOverview.vix.value}</span>
            <span className="text-danger text-sm">{marketOverview.vix.change}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;

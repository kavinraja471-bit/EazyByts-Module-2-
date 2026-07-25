import React from 'react';
import MainChart from '../components/MainChart';
import MarketOverview from '../components/MarketOverview';
import SectorPerformance from '../components/SectorPerformance';
import NewsWidget from '../components/NewsWidget';
import WatchlistWidget from '../components/WatchlistWidget';
import PortfolioSummary from '../components/PortfolioSummary';
import TopMovers from '../components/TopMovers';
import TradeWidget from '../components/TradeWidget';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* Left Column - Main Content */}
      <div className="flex-col gap-6">
        <MainChart />
        
        <div className="grid grid-cols-3 gap-6">
          <MarketOverview />
          <SectorPerformance />
          <NewsWidget />
        </div>
        
        <TopMovers />
      </div>
      
      {/* Right Column - Side Widgets */}
      <div className="flex-col gap-6">
        <WatchlistWidget />
        <TradeWidget />
        <PortfolioSummary />
      </div>
    </div>
  );
};

export default DashboardLayout;

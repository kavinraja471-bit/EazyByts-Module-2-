import React from 'react';
import MarketChart from '../components/charts/MarketChart';
import MarketOverviewCard from '../components/ui/MarketOverviewCard';
import SectorHeatmap from '../components/ui/SectorHeatmap';
import GainersLosers from '../components/ui/GainersLosers';
import WatchlistCard from '../components/ui/WatchlistCard';
import NewsCard from '../components/ui/NewsCard';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Briefcase, DollarSign } from 'lucide-react';
import { STOCKS } from '../data/mockData';

const StatCard = ({ title, value, change, positive, icon: Icon, color }) => (
  <div className="rounded-xl border border-white/5 p-4 flex items-center gap-4" style={{ background: '#111827' }}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-xs">{title}</p>
      <p className="text-white font-bold text-lg leading-tight">{value}</p>
      {change && <p className={`text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>{change}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { holdings, livePrices } = useApp();
  const navigate = useNavigate();

  const totalValue = holdings.reduce((acc, h) => {
    const live = livePrices[h.symbol]?.price || (STOCKS.find(s => s.symbol === h.symbol)?.price || h.avgPrice);
    return acc + live * h.quantity;
  }, 0);

  const totalCost = holdings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Portfolio Value" value={`$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} change={`${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)} (${totalPnLPct.toFixed(2)}%)`} positive={totalPnL >= 0} icon={Briefcase} color="bg-indigo-500/20" />
        <StatCard title="Today's P&L" value={`${totalPnL >= 0 ? '+' : ''}$${(totalPnL * 0.12).toFixed(2)}`} change={`${totalPnLPct >= 0 ? '+' : ''}${(totalPnLPct * 0.1).toFixed(2)}% today`} positive={totalPnL >= 0} icon={DollarSign} color="bg-emerald-500/20" />
        <StatCard title="Holdings" value={holdings.length} change="Tap to manage" icon={TrendingUp} color="bg-violet-500/20" />
        <StatCard title="Total Cost" value={`$${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} icon={TrendingDown} color="bg-amber-500/20" />
      </div>

      {/* Main Chart + Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MarketChart />
        </div>
        <div className="flex flex-col gap-4">
          <WatchlistCard />
        </div>
      </div>

      {/* Middle Row: Market Overview + Sector Heatmap + News */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MarketOverviewCard />
        <SectorHeatmap />
        <NewsCard limit={3} />
      </div>

      {/* Bottom: Gainers & Losers */}
      <GainersLosers />
    </div>
  );
};

export default Dashboard;

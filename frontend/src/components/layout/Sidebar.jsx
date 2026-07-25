import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Star, Briefcase, Globe, SlidersHorizontal,
  Newspaper, Bell, CalendarDays, BarChart3, Settings,
  TrendingUp, Gem, ChevronRight, LogOut, User, CreditCard, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import PremiumModal from '../modals/PremiumModal';
import ProfileDropdown from '../ui/ProfileDropdown';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Star, label: 'Watchlist', path: '/watchlist' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: Globe, label: 'Markets', path: '/markets' },
  { icon: SlidersHorizontal, label: 'Screener', path: '/screener' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ open, setOpen }) => {
  const { user } = useApp();
  const { logout } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`
        fixed lg:relative z-30 h-full flex flex-col
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-0 lg:w-16'} 
        overflow-hidden
        border-r border-white/5
      `} style={{ background: '#0a0e17', minWidth: open ? '256px' : undefined }}>
        
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-indigo-400" />
          </div>
          {open && (
            <div>
              <h1 className="text-white font-bold text-sm leading-none">StockMarket</h1>
              <p className="text-slate-500 text-[10px] tracking-widest uppercase mt-0.5">Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group relative
                ${isActive
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-400 rounded-r-full" />}
                  <Icon size={18} className="flex-shrink-0" />
                  {open && <span className="truncate">{label}</span>}
                  {!open && (
                    <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Premium Card */}
        {open && (
          <div className="mx-3 mb-4 p-4 rounded-xl border border-indigo-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))' }}>
            <div className="flex items-center gap-2 mb-2">
              <Gem size={16} className="text-violet-400" />
              <span className="text-white text-xs font-semibold">Go Premium</span>
            </div>
            <p className="text-slate-400 text-xs mb-3 leading-relaxed">Unlock advanced charts, unlimited watchlist & alerts.</p>
            <button
              onClick={() => setShowPremium(true)}
              className="w-full py-2 text-xs font-semibold text-white rounded-lg transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="border-t border-white/5 p-3 relative">
          <button
            onClick={() => setShowProfile(prev => !prev)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-xs flex-shrink-0">
              {user?.avatar || 'KR'}
            </div>
            {open && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-xs font-medium truncate">{user?.name || 'User'}</p>
                  <p className="text-slate-500 text-[10px]">{user?.plan || 'Free'} Plan</p>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </>
            )}
          </button>
          {showProfile && (
            <ProfileDropdown onClose={() => setShowProfile(false)} onLogout={handleLogout} onUpgrade={() => { setShowProfile(false); setShowPremium(true); }} />
          )}
        </div>
      </aside>

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </>
  );
};

export default Sidebar;

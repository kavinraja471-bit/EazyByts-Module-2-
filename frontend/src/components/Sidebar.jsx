import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Star, Briefcase, Globe, Filter, 
  FileText, Bell, Calendar, BarChart2, Settings, Gem,
  LineChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Star size={20} />, label: 'Watchlist', path: '/watchlist' },
    { icon: <Briefcase size={20} />, label: 'Portfolio', path: '/portfolio' },
    { icon: <Globe size={20} />, label: 'Markets', path: '/markets' },
    { icon: <Filter size={20} />, label: 'Screener', path: '/screener' },
    { icon: <FileText size={20} />, label: 'News', path: '/news' },
    { icon: <Bell size={20} />, label: 'Alerts', path: '/alerts' },
    { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
    { icon: <BarChart2 size={20} />, label: 'Reports', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <LineChart color="#10b981" size={28} />
        <div>
          <h2>StockMarket</h2>
          <span>DASHBOARD</span>
        </div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path} 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-bottom">
        <div className="premium-card">
          <Gem size={24} color="#8b5cf6" className="mb-2" />
          <h4>Go Premium</h4>
          <p>Unlock advanced charts, insights and more.</p>
          <button className="btn btn-primary w-full mt-4">Upgrade Now</button>
        </div>
        
        <div className="user-profile" onClick={logout}>
          <div className="avatar">{user?.username?.substring(0, 2).toUpperCase() || 'U'}</div>
          <div className="user-info">
            <h4>{user?.username || 'User'}</h4>
            <span className="text-red-400 hover:text-red-300">Log out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

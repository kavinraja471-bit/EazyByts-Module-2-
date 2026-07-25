import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import TopMarketTicker from './components/layout/TopMarketTicker';
import Dashboard from './pages/Dashboard';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioPage from './pages/PortfolioPage';
import MarketsPage from './pages/MarketsPage';
import ScreenerPage from './pages/ScreenerPage';
import NewsPage from './pages/NewsPage';
import AlertsPage from './pages/AlertsPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import StockDetailPage from './pages/StockDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#0a0e17]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0e17' }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopMarketTicker onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
            <Route path="/watchlist" element={<PrivateRoute><AppLayout><WatchlistPage /></AppLayout></PrivateRoute>} />
            <Route path="/portfolio" element={<PrivateRoute><AppLayout><PortfolioPage /></AppLayout></PrivateRoute>} />
            <Route path="/markets" element={<PrivateRoute><AppLayout><MarketsPage /></AppLayout></PrivateRoute>} />
            <Route path="/screener" element={<PrivateRoute><AppLayout><ScreenerPage /></AppLayout></PrivateRoute>} />
            <Route path="/news" element={<PrivateRoute><AppLayout><NewsPage /></AppLayout></PrivateRoute>} />
            <Route path="/alerts" element={<PrivateRoute><AppLayout><AlertsPage /></AppLayout></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><AppLayout><CalendarPage /></AppLayout></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><AppLayout><ReportsPage /></AppLayout></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><AppLayout><SettingsPage /></AppLayout></PrivateRoute>} />
            <Route path="/stock/:symbol" element={<PrivateRoute><AppLayout><StockDetailPage /></AppLayout></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

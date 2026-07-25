import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STOCKS, INDICES } from '../data/mockData';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Watchlist
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || ['AAPL','NVDA','RELIANCE','TCS','HDFCBANK']; }
    catch { return ['AAPL','NVDA','RELIANCE','TCS','HDFCBANK']; }
  });

  // Portfolio Holdings
  const [holdings, setHoldings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('holdings')) || [
      { id: 1, symbol: 'AAPL', quantity: 10, avgPrice: 175.00 },
      { id: 2, symbol: 'NVDA', quantity: 5, avgPrice: 820.00 },
      { id: 3, symbol: 'RELIANCE', quantity: 20, avgPrice: 2800.00 },
    ]; }
    catch { return []; }
  });

  // Alerts
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alerts')) || [
      { id: 1, symbol: 'NVDA', condition: 'above', price: 900, active: true, triggered: false },
      { id: 2, symbol: 'TSLA', condition: 'below', price: 240, active: true, triggered: false },
    ]; }
    catch { return []; }
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('notifications')) || [
      { id: 1, title: 'NVDA Alert Triggered', message: 'NVDA crossed above $875', time: '2m ago', read: false, type: 'alert' },
      { id: 2, title: 'Market Update', message: 'NIFTY 50 up 0.85% today', time: '1h ago', read: false, type: 'market' },
      { id: 3, title: 'Portfolio Update', message: 'Your portfolio is up ₹3,245 today', time: '3h ago', read: true, type: 'portfolio' },
    ]; }
    catch { return []; }
  });

  // Live prices (auto-fluctuate)
  const [livePrices, setLivePrices] = useState(() => {
    const init = {};
    STOCKS.forEach(s => { init[s.symbol] = { price: s.price, change: s.change }; });
    return init;
  });

  // Indices
  const [liveIndices, setLiveIndices] = useState(INDICES);

  // Settings
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('settings')) || {
      theme: 'dark', currency: 'USD', refreshInterval: 10, notifications: true, emailAlerts: false
    }; }
    catch { return { theme: 'dark', currency: 'USD', refreshInterval: 10, notifications: true, emailAlerts: false }; }
  });

  // User (synced from AuthContext via parent - AppContext provides app-level prefs only)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('demoUser')) || { name: 'Kavin Raja', email: 'demo@stockdashboard.com', plan: 'Pro', avatar: 'KR' }; }
    catch { return { name: 'Kavin Raja', email: 'demo@stockdashboard.com', plan: 'Pro', avatar: 'KR' }; }
  });

  // Auto-fluctuate prices
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const updated = { ...prev };
        STOCKS.forEach(s => {
          const fluctuation = (Math.random() - 0.48) * s.price * 0.003;
          const newPrice = Math.max(1, prev[s.symbol].price + fluctuation);
          const newChange = prev[s.symbol].change + fluctuation;
          updated[s.symbol] = { price: parseFloat(newPrice.toFixed(2)), change: parseFloat(newChange.toFixed(2)) };
        });
        return updated;
      });

      setLiveIndices(prev => {
        const updated = { ...prev };
        Object.keys(prev).forEach(key => {
          const fl = (Math.random() - 0.48) * prev[key].value * 0.001;
          updated[key] = { ...prev[key], value: parseFloat((prev[key].value + fl).toFixed(2)), change: parseFloat((prev[key].change + fl).toFixed(2)) };
        });
        return updated;
      });
    }, (settings.refreshInterval || 10) * 1000);
    return () => clearInterval(interval);
  }, [settings.refreshInterval]);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('holdings', JSON.stringify(holdings)); }, [holdings]);
  useEffect(() => { localStorage.setItem('alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('demoUser', JSON.stringify(user)); }, [user]);

  // Watchlist actions
  const addToWatchlist = useCallback((symbol) => {
    if (!watchlist.includes(symbol)) setWatchlist(prev => [...prev, symbol]);
  }, [watchlist]);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  }, []);

  // Portfolio actions
  const addHolding = useCallback((holding) => {
    setHoldings(prev => [...prev, { ...holding, id: Date.now() }]);
  }, []);

  const editHolding = useCallback((id, updated) => {
    setHoldings(prev => prev.map(h => h.id === id ? { ...h, ...updated } : h));
  }, []);

  const deleteHolding = useCallback((id) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  }, []);

  // Alert actions
  const addAlert = useCallback((alert) => {
    setAlerts(prev => [...prev, { ...alert, id: Date.now(), triggered: false }]);
  }, []);

  const editAlert = useCallback((id, updated) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  }, []);

  const deleteAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  // Notification actions
  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ ...notif, id: Date.now(), time: 'Just now', read: false }, ...prev]);
  }, []);

  // Helper to get stock data with live price
  const getStock = useCallback((symbol) => {
    const base = STOCKS.find(s => s.symbol === symbol);
    if (!base) return null;
    const live = livePrices[symbol];
    return { ...base, ...live, pChange: ((live?.change || 0) / base.price * 100).toFixed(2) };
  }, [livePrices]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      watchlist, addToWatchlist, removeFromWatchlist,
      holdings, addHolding, editHolding, deleteHolding,
      alerts, addAlert, editAlert, deleteAlert,
      notifications, markRead, markAllRead, deleteNotification, addNotification, unreadCount,
      livePrices, liveIndices,
      settings, setSettings,
      user, setUser,
      getStock,
      STOCKS
    }}>
      {children}
    </AppContext.Provider>
  );
};

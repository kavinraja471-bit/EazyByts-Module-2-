// ========================================================
// CENTRALIZED MOCK DATA - All realistic stock market data
// Replace with real API calls by updating the service files
// ========================================================

export const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 189.30, change: 1.85, mktCap: 2980, pe: 29.4, volume: 58200000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', sector: 'Technology', price: 415.50, change: 2.30, mktCap: 3090, pe: 35.2, volume: 22100000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 178.65, change: -0.95, mktCap: 2190, pe: 24.8, volume: 25400000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', price: 195.80, change: 1.42, mktCap: 2050, pe: 44.1, volume: 42300000 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', sector: 'Technology', price: 875.40, change: 15.20, mktCap: 2160, pe: 68.3, volume: 41800000 },
  { symbol: 'META', name: 'Meta Platforms', exchange: 'NASDAQ', sector: 'Technology', price: 498.10, change: -2.80, mktCap: 1270, pe: 27.9, volume: 18600000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', price: 248.50, change: -4.20, mktCap: 791, pe: 58.2, volume: 98700000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', sector: 'Communication', price: 628.90, change: 8.70, mktCap: 272, pe: 42.6, volume: 5100000 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', exchange: 'NASDAQ', sector: 'Technology', price: 162.30, change: 3.15, mktCap: 262, pe: 45.8, volume: 47200000 },
  { symbol: 'INTC', name: 'Intel Corp.', exchange: 'NASDAQ', sector: 'Technology', price: 30.45, change: -0.85, mktCap: 129, pe: 18.2, volume: 62800000 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', sector: 'Energy', price: 2985.60, change: 24.35, mktCap: 2020, pe: 28.4, volume: 8200000 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', sector: 'Technology', price: 3987.45, change: -12.40, mktCap: 1450, pe: 31.2, volume: 1800000 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE', sector: 'Financial', price: 1678.90, change: 18.60, mktCap: 1270, pe: 20.8, volume: 9600000 },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE', sector: 'Technology', price: 1512.35, change: -5.65, mktCap: 627, pe: 25.4, volume: 7400000 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE', sector: 'Financial', price: 1197.80, change: 10.25, mktCap: 842, pe: 18.6, volume: 12500000 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', exchange: 'NSE', sector: 'Technology', price: 502.35, change: 8.50, mktCap: 262, pe: 22.1, volume: 14200000 },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Financial', price: 798.40, change: 5.85, mktCap: 712, pe: 10.2, volume: 18900000 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', exchange: 'NSE', sector: 'Financial', price: 7124.60, change: -85.20, mktCap: 431, pe: 32.8, volume: 2100000 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', exchange: 'NSE', sector: 'Consumer', price: 2398.75, change: 12.40, mktCap: 563, pe: 55.2, volume: 3400000 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', exchange: 'NSE', sector: 'Consumer Cyclical', price: 987.25, change: 28.15, mktCap: 364, pe: 12.4, volume: 22600000 },
];

export const INDICES = {
  NIFTY50: { name: 'NIFTY 50', value: 24854.05, change: 210.15, pChange: 0.85, open: 24680.10, high: 24924.50, low: 24560.35, prevClose: 24643.90, high52w: 26277.35, low52w: 18837.85 },
  SENSEX: { name: 'SENSEX', value: 81223.10, change: 560.30, pChange: 0.72, open: 80820.40, high: 81450.20, low: 80620.15, prevClose: 80662.80, high52w: 85978.25, low52w: 64148.56 },
  BANKNIFTY: { name: 'BANK NIFTY', value: 51126.20, change: 580.40, pChange: 1.15, open: 50780.30, high: 51240.80, low: 50620.50, prevClose: 50545.80, high52w: 53674.25, low52w: 43574.30 },
  USDINR: { name: 'USD/INR', value: 83.42, change: -0.10, pChange: -0.12, open: 83.52, high: 83.60, low: 83.35, prevClose: 83.52, high52w: 84.95, low52w: 82.70 }
};

export const SECTORS = [
  { name: 'NIFTY IT', change: 1.35, stocks: ['TCS','INFY','WIPRO','HCLTECH','TECHM'] },
  { name: 'NIFTY BANK', change: 1.15, stocks: ['HDFCBANK','ICICIBANK','SBIN','AXISBANK','KOTAKBANK'] },
  { name: 'NIFTY AUTO', change: 0.89, stocks: ['TATAMOTORS','MARUTI','BAJAJ-AUTO','HEROMOTOCO','EICHERMOT'] },
  { name: 'NIFTY FMCG', change: 0.62, stocks: ['HINDUNILVR','ITC','NESTLEIND','BRITANNIA','DABUR'] },
  { name: 'NIFTY FIN SERVICE', change: 0.45, stocks: ['BAJFINANCE','BAJAJFINSV','HDFCLIFE','SBILIFE','ICICIPRULI'] },
  { name: 'NIFTY PHARMA', change: -0.12, stocks: ['SUNPHARMA','DRREDDY','CIPLA','DIVISLAB','BIOCON'] },
  { name: 'NIFTY METAL', change: -0.35, stocks: ['TATASTEEL','JSWSTEEL','HINDALCO','NMDC','VEDL'] },
  { name: 'NIFTY REALTY', change: -0.68, stocks: ['DLF','GODREJPROP','OBEROIRLTY','LODHA','PRESTIGE'] },
  { name: 'NIFTY ENERGY', change: -1.02, stocks: ['RELIANCE','ONGC','NTPC','POWERGRID','GAIL'] }
];

export const NEWS = [
  { id: 1, title: 'Markets rally for 5th straight session; Nifty closes above 24,800', source: 'Economic Times', time: '1h ago', category: 'Markets', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 2, title: 'FIIs net buyers for third consecutive day, invest ₹2,350 Cr', source: 'Moneycontrol', time: '3h ago', category: 'Markets', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 3, title: 'HDFC Bank Q4 Results: Net profit up 18% YoY, beats estimates', source: 'CNBC TV18', time: '5h ago', category: 'Companies', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 4, title: 'RBI keeps repo rate unchanged at 6.5% in latest MPC meeting', source: 'Mint', time: '8h ago', category: 'Economy', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 5, title: 'NVIDIA hits new all-time high as AI chip demand surges globally', source: 'Reuters', time: '12h ago', category: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 6, title: 'Gold prices slip as dollar strengthens; silver follows suit', source: 'Bloomberg', time: '1d ago', category: 'Stocks', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 7, title: 'Tesla reports record deliveries for Q2 2026, stock jumps 8%', source: 'Financial Times', time: '1d ago', category: 'Companies', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200', url: '#' },
  { id: 8, title: 'US inflation data shows signs of cooling, markets react positively', source: 'The Hindu BusinessLine', time: '2d ago', category: 'Economy', image: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&q=80&w=200', url: '#' },
];

export const CALENDAR_EVENTS = [
  { id: 1, date: '2026-07-22', title: 'TCS Q1 Results', type: 'earnings', impact: 'High', symbol: 'TCS' },
  { id: 2, date: '2026-07-22', title: 'Infosys Q1 Results', type: 'earnings', impact: 'High', symbol: 'INFY' },
  { id: 3, date: '2026-07-24', title: 'RBI MPC Meeting', type: 'central_bank', impact: 'High' },
  { id: 4, date: '2026-07-25', title: 'HDFC Bank Q1 Results', type: 'earnings', impact: 'High', symbol: 'HDFCBANK' },
  { id: 5, date: '2026-07-28', title: 'US Fed Interest Rate Decision', type: 'central_bank', impact: 'High' },
  { id: 6, date: '2026-07-29', title: 'Reliance Industries Dividend', type: 'dividend', impact: 'Medium', symbol: 'RELIANCE' },
  { id: 7, date: '2026-08-01', title: 'India GDP Q1 Data', type: 'economic', impact: 'High' },
  { id: 8, date: '2026-08-05', title: 'Apple Q3 Earnings', type: 'earnings', impact: 'High', symbol: 'AAPL' },
  { id: 9, date: '2026-08-07', title: 'Wipro Q1 Results', type: 'earnings', impact: 'Medium', symbol: 'WIPRO' },
  { id: 10, date: '2026-08-10', title: 'US CPI Inflation Report', type: 'economic', impact: 'High' },
  { id: 11, date: '2026-08-15', title: 'India Independence Day - Market Holiday', type: 'holiday', impact: 'Low' },
  { id: 12, date: '2026-08-20', title: 'NVIDIA Q2 Earnings', type: 'earnings', impact: 'High', symbol: 'NVDA' },
];

export const MARKET_OVERVIEW = {
  advances: 1642, declines: 152, unchanged: 48,
  new52WHigh: 126, new52WLow: 18,
  totalVolume: '2.35B', totalValue: '18,432 Cr',
  vix: { value: 14.23, change: -2.15 }
};

export const generateHistory = (basePrice, days = 100, trend = 0.3) => {
  const data = [];
  let price = basePrice * 0.82;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const fluctuation = (Math.random() - (0.5 - trend * 0.1)) * price * 0.015;
    price = Math.max(1, price + fluctuation);
    data.push({ date: d.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
  }
  return data;
};

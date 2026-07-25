const express = require('express');
const router = express.Router();

// 10 prominent companies mock data
const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', price: 175.50, change: 1.25 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', price: 335.20, change: 2.10 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', price: 135.40, change: -0.50 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', price: 138.60, change: 1.80 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', price: 450.25, change: 12.30 },
    { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', price: 300.10, change: -1.20 },
    { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', price: 245.80, change: -3.40 },
    { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', price: 405.60, change: 5.20 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', exchange: 'NASDAQ', price: 105.75, change: 0.85 },
    { symbol: 'INTC', name: 'Intel Corp.', exchange: 'NASDAQ', price: 35.40, change: -0.25 }
];

// @route   GET api/stocks
// @desc    Get all mock stocks (market overview)
// @access  Public
router.get('/', (req, res) => {
    // Add some random fluctuation to make it feel "live"
    const liveStocks = mockStocks.map(stock => {
        const fluctuation = (Math.random() - 0.5) * 2; 
        const newPrice = Math.max(1, stock.price + fluctuation);
        const percentChange = ((fluctuation + stock.change) / stock.price) * 100;
        
        return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat((fluctuation + stock.change).toFixed(2)),
            percentChange: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`
        };
    });
    res.json(liveStocks);
});

// @route   GET api/stocks/:symbol
// @desc    Get mock stock history for charts
// @access  Public
router.get('/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const stock = mockStocks.find(s => s.symbol === symbol);
    
    if (!stock) {
        return res.status(404).json({ msg: 'Stock not found' });
    }

    // Generate mock history data (last 100 days to look good on chart)
    const history = [];
    let currentPrice = stock.price * 0.8; // start 20% lower
    const now = new Date();
    
    for (let i = 100; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const fluctuation = (Math.random() - 0.45) * (currentPrice * 0.02); 
        currentPrice = Math.max(1, currentPrice + fluctuation);
        
        history.push({
            date: date.toISOString().split('T')[0],
            price: parseFloat(currentPrice.toFixed(2))
        });
    }
    
    res.json({
        ...stock,
        price: history[history.length - 1].price,
        history
    });
});

module.exports = router;

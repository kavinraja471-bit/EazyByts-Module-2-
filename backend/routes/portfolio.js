const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

// @route   GET api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user.id });
        res.json(portfolio);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/portfolio/buy
// @desc    Buy stock
// @access  Private
router.post('/buy', auth, async (req, res) => {
    const { symbol, quantity, price } = req.body;
    
    try {
        let user = await User.findById(req.user.id);
        const totalCost = quantity * price;
        
        if (user.balance < totalCost) {
            return res.status(400).json({ msg: 'Insufficient balance' });
        }
        
        user.balance -= totalCost;
        await user.save();
        
        let portfolioItem = await Portfolio.findOne({ user: req.user.id, symbol });
        if (portfolioItem) {
            const newTotalQty = portfolioItem.quantity + quantity;
            const newTotalCost = (portfolioItem.quantity * portfolioItem.averagePrice) + totalCost;
            portfolioItem.averagePrice = newTotalCost / newTotalQty;
            portfolioItem.quantity = newTotalQty;
            await portfolioItem.save();
        } else {
            portfolioItem = new Portfolio({
                user: req.user.id,
                symbol,
                quantity,
                averagePrice: price
            });
            await portfolioItem.save();
        }
        
        const transaction = new Transaction({
            user: req.user.id,
            symbol,
            type: 'BUY',
            quantity,
            price
        });
        await transaction.save();
        
        res.json({ balance: user.balance, portfolioItem, transaction });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/portfolio/sell
// @desc    Sell stock
// @access  Private
router.post('/sell', auth, async (req, res) => {
    const { symbol, quantity, price } = req.body;
    
    try {
        let portfolioItem = await Portfolio.findOne({ user: req.user.id, symbol });
        
        if (!portfolioItem || portfolioItem.quantity < quantity) {
            return res.status(400).json({ msg: 'Insufficient stock quantity' });
        }
        
        let user = await User.findById(req.user.id);
        const totalRevenue = quantity * price;
        
        user.balance += totalRevenue;
        await user.save();
        
        portfolioItem.quantity -= quantity;
        if (portfolioItem.quantity === 0) {
            await Portfolio.findOneAndDelete({ _id: portfolioItem._id });
        } else {
            await portfolioItem.save();
        }
        
        const transaction = new Transaction({
            user: req.user.id,
            symbol,
            type: 'SELL',
            quantity,
            price
        });
        await transaction.save();
        
        res.json({ balance: user.balance, portfolioItem, transaction });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/portfolio/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

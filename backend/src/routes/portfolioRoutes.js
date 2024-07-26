const express = require('express');
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth'); // create this middleware

const router = express.Router();

// Get user's portfolio
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add stock to portfolio
router.post('/add-stock', auth, async (req, res) => {
  try {
    const { symbol, shares, purchasePrice } = req.body;
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user.id, stocks: [], cash: 0 });
    }

    portfolio.stocks.push({ symbol, shares, purchasePrice });
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cash balance
router.put('/update-cash', auth, async (req, res) => {
  try {
    const { cash } = req.body;
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user.id, stocks: [], cash });
    } else {
      portfolio.cash = cash;
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

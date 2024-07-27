const express = require('express');
const { getStockQuote } = require('../services/stockService');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/quote/:symbol', auth, async (req, res) => {
  try {
    const quote = await getStockQuote(req.params.symbol);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

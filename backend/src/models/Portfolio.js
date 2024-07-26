const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stocks: [{
    symbol: { type: String, required: true },
    shares: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
  }],
  cash: { type: Number, default: 0 }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);

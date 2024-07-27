const axios = require('axios');

const API_KEY = 'FKBVNLXXHC4Q4JPE';
const BASE_URL = 'https://www.alphavantage.co/query';

async function getStockQuote(symbol) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      }
    });
    
    const data = response.data['Global Quote'];
    return {
      symbol: data['01. symbol'],
      price: parseFloat(data['05. price']),
      change: parseFloat(data['09. change']),
      changePercent: parseFloat(data['10. change percent'].replace('%', ''))
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
}

module.exports = { getStockQuote };

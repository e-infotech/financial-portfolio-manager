import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortfolioVisualization from './PortfolioVisualization';
import './Portfolio.css';

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [cash, setCash] = useState('');
  const [realTimeData, setRealTimeData] = useState({});

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };
   
  useEffect(() => {
    if (portfolio) {
      fetchRealTimeData();
    }
  }, [portfolio]);

  const fetchRealTimeData = async () => {
    const data = {};
    for (const stock of portfolio.stocks) {
      try {
        const response = await axios.get(`/api/stocks/quote/${stock.symbol}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        data[stock.symbol] = response.data;
      } catch (error) {
        console.error(`Error fetching data for ${stock.symbol}:`, error);
      }
    }
    setRealTimeData(data);
  };
  
  const addStock = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/portfolio/add-stock', 
        { symbol, shares: Number(shares), purchasePrice: Number(purchasePrice) },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      fetchPortfolio();
      setSymbol('');
      setShares('');
      setPurchasePrice('');
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const updateCash = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/portfolio/update-cash', 
        { cash: Number(cash) },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      fetchPortfolio();
      setCash('');
    } catch (error) {
      console.error('Error updating cash:', error);
    }
  };

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div className="portfolio">
      <h2>Your Portfolio</h2>
      <h3>Cash: ${portfolio.cash}</h3>
      <h3>Stocks:</h3>
      <ul className="portfolio-stocks">
        {portfolio.stocks.map((stock, index) => (
          <li key={index} className="portfolio-stock-item">
            {stock.symbol} - Shares: {stock.shares}, Purchase Price: ${stock.purchasePrice}
            {realTimeData[stock.symbol] && (
              <span>
                , Current Price: ${realTimeData[stock.symbol].price}
                ({realTimeData[stock.symbol].changePercent > 0 ? '+' : ''}
                {realTimeData[stock.symbol].changePercent}%)
              </span>
            )}
          </li>
        ))}
      </ul>
      <PortfolioVisualization portfolio={portfolio} />
      <h3>Add Stock</h3>
      <form onSubmit={addStock} className="add-stock-form">
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          required
        />
        <button type="submit">Add Stock</button>
      </form>

      <h3>Update Cash</h3>
      <form onSubmit={updateCash}>
        <input
          type="number"
          placeholder="Cash Amount"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          required
        />
        <button type="submit">Update Cash</button>
      </form>
    </div>
  );
}

export default Portfolio;

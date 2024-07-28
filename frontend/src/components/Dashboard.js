import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PortfolioVisualization from './PortfolioVisualization';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchPortfolio();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setPortfolio(response.data);
    } catch (error) {
      setError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.username}!</h1>
      
      <div className="dashboard-section dashboard-summary">
        <h2>Portfolio Summary</h2>
        <p>Total Value: ${portfolio.cash + portfolio.stocks.reduce((sum, stock) => sum + stock.shares * stock.purchasePrice, 0)}</p>
        <p>Cash Balance: ${portfolio.cash}</p>
        <p>Number of Stocks: {portfolio.stocks.length}</p>
      </div>

      <div className="dashboard-section dashboard-actions">
        <h2>Quick Actions</h2>
        <Link to="/portfolio">Manage Portfolio</Link>
        <Link to="/trade">Trade Stocks</Link>
        <Link to="/analyze">Analyze Market</Link>
      </div>

      <div className="dashboard-section dashboard-visualization">
        <h2>Portfolio Visualization</h2>
        <PortfolioVisualization portfolio={portfolio} />
      </div>

      <div className="dashboard-section dashboard-recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Bought 10 shares of AAPL</li>
          <li>Sold 5 shares of GOOGL</li>
          <li>Added $1000 to cash balance</li>
        </ul>
      </div>

      <div className="dashboard-section dashboard-market-overview">
        <h2>Market Overview</h2>
        <p>S&P 500: +0.5%</p>
        <p>NASDAQ: -0.2%</p>
        <p>DOW: +0.3%</p>
      </div>
    </div>
  );
}

export default Dashboard;

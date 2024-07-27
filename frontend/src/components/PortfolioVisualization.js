import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PortfolioVisualization({ portfolio }) {
  // Prepare data for the pie chart (portfolio composition)
  const pieChartData = portfolio.stocks.map(stock => ({
    name: stock.symbol,
    value: stock.shares * stock.purchasePrice
  }));
  pieChartData.push({ name: 'Cash', value: portfolio.cash });

  // Prepare data for the bar chart (individual stock values)
  const barChartData = portfolio.stocks.map(stock => ({
    name: stock.symbol,
    value: stock.shares * stock.purchasePrice
  }));

  // Calculate total portfolio value
  const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <h2>Portfolio Visualization</h2>
      <h3>Total Portfolio Value: ${totalValue.toFixed(2)}</h3>
      
      <h3>Portfolio Composition</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({name, percent}) => `${name} ${(percent * 100).toFixed(2)}%`}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h3>Stock Values</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioVisualization;

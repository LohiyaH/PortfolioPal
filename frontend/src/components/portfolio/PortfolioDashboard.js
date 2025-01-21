import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import PortfolioChart from './PortfolioChart'; 

const STOCK_API_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.API_KEY; 

const PortfolioDashboard = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  useEffect(() => {
    const fetchStockPrice = async (ticker) => {
      try {
        const response = await fetch(
          `${STOCK_API_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${API_KEY}`
        );
        const data = await response.json();
        const latestDate = Object.keys(data['Time Series (Daily)'])[0];
        return parseFloat(data['Time Series (Daily)'][latestDate]['4. close']);
      } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
        return 0;
      }
    };

    const fetchPortfolioData = async () => {
      try {
        const response = await api.get('/portfolio');
        const portfolioStocks = response.data;

        const stocksWithValues = await Promise.all(portfolioStocks.map(async (stock) => {
          const currentPrice = await fetchStockPrice(stock.ticker);
          return { 
            ...stock, 
            currentValue: stock.quantity * currentPrice,
            investedValue: stock.quantity * stock.buyPrice
          };
        }));

        // Calculate invested amount
        const invested = stocksWithValues.reduce((acc, stock) => acc + stock.investedValue, 0);
        setInvestedAmount(invested);

        // Calculate total current value
        const total = stocksWithValues.reduce((acc, stock) => acc + stock.currentValue, 0);
        setTotalValue(total);

        // Calculate profit/loss
        setProfitLoss(total - invested);

        // Populate chart data
        const chartDataArray = stocksWithValues.map(stock => ({
          name: stock.name,
          value: stock.currentValue
        }));
        setChartData(chartDataArray);

      } catch (error) {
        console.error('Failed to fetch portfolio data', error);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Portfolio Dashboard</h2>
      
      <div className="metrics-container">
        <div className="metric-box">
          <h3 className="metric-title">Invested Amount</h3>
          <p className="metric-value">${investedAmount.toFixed(2)}</p>
        </div>
        
        <div className="metric-box">
          <h3 className="metric-title">Current Value</h3>
          <p className="metric-value">${totalValue.toFixed(2)}</p>
        </div>
        
        <div className="metric-box">
          <h3 className="metric-title">Profit/Loss</h3>
          <p className={`metric-value ${profitLoss >= 0 ? 'profit' : 'loss'}`}>${Math.abs(profitLoss).toFixed(2)}
            <span className="profit-indicator">{profitLoss >= 0 ? ' ▲' : ' ▼'}</span>
          </p>
        </div>
      </div>

      <div className="chart-container">
        {chartData.length > 0 ? (
          <PortfolioChart data={chartData} />
        ) : (
          <p className="no-data">No data available to display the chart.</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioDashboard;

import React from 'react';
import PortfolioDashboard from '../components/portfolio/PortfolioDashboard';
import StockHoldingList from '../components/portfolio/StockHoldingList';
import Navbar from '../components/Navbar/Navbar';
import './DashboardPage.css';

const DashboardPage = () => (
  <div>
    <Navbar />
    <div className="dashboard-main">
      <div className="dashboard-content">
        <div className="portfolio-summary">
          <PortfolioDashboard />
        </div>
        <div className="stock-list">
          <StockHoldingList />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPage;

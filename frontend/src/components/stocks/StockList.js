import React, { useEffect, useState } from 'react';
import AddstockModal from '../add/edit/AddstockModal';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // List of tickers to fetch data
  const symbols = [
    'TSCO.LON',
    'SHOP.TRT',
    'GPV.TRV',
    'MBG.DEX',
    '600104.SHH',
    '000002.SHZ',
  ];

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
  const STOCK_API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey=' + API_KEY;

  useEffect(() => {
    const fetchStockData = async () => {
      const fetchedStocks = [];
      for (const symbol of symbols) {
        try {
          const response = await fetch(STOCK_API_URL.replace('{symbol}', symbol));
          const data = await response.json();

          if (data["Meta Data"] && data["Time Series (Daily)"]) {
            const lastDate = Object.keys(data["Time Series (Daily)"])[0];
            const closePrice = parseFloat(data["Time Series (Daily)"][lastDate]["4. close"]);

            fetchedStocks.push({
              ticker: symbol,
              name: data["Meta Data"]["2. Symbol"],
              currentPrice: closePrice,
            });

          } else {
            console.warn(`No data available for symbol: ${symbol}`);
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
        }
      }
      setStocks(fetchedStocks);
    };

    const cachedData = localStorage.getItem('stocks');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds
      if (Date.now() - parsedData.timestamp < cacheDuration) {
        // Use cached data
        setStocks(parsedData.data);
      } else {
        // Cache is expired, fetch new data
        fetchStockData();
      }
    } else {
      // No cached data, fetch from API
      fetchStockData();
    }
  }, []); // Run only once on component mount

  const handleAddStock = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
  };

  const handleAddStockModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Available Stocks
        </h2>
        <button onClick={handleAddStockModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Stock
        </button>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stocks?.map((stock) => (
            <li
              key={stock.ticker}
              className="flex flex-col items-center bg-gray-50 p-4 shadow-sm rounded-md hover:shadow-md transition"
            >
              <p className="text-lg font-medium text-gray-700">
                {stock.name} ({stock.ticker})
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Current Price: <span className="font-semibold">${stock.currentPrice != null ? stock.currentPrice.toFixed(2) : 'N/A'}</span>
              </p>
              <button
                onClick={() => handleAddStock(stock)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add to Portfolio
              </button>
            </li>
          ))}
        </ul>
        {stocks.length === 0 && (
          <p className="text-gray-500 text-center mt-6">
            api is fetching in current time, but All are demo prices, Fetching api for a particular symbol one by one because multi-symbol was a premium api, so please be patient it would take time, sorry for inconvenience. 25 req/day is the limit for the standard free API!
          </p>
        )}
      </div>

      {showModal && (
        <AddstockModal
          onClose={handleCloseModal}
          onAdd={handleAddStock}
        />
      )}
    </div>
  );
};

export default StockList;

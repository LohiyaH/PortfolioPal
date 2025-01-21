import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AddEditStockModal from '../add/edit/AddEditStockModal';

const StockHoldingList = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/portfolio');
        const rawStocks = response.data;
        
        // Group stocks by ticker
        const stocksByTicker = rawStocks.reduce((acc, stock) => {
          if (!acc[stock.ticker]) {
            acc[stock.ticker] = {
              stocks: [],
              totalQuantity: 0,
              totalValue: 0
            };
          }
          acc[stock.ticker].stocks.push(stock);
          acc[stock.ticker].totalQuantity += stock.quantity;
          acc[stock.ticker].totalValue += (stock.buyPrice * stock.quantity);
          return acc;
        }, {});

        // Calculate consolidated stocks with average prices
        const consolidatedStocks = Object.entries(stocksByTicker).map(([ticker, data]) => {
          const averagePrice = data.totalValue / data.totalQuantity;
          console.log(`Ticker: ${ticker}, Average Price: ${averagePrice}`); // Debugging log
          return {
            id: data.stocks[0].id, // Keep first ID for reference
            name: data.stocks[0].name,
            ticker: ticker,
            quantity: data.totalQuantity,
            buyPrice: averagePrice, // Calculate average price
            originalStocks: data.stocks // Keep original stocks for reference
          };
        });

        setStocks(consolidatedStocks);
      } catch (error) {
        console.error('Failed to fetch portfolio stocks', error);
      }
    };
    fetchPortfolio();
  }, []);

  const handleDelete = async (id) => {
    try {
      // When deleting, we need to delete all original stocks with this ticker
      const stockToDelete = stocks.find(s => s.id === id);
      const deletePromises = stockToDelete.originalStocks.map(original => 
        api.delete(`/portfolio/${original.id}`)
      );
      await Promise.all(deletePromises);
      setStocks(stocks.filter((stock) => stock.id !== id));
    } catch (error) {
      console.error('Failed to delete stock', error);
    }
  };

  const handleEdit = (stock) => setSelectedStock(stock);

  const handleSave = async (updatedStock) => {
    try {
      if (updatedStock.id) {
        await api.put('/portfolio', updatedStock);
      } else {
        await api.post('/portfolio', updatedStock);
      }
      setSelectedStock(null);
      // Refresh portfolio list
      const response = await api.get('/portfolio');
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to save stock', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Stock Holdings</h2>
        <ul className="divide-y divide-gray-200">
          {stocks?.map((stock) => (
            <li
              key={stock.id}
              className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {stock.name} ({stock.ticker})
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {stock.quantity}, Average Buy Price: ${stock.buyPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(stock)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stock.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {stocks.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No stocks in your portfolio.</p>
        )}
        {selectedStock && (
          <AddEditStockModal
            stock={selectedStock}
            onSave={handleSave}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StockHoldingList;

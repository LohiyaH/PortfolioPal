const Portfolio = require('../models/Portfolio');

exports.getPortfolio = async (req, res) => {
  try {
    const stocks = await Portfolio.getAllStocks();
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: `Failed to fetch portfolio: ${error.message}` });
  }
};

exports.addStock = async (req, res) => {
  try {
    const stock = req.body;
    // Add validation
    if (!stock.name || !stock.ticker || !stock.quantity || !stock.buyPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('Attempting to add stock:', stock);
    await Portfolio.addStock(stock);
    res.status(201).json({ message: 'Stock added successfully' });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: `Failed to add stock: ${error.message}` });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const stock = req.body;
    if (!stock.id || !stock.quantity || !stock.buyPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await Portfolio.updateStock(stock);
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: `Failed to update stock: ${error.message}` });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Stock ID is required' });
    }
    
    await Portfolio.deleteStock(id);
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: `Failed to delete stock: ${error.message}` });
  }
};
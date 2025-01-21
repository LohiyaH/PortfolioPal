let db = null;

const getDb = async () => {
  if (!db) {
    db = await require('./db');
  }
  return db;
};

const Portfolio = {
  async getAllStocks() {
    const pool = await getDb();
    const [rows] = await pool.query('SELECT * FROM portfolio');
    return rows;
  },

  async addStock(stock) {
    const pool = await getDb();
    const query = `INSERT INTO portfolio (name, ticker, quantity, buyPrice) VALUES (?, ?, ?, ?)`;
    await pool.query(query, [stock.name, stock.ticker, stock.quantity, stock.buyPrice]);
  },

  async updateStock(stock) {
    const pool = await getDb();
    const query = `UPDATE portfolio SET quantity = ?, buyPrice = ? WHERE id = ?`;
    await pool.query(query, [stock.quantity, stock.buyPrice, stock.id]);
  },

  async deleteStock(id) {
    const pool = await getDb();
    await pool.query('DELETE FROM portfolio WHERE id = ?', [id]);
  },
};

module.exports = Portfolio;


